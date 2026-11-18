import fs from 'fs/promises';
import path from 'path';
import { cookies } from 'next/headers';
import { createHash } from 'crypto';
import { Redis } from '@upstash/redis';

const url = process.env.UPSTASH_REDIS_REST_URL || process.env.KV_REST_API_URL;
const tok = process.env.UPSTASH_REDIS_REST_TOKEN || process.env.KV_REST_API_TOKEN;
const redis = url && tok ? new Redis({ url, token: tok }) : null;
const file = path.join(process.cwd(), 'data', 'db.json');

export const seed = {
  settings: {
    notice: 'Өдөр бүр элсэлт авч байна!',
    duration: '14–45',
    tuition: '1,000,000',
    practice: '550,000',
    phone: '91088998',
    address: 'Жуков, Кино үйлдвэрийн хойно Ромео Жульетта хотхоны үйлчилгээний төвийн 2 давхар, 18 тоот',
  },
  posts: [],
  regs: [],
};

export async function readDb() {
  let d = null;
  if (redis) d = await redis.get('mbebm');
  else { try { d = JSON.parse(await fs.readFile(file, 'utf8')); } catch {} }
  return { ...seed, ...(d || {}), settings: { ...seed.settings, ...(d?.settings || {}) } };
}
export async function writeDb(d) {
  if (redis) return redis.set('mbebm', d);
  await fs.mkdir(path.dirname(file), { recursive: true });
  await fs.writeFile(file, JSON.stringify(d, null, 2));
}

export const adminPassword = () =>
  process.env.ADMIN_PASSWORD || (process.env.NODE_ENV !== 'production' ? 'admin123' : null);
export const token = () =>
  createHash('sha256').update((adminPassword() || 'none') + 'mbebm-v2').digest('hex');
export const isAdmin = async () =>
  !!adminPassword() && cookies().get('admin')?.value === token();
