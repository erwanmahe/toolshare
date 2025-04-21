import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET ?? 'devsecret';

export async function GET() {
  const token = (await cookies()).get('token')?.value;
  if (!token) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  try {
    const payload = jwt.verify(token, JWT_SECRET) as { userId: number, username: string };
    return NextResponse.json({ ok: true, userId: payload.userId, username: payload.username });
  } catch {
    return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
  }
}
