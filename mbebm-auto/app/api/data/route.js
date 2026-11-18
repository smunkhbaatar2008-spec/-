import { NextResponse } from 'next/server';
import { readDb, writeDb, isAdmin } from '@/lib/store';

export const dynamic = 'force-dynamic';

export async function GET() {
  const db = await readDb();
  const authed = await isAdmin();
  return NextResponse.json({
    settings: db.settings, posts: db.posts, authed,
    regs: authed ? db.regs : [],
  });
}
export async function PUT(req) {
  if (!(await isAdmin())) return NextResponse.json({ error: 'auth' }, { status: 401 });
  const db = await readDb();
  const b = await req.json();
  for (const k of Object.keys(db.settings)) if (typeof b[k] === 'string') db.settings[k] = b[k].slice(0, 300);
  await writeDb(db);
  return NextResponse.json({ ok: true });
}
