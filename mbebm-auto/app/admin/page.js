'use client';
import { useEffect, useState } from 'react';

const labels = {
  notice: 'Зар, анхааруулга', duration: 'Хоногийн хугацаа (жнь 14–45)', tuition: 'Сургалтын төлбөр',
  practice: 'Мөн төсөөрсөн жолооны сургалтын үнэ', phone: 'Утас', address: 'Хаяг',
};

async function shrink(file) {
  const bmp = await createImageBitmap(file);
  const s = Math.min(1, 1600 / Math.max(bmp.width, bmp.height));
  const c = document.createElement('canvas');
  c.width = Math.round(bmp.width * s); c.height = Math.round(bmp.height * s);
  c.getContext('2d').drawImage(bmp, 0, 0, c.width, c.height);
  return new Promise((r) => c.toBlob(r, 'image/jpeg', 0.82));
}

export default function Admin() {
  const [data, setData] = useState(null);
  const [tab, setTab] = useState('regs');
  const [pw, setPw] = useState('');
  const [msg, setMsg] = useState('');
  const [post, setPost] = useState({ title: '', text: '', video: '' });
  const [files, setFiles] = useState([]);
  const [busy, setBusy] = useState(false);

  const load = () => fetch('/api/data', { cache: 'no-store' }).then((r) => r.json()).then(setData);
  useEffect(() => { load(); }, []);
  const flash = (t) => { setMsg(t); setTimeout(() => setMsg(''), 3000); };

  const login = async (e) => {
    e.preventDefault();
    const r = await fetch('/api/login', { method: 'POST', body: JSON.stringify({ password: pw }) });
    r.ok ? load() : flash('Нууц үг буруу байна');
  };
  const logout = async () => { await fetch('/api/login', { method: 'DELETE' }); load(); };
  const save = async () => {
    const r = await fetch('/api/data', { method: 'PUT', body: JSON.stringify(data.settings) });
    flash(r.ok ? 'Хадгалагдлаа' : 'Хадгалж чадсангүй');
  };
  const addPost = async (e) => {
    e.preventDefault();
    setBusy(true);
    try {
      const urls = [];
      for (const f of files) {
        const blob = await shrink(f);
        const fd = new FormData(); fd.append('file', blob, 'photo.jpg');
        const r = await fetch('/api/upload', { method: 'POST', body: fd });
        if (!r.ok) throw new Error('upload');
        urls.push((await r.json()).url);
      }
      const r = await fetch('/api/posts', { method: 'POST', body: JSON.stringify({ ...post, images: urls }) });
      if (!r.ok) throw new Error('post');
      setPost({ title: '', text: '', video: '' }); setFiles([]);
      flash('Бичлэг нэмэгдлээ'); load();
    } catch { flash('Алдаа гарлаа. Дахин оролдоно уу.'); }
    setBusy(false);
  };
  const del = async (url, id, what) => {
    if (!confirm(`${what} устгах уу?`)) return;
    await fetch(`${url}?id=${id}`, { method: 'DELETE' });
    load();
  };

  if (!data) return <main className="admin"><p>Уншиж байна</p></main>;
  if (!data.authed)
    return (
      <main className="admin narrow">
        <h1>Админ нэвтрэх</h1>
        <form onSubmit={login}>
          <input type="password" placeholder="Нууц үг" value={pw} onChange={(e) => setPw(e.target.value)} />
          <button className="btn">Нэвтрэх</button>
        </form>
        {msg && <p className="msg">{msg}</p>}
      </main>
    );

  return (
    <main className="admin">
      <div className="row"><h1>Админ самбар</h1><span><a href="/">Сайт үзэх</a> <button className="sm" onClick={logout}>Гарах</button></span></div>
      {msg && <p className="msg">{msg}</p>}
      <div className="tabs">
        <button className={tab === 'regs' ? 'on' : ''} onClick={() => setTab('regs')}>Бүртгэл ({data.regs.length})</button>
        <button className={tab === 'posts' ? 'on' : ''} onClick={() => setTab('posts')}>Бичлэг ({data.posts.length})</button>
        <button className={tab === 'info' ? 'on' : ''} onClick={() => setTab('info')}>Үнэ, мэдээлэл</button>
      </div>

      {tab === 'regs' && (data.regs.length === 0 ? <p className="muted">Одоогоор бүртгэл ирээгүй байна.</p> :
        data.regs.map((r) => (
          <div className="item" key={r.id}>
            <div>
              <b>{r.name}</b> · <a href={`tel:${r.phone}`}>{r.phone}</a>
              <div className="muted">{r.course} · {new Date(r.date).toLocaleString('mn-MN')}</div>
              {r.note && <div>{r.note}</div>}
            </div>
            <button className="sm danger" onClick={() => del('/api/register', r.id, 'Бүртгэлийг')}>Устгах</button>
          </div>
        )))}

      {tab === 'posts' && (
        <>
          <form onSubmit={addPost} className="box">
            <h2>Шинэ бичлэг</h2>
            <input placeholder="Гарчиг" required value={post.title} onChange={(e) => setPost({ ...post, title: e.target.value })} />
            <textarea rows="3" placeholder="Тайлбар" value={post.text} onChange={(e) => setPost({ ...post, text: e.target.value })} />
            <label className="file">Зураг сонгох (утасны галерейгаас)
              <input type="file" accept="image/*" multiple onChange={(e) => setFiles([...e.target.files].slice(0, 8))} />
            </label>
            {files.length > 0 && (
              <div className="prev">{files.map((f, i) => (
                <div key={i}><img src={URL.createObjectURL(f)} alt="" />
                  <button type="button" onClick={() => setFiles(files.filter((_, j) => j !== i))}>×</button></div>
              ))}</div>
            )}
            <input placeholder="YouTube холбоос (заавал биш)" value={post.video} onChange={(e) => setPost({ ...post, video: e.target.value })} />
            <button className="btn" disabled={busy}>{busy ? 'Илгээж байна' : 'Нийтлэх'}</button>
          </form>
          {data.posts.map((p) => (
            <div className="item" key={p.id}>
              <div><b>{p.title}</b><div className="muted">{p.date} · {p.images?.length || 0} зураг</div></div>
              <button className="sm danger" onClick={() => del('/api/posts', p.id, 'Бичлэгийг')}>Устгах</button>
            </div>
          ))}
        </>
      )}

      {tab === 'info' && (
        <div className="box">
          {Object.keys(labels).map((k) => (
            <label key={k}>{labels[k]}
              <input value={data.settings[k] || ''} onChange={(e) => setData({ ...data, settings: { ...data.settings, [k]: e.target.value } })} />
            </label>
          ))}
          <button className="btn" onClick={save}>Хадгалах</button>
        </div>
      )}
    </main>
  );
}
