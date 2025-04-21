import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'devsecret';

function getUserFromRequest(req: NextRequest) {
  const cookie = req.cookies.get('token')?.value;
  if (!cookie) return null;
  try {
    return jwt.verify(cookie, JWT_SECRET) as { username: string };
  } catch {
    return null;
  }
}

// PATCH: Edit a tool
export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const id = Number(params.id);
  const user = getUserFromRequest(req);
  if (!user) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  const tool = await prisma.tool.findUnique({ where: { id } });
  if (!tool || tool.owner !== user.username) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }
  const data = await req.json();
  const updated = await prisma.tool.update({ where: { id }, data });
  return NextResponse.json(updated);
}

// DELETE: Delete a tool
export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const id = Number(params.id);
  const user = getUserFromRequest(req);
  if (!user) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  const tool = await prisma.tool.findUnique({ where: { id } });
  if (!tool || tool.owner !== user.username) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }
  await prisma.tool.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
