import { NextResponse } from 'next/server';
// ye vala part not done.
let users: { email: string; password: string; id: string }[] = [];

export async function POST(req: Request) {
  const { email, password } = await req.json();

  if (users.find(u => u.email === email)) {
    return NextResponse.json({ error: 'User already exists' }, { status: 400 });
  }

  const newUser = { id: Date.now().toString(), email, password };
  users.push(newUser);
  const token = `${newUser.id}-token`;

  return NextResponse.json({ user: newUser, token });
}
