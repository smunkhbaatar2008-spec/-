import './globals.css';

export const metadata = {
  title: 'МБЭБМ Авто сургалтын төв',
  description: 'Эрчимжүүлсэн жолооны сургалт. Өдөр бүр элсэлт авч байна.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="mn">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Roboto+Condensed:wght@700;800&family=Roboto:wght@400;500;700&display=swap"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}