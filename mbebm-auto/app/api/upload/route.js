import fs from 'fs/promises';
import path from 'path';
import { NextResponse } from 'next/server';
import { put } from '@vercel/blob';
import { isAdmin } from '@/lib/store';

export async function POST(req) {
  if (!(await isAdmin())) return NextResponse.json({ error: 'auth' }, { status: 401 });
  const f = (await req.formData()).get('file');
  if (!f || !f.type?.startsWith('image/')) return NextResponse.json({ error: 'type' }, { status: 400 });
  const name = `${Date.now()}-${Math.random().toString(36).slice(2, 7)}.jpg`;
  if (process.env.BLOB_READ_WRITE_TOKEN) {
    const b = await put('mbebm/' + name, f, { access: 'public' });
    return NextResponse.json({ url: b.url });
  }
  const dir = path.join(process.cwd(), 'public', 'uploads');
  await fs.mkdir(dir, { recursive: true });
  await fs.writeFile(path.join(dir, name), Buffer.from(await f.arrayBuffer()));
  return NextResponse.json({ url: '/uploads/' + name });
}
