const BASE = process.env.NEXT_PUBLIC_API_BASE_URL || '';
/* Ye vala part for new chat create.*/
export async function createChat(title?: string) {
  const res = await fetch(`${BASE}/api/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title: title || 'Untitled Chat' }),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Failed to create chat: ${text}`);
  }

  return res.json();
}

/* Ye vala part for fetch all chats.*/
export async function fetchChats() {
  const res = await fetch(`${BASE}/api/chats`, { cache: 'no-store' });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Failed to fetch chats: ${text}`);
  }
  return res.json();
}

/*Ye vala part for fetch a single chat by ID. */
export async function fetchChat(chatId: string) {
  const res = await fetch(`${BASE}/api/chat/${chatId}`, { cache: 'no-store' });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Failed to fetch chat: ${text}`);
  }
  return res.json();
}

/*Ye vala part for send a message and geting streamed response.*/
export async function sendMessage(
  chatId: string,
  content: string
): Promise<ReadableStream<Uint8Array> | null> {
  const res = await fetch(`${BASE}/api/chat/${chatId}/message`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ content }),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`sendMessage failed: ${text}`);
  }
  return res.body;
}

/*Ye vala part for stop an ongoing message generation for a chat.*/
export async function stopMessage(chatId: string) {
  const res = await fetch(`${BASE}/api/chat/${chatId}/stop`, { method: 'POST' });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Failed to stop generation: ${text}`);
  }
  return res.json();
}

/*Ye vala part for update the title of a chat.*/
export async function updateChatTitle(chatId: string, title: string) {
  const res = await fetch(`${BASE}/api/chat/${chatId}/title`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title }),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Failed to update chat title: ${text}`);
  }
  return res.json();
}

/*Ye vala part for delete a chat by ID.*/
export async function deleteChat(chatId: string) {
  const res = await fetch(`${BASE}/api/chat/${chatId}`, { method: 'DELETE' });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Failed to delete chat: ${text}`);
  }
  return res.json();
}

/*Ye vala part for authentication APIs.*/
export async function login(email: string, password: string) {
  const res = await fetch(`${BASE}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  if (!res.ok) throw new Error('Login failed');
  return res.json();
}

export async function signup(email: string, password: string) {
  const res = await fetch(`${BASE}/api/auth/signup`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  if (!res.ok) throw new Error('Signup failed');
  return res.json();
}

export async function me() {
  const token = localStorage.getItem('token');
  const res = await fetch(`${BASE}/api/auth/me`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error('Not logged in');
  return res.json();
}
