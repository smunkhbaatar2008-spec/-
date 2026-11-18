import { NextResponse } from 'next/server';
import { token, adminPassword } from '@/lib/store';

export async function POST(req) {
  const { password } = await req.json();
  const real = adminPassword();
  if (!real || password !== real) return NextResponse.json({ ok: false }, { status: 401 });
  const res = NextResponse.json({ ok: true });
  res.cookies.set('admin', token(), {
    httpOnly: true, sameSite: 'lax', path: '/', maxAge: 60 * 60 * 24 * 7,
    secure: process.env.NODE_ENV === 'production',
  });
  return res;
}
export async function DELETE() {
  const res = NextResponse.json({ ok: true });
  res.cookies.delete('admin');
  return res;
}
