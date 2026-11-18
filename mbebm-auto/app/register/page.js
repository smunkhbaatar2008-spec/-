'use client';
import { useState } from 'react';
import Link from 'next/link';

export default function Register() {
  const [f, setF] = useState({ name: '', phone: '', course: 'Эрчимжүүлсэн сургалт', note: '', website: '' });
  const [state, setState] = useState('idle');
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setState('sending');
    const r = await fetch('/api/register', { method: 'POST', body: JSON.stringify(f) });
    setState(r.ok ? 'done' : 'error');
  };

  return (
    <main className="reg">
      <Link href="/" className="back">← Нүүр хуудас</Link>
      <div className="reg-card">
        {state === 'done' ? (
          <div className="done">
            <h1>Бүртгэл амжилттай</h1>
            <p>Таны мэдээллийг хүлээн авлаа. Бид удахгүй утсаар холбогдоно.</p>
            <Link href="/" className="btn">Нүүр хуудас руу буцах</Link>
          </div>
        ) : (
          <form onSubmit={submit}>
            <h1>Сургалтад бүртгүүлэх</h1>
            <p className="muted">Нэр, утасны дугаараа үлдээнэ үү.</p>
            <label>Овог, нэр<input required value={f.name} onChange={set('name')} autoComplete="name" /></label>
            <label>Утасны дугаар<input required type="tel" inputMode="tel" value={f.phone} onChange={set('phone')} autoComplete="tel" placeholder="99112233" /></label>
            <label>Сургалтын төрөл
              <select value={f.course} onChange={set('course')}>
                <option>Эрчимжүүлсэн сургалт</option>
                <option>Мөн төсөөрсөн жолооны сургалт</option>
                <option>Лавлах</option>
              </select>
            </label>
            <label>Нэмэлт тайлбар (заавал биш)<textarea rows="3" value={f.note} onChange={set('note')} /></label>
            <input className="trap" tabIndex="-1" autoComplete="off" value={f.website} onChange={set('website')} aria-hidden="true" />
            {state === 'error' && <p className="err">Илгээж чадсангүй. Нэр, утасны дугаараа шалгаад дахин оролдоно уу.</p>}
            <button className="btn" disabled={state === 'sending'}>{state === 'sending' ? 'Илгээж байна' : 'Бүртгүүлэх'}</button>
          </form>
        )}
      </div>
    </main>
  );
}
