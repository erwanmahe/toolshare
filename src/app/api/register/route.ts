import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  const { username, password } = await req.json();
  if (!username || !password) {
    return NextResponse.json({ error: 'Missing username or password' }, { status: 400 });
  }
  const existing = await prisma.user.findUnique({ where: { username } });
  if (existing) {
    return NextResponse.json({ error: 'Username already exists' }, { status: 409 });
  }
  const hash = await bcrypt.hash(password, 10);
  const user = await prisma.user.create({ data: { username, password: hash } });
  // Optionally, set a cookie/session here
  return NextResponse.json({ id: user.id, username: user.username });
}
