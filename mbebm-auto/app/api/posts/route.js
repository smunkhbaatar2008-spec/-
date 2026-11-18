import { NextResponse } from 'next/server';
import { del } from '@vercel/blob';
import { readDb, writeDb, isAdmin } from '@/lib/store';

export async function POST(req) {
  if (!(await isAdmin())) return NextResponse.json({ error: 'auth' }, { status: 401 });
  const { title, text, video, images } = await req.json();
  if (!title?.trim()) return NextResponse.json({ error: 'title' }, { status: 400 });
  const db = await readDb();
  db.posts.unshift({
    id: Date.now().toString(), title: title.slice(0, 120), text: (text || '').slice(0, 2000),
    video: (video || '').slice(0, 300), images: Array.isArray(images) ? images.slice(0, 8) : [],
    date: new Date().toISOString().slice(0, 10),
  });
  await writeDb(db);
  return NextResponse.json({ ok: true });
}
export async function DELETE(req) {
  if (!(await isAdmin())) return NextResponse.json({ error: 'auth' }, { status: 401 });
  const id = new URL(req.url).searchParams.get('id');
  const db = await readDb();
  const p = db.posts.find((x) => x.id === id);
  db.posts = db.posts.filter((x) => x.id !== id);
  await writeDb(db);
  if (p?.images?.length && process.env.BLOB_READ_WRITE_TOKEN) {
    try { await del(p.images.filter((u) => u.startsWith('http'))); } catch {}
  }
  return NextResponse.json({ ok: true });
}
