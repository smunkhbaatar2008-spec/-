import './globals.css';
import { Roboto_Condensed, Roboto } from 'next/font/google';

const head = Roboto_Condensed({ subsets: ['latin', 'cyrillic', 'cyrillic-ext'], weight: ['700', '800'], variable: '--f-head' });
const body = Roboto({ subsets: ['latin', 'cyrillic', 'cyrillic-ext'], weight: ['400', '500', '700'], variable: '--f-body' });

export const metadata = {
  title: 'МБЭБМ Авто сургалтын төв',
  description: 'Эрчимжүүлсэн жолооны сургалт. Өдөр бүр элсэлт авч байна.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="mn" className={`${head.variable} ${body.variable}`}>
      <body>{children}</body>
    </html>
  );
}
