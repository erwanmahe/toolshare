import { NextResponse } from 'next/server';

export async function POST() {
  // Remove the JWT cookie
  return NextResponse.json({ ok: true }, {
    status: 200,
    headers: {
      'Set-Cookie': 'token=; Path=/; HttpOnly; Max-Age=0; SameSite=Lax',
    },
  });
}
