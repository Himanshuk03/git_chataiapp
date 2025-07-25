import { NextResponse } from 'next/server';
// this part not done.
let users: { email: string; password: string; id: string }[] = [];

export async function POST(req: Request) {
  const { email, password } = await req.json();
  const user = users.find(u => u.email === email && u.password === password);

  if (!user) {
    return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
  }

  const token = `${user.id}-token`;
  return NextResponse.json({ user, token });
}
