import Link from 'next/link';
import { readDb } from '@/lib/store';

export function Header() {
  return (
    <header className="bar">
      <Link href="/" className="brand">
        <svg viewBox="0 0 40 36" width="34" height="31" aria-hidden="true">
          <path d="M20 2 38 33H2Z" fill="#d8232a" stroke="#fff" strokeWidth="3" strokeLinejoin="round" />
          <text x="20" y="28" textAnchor="middle" fontSize="15" fontWeight="800" fill="#fff">C</text>
        </svg>
        <span>МБЭБМ<small>Авто сургалтын төв</small></span>
      </Link>
      <nav>
        <Link href="/#price">Үнэ</Link>
        <Link href="/#posts">Бичлэг</Link>
        <Link href="/register" className="pill">Бүртгүүлэх</Link>
      </nav>
    </header>
  );
}

export async function Footer() {
  const { settings: s } = await readDb();
  return (
    <footer className="foot">
      <div className="roadline" />
      <div className="wrap foot-in">
        <div><h3>Хаяг</h3><p>{s.address}</p></div>
        <div><h3>Утас</h3><p><a href={`tel:${s.phone}`}>{s.phone}</a></p>
        </div>
      </div>
    </footer>
  );
}
