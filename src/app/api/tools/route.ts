import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET: List tools with optional filters
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const type = searchParams.get('type') || undefined;
  const owner = searchParams.get('owner') || undefined;
  const state = searchParams.get('state') || undefined;
  const search = searchParams.get('search') || undefined;
  const where: any = {};
  if (type) where.type = type;
  if (owner) where.owner = owner;
  if (state) where.state = state;
  if (search) {
    where.OR = [
      { name: { contains: search, mode: 'insensitive' } },
      { description: { contains: search, mode: 'insensitive' } },
    ];
  }
  const tools = await prisma.tool.findMany({ where, orderBy: { id: 'asc' } });
  return NextResponse.json(tools);
}

// POST: Add a new tool
export async function POST(req: NextRequest) {
  const data = await req.json();
  const tool = await prisma.tool.create({ data });
  return NextResponse.json(tool);
}
