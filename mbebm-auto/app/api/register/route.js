import { NextResponse } from 'next/server';
import { readDb, writeDb, isAdmin } from '@/lib/store';

export async function POST(req) {
  const b = await req.json();
  if (b.website) return NextResponse.json({ ok: true });
  const name = String(b.name || '').trim().slice(0, 80);
  const phone = String(b.phone || '').replace(/[^\d+]/g, '').slice(0, 15);
  if (name.length < 2 || phone.length < 8) return NextResponse.json({ error: 'invalid' }, { status: 400 });
  const db = await readDb();
  if (db.regs.length >= 2000) return NextResponse.json({ error: 'full' }, { status: 429 });
  db.regs.unshift({
    id: Date.now().toString(), name, phone,
    course: String(b.course || '').slice(0, 80), note: String(b.note || '').slice(0, 500),
    date: new Date().toISOString(),
  });
  await writeDb(db);
  return NextResponse.json({ ok: true });
}
export async function DELETE(req) {
  if (!(await isAdmin())) return NextResponse.json({ error: 'auth' }, { status: 401 });
  const id = new URL(req.url).searchParams.get('id');
  const db = await readDb();
  db.regs = db.regs.filter((x) => x.id !== id);
  await writeDb(db);
  return NextResponse.json({ ok: true });
}
