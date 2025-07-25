const fetch = require('node-fetch');
async function* streamOllamaResponse(prompt, signal) {
  const res = await fetch('http://localhost:11434/api/generate', {
    method: 'POST',
    signal,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ model: 'gemma:1b', prompt, stream: true }),
  });
  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    yield decoder.decode(value);
  }
}
module.exports = { streamOllamaResponse };
