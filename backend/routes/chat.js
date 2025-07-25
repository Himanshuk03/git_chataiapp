const express = require('express');
const { pool } = require('../db');
const router = express.Router();

const OLLAMA_URL = process.env.OLLAMA_URL || 'http://localhost:11434';//default 11434
const OLLAMA_MODEL = process.env.OLLAMA_MODEL || 'gemma:2b';

async function ensureSchema() {
  // ye vaalaa line forfor random id create gen_random_uuid()
  await pool.query(`CREATE EXTENSION IF NOT EXISTS "pgcrypto";`);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS chats (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      title TEXT NOT NULL DEFAULT 'Untitled chat',
      created_at TIMESTAMPTZ NOT NULL DEFAULT now()
    );
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS messages (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      chat_id UUID NOT NULL REFERENCES chats(id) ON DELETE CASCADE,
      role TEXT NOT NULL CHECK (role IN ('user','assistant','system')),
      content TEXT NOT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT now()
    );
  `);
}

// ye vala simple UUID v4-ish validator part hai
function isUuidLike(id) {
  return /^[0-9a-fA-F-]{36}$/.test(id);
}

// this vala part call once on module load
ensureSchema().catch((e) => {
  console.error('Failed to ensure schema', e);
  process.exit(1);
});

// ye valaa part will track abort controllers per chat
const abortControllers = new Map();

// yahaan se below routes define hain

// GET /api/chats to list all chats
router.get('/chats', async (_req, res) => {
  try {
    const { rows } = await pool.query(
      `SELECT id, title, created_at
       FROM chats
       ORDER BY created_at DESC`
    );
    res.json(rows);
  } catch (err) {
    console.error('GET /chats error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /api/chat to create new chat
router.post('/chat', async (_req, res) => {
  try {
    const { rows } = await pool.query(
      `INSERT INTO chats (title)
       VALUES ($1)
       RETURNING id, title, created_at`,
      ['Untitled chat']
    );
    res.status(201).json(rows[0]);
  } catch (err) {
    console.error('POST /chat error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// PATCH /api/chat/:chatId/title to update title
router.patch('/chat/:chatId/title', async (req, res) => {
  const { chatId } = req.params;
  const { title } = req.body;

  if (!isUuidLike(chatId)) {
    return res.status(400).json({ error: 'Invalid chat id' });
  }

  try {
    const { rows } = await pool.query(
      `UPDATE chats SET title = $1 WHERE id = $2 RETURNING id, title, created_at`,
      [title, chatId]
    );
    if (!rows.length) return res.status(404).json({ error: 'Chat not found' });
    res.json(rows[0]);
  } catch (err) {
    console.error('PATCH /chat/:chatId/title error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /api/chat/:chatId to full message history
router.get('/chat/:chatId', async (req, res) => {
  const { chatId } = req.params;
  try {
    console.log("Fetching chat with ID:", chatId);
    const chatRes = await pool.query(
      `SELECT id, title, created_at FROM chats WHERE id = $1`,
      [chatId]
    );

    if (!chatRes.rows.length) {
      console.log("Chat not found:", chatId);
      return res.status(404).json({ error: 'Chat not found' });
    }

    const msgRes = await pool.query(
      `SELECT id, role, content, created_at AS timestamp
       FROM messages
       WHERE chat_id = $1
       ORDER BY created_at ASC`,
      [chatId]
    );

    res.json({
      id: chatId,
      title: chatRes.rows[0].title,
      created_at: chatRes.rows[0].created_at,
      messages: msgRes.rows,
    });
  } catch (err) {
    console.error('GET /chat/:chatId error:', err.stack); // Add full stack trace
    res.status(500).json({ error: 'Internal server error' });
  }
});


// POST /api/chat/:chatId/message to send user msg aur dusra stream assistant reply
router.post('/chat/:chatId/message', async (req, res) => {
  const { chatId } = req.params;
  const { content } = req.body;

  if (!isUuidLike(chatId)) {
    return res.status(400).json({ error: 'Invalid chat id' });
  }

  try {
    // ye valaa part will verify chat exists
    const chatExists = await pool.query(`SELECT 1 FROM chats WHERE id = $1`, [chatId]);
    if (!chatExists.rowCount) return res.status(404).json({ error: 'Chat not found' });

    // ye valaa part for insert user message
    await pool.query(
      `INSERT INTO messages (chat_id, role, content) VALUES ($1, 'user', $2)`,
      [chatId, content]
    );

    // ye valaa part to prepare to stream to client
    res.setHeader('Content-Type', 'text/plain; charset=utf-8');
    res.flushHeaders?.();

    const controller = new AbortController();
    abortControllers.set(chatId, controller);

    // and ye valaa part for calling of Ollama
    const ollamaRes = await fetch(`${OLLAMA_URL}/api/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: OLLAMA_MODEL,
        prompt: content,
        stream: true,
      }),
      signal: controller.signal,
    });

    if (!ollamaRes.ok || !ollamaRes.body) {
      abortControllers.delete(chatId);
      return res.status(500).end('OLLAMA_ERROR');
    }

    const reader = ollamaRes.body.getReader();
    const decoder = new TextDecoder();
    let assistantFull = '';

    // suppose if client disconnects, tabhi abort ke liye Ollama
    req.on('close', () => {
      try {
        controller.abort();
      } catch (_) {}
    });

    while (true) {
      const { value, done } = await reader.read();
      if (done) break;

      const chunk = decoder.decode(value);
      // ye line for Ollama streaming to jSon lines
      const lines = chunk.split('\n').filter(Boolean);
      for (const line of lines) {
        try {
          const json = JSON.parse(line);
          if (json.response) {
            assistantFull += json.response;
            res.write(json.response);
          }
          if (json.done) {
            // save assistant message then ending vala part
            await pool.query(
              `INSERT INTO messages (chat_id, role, content) VALUES ($1, 'assistant', $2)`,
              [chatId, assistantFull]
            );
            abortControllers.delete(chatId);
            return res.end();
          }
        } catch (e) {
          // my exception
        }
      }
    }

    // ye vaalaa part for fallback if no "done" received
    await pool.query(
      `INSERT INTO messages (chat_id, role, content) VALUES ($1, 'assistant', $2)`,
      [chatId, assistantFull]
    );
    abortControllers.delete(chatId);
    res.end();
  } catch (err) {
    console.error('POST /chat/:chatId/message error:', err);
    abortControllers.delete(chatId);
    if (!res.headersSent) {
      res.status(500).json({ error: 'Internal server error' });
    } else {
      res.end();
    }
  }
});

// POST /api/chat/:chatId/stop to abort
router.post('/chat/:chatId/stop', async (req, res) => {
  const { chatId } = req.params;
  const controller = abortControllers.get(chatId);
  if (controller) {
    try {
      controller.abort();
      abortControllers.delete(chatId);
      return res.json({ ok: true });
    } catch (e) {
      console.error('Abort error', e);
      return res.status(500).json({ error: 'Failed to stop' });
    }
  }
  return res.json({ ok: true });
});

// DELETE /api/chat/:chatId to delete a chat
router.delete('/chat/:chatId', async (req, res) => {
  const { chatId } = req.params;
  try {
    const result = await pool.query('DELETE FROM chats WHERE id = $1 RETURNING id', [chatId]);
    if (result.rowCount === 0) return res.status(404).json({ error: 'Chat not found' });
    res.json({ success: true });
  } catch (err) {
    console.error('DELETE /chat/:chatId error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});


module.exports = router;
