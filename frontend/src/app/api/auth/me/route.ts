import { NextResponse } from 'next/server';
// ye vala part not done.
let users: { email: string; password: string; id: string }[] = [];

export async function GET(req: Request) {
  const auth = req.headers.get('authorization');
  if (!auth) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const token = auth.split(' ')[1];
  const userId = token?.split('-')[0];
  const user = users.find(u => u.id === userId);

  if (!user) return NextResponse.json({ error: 'Invalid token' }, { status: 401 });

  return NextResponse.json({ user });
}
