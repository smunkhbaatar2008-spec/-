import Link from 'next/link';
import { readDb } from '@/lib/store';
import { Header, Footer } from '@/components/Chrome';

export const dynamic = 'force-dynamic';

const yt = (u = '') => {
  const m = u.match(/(?:youtu\.be\/|v=|embed\/)([\w-]{11})/);
  return m ? `https://www.youtube.com/embed/${m[1]}` : null;
};

export default async function Home() {
  const { settings: s, posts } = await readDb();
  return (
    <>
      <Header />
      <main>
        <section className="hero">
          <div className="wrap hero-in">
            <div>
              <p className="notice">{s.notice}</p>
              <h1>{s.duration} хоногт жолооч болох эрчимжүүлсэн сургалт</h1>
              <p className="lead">Онлайн ба танхимын онол, практик жолооны хичээлийг туршлагатай багш нартай хамт.</p>
              <div className="cta">
                <Link href="/register" className="btn">Бүртгүүлэх</Link>
                <a href={`tel:${s.phone}`} className="btn ghost">{s.phone}</a>
              </div>
            </div>
            <div className="sign" aria-hidden="true"><span>C</span></div>
          </div>
          <div className="roadline" />
        </section>

        <section id="price" className="wrap block">
          <h2>Сургалтын үнэ</h2>
          <div className="plates">
            <div className="plate"><p>Сургалтын төлбөр</p><strong>{s.tuition}₮</strong><small>{s.duration} хоногийн эрчимжүүлсэн сургалт</small></div>
            <div className="plate alt"><p>Мөн төсөөрсөн жолооны сургалт</p><strong>{s.practice}₮</strong><small>Практик жолооны хичээл</small></div>
          </div>
          <ul className="feats">
            <li><b>Туршлагатай багш нар</b>Жолооны олон жилийн туршлагатай</li>
            <li><b>Онлайн + танхимын сургалт</b>Онолыг өөрт тохирсон хэлбэрээр</li>
            <li><b>Практик жолооны сургалт</b>Сургалтын машинаар замд гарна</li>
          </ul>
        </section>

        {posts.length > 0 && (
          <section id="posts" className="wrap block">
            <h2>Бичлэг, зураг</h2>
            <div className="posts">
              {posts.map((p) => (
                <article key={p.id} className="post">
                  {p.images?.[0] && <a href={p.images[0]} target="_blank" rel="noreferrer"><img src={p.images[0]} alt={p.title} className="cover" /></a>}
                  {p.images?.length > 1 && (
                    <div className="thumbs">
                      {p.images.slice(1).map((u) => (
                        <a key={u} href={u} target="_blank" rel="noreferrer"><img src={u} alt="" /></a>
                      ))}
                    </div>
                  )}
                  {p.video && (yt(p.video)
                    ? <iframe src={yt(p.video)} allowFullScreen title={p.title} />
                    : <a className="vlink" href={p.video} target="_blank" rel="noreferrer">Бичлэг үзэх</a>)}
                  <div className="post-body">
                    <h3>{p.title}</h3>
                    {p.text && <p>{p.text}</p>}
                    <time>{p.date}</time>
                  </div>
                </article>
              ))}
            </div>
          </section>
        )}

        <section className="wrap block join">
          <h2>Өнөөдөр бүртгүүлээд эхэл</h2>
          <p>Нэр, утсаа үлдээхэд бид эргэж холбогдоно.</p>
          <Link href="/register" className="btn">Бүртгүүлэх</Link>
        </section>
      </main>
      <Footer />
    </>
  );
}
