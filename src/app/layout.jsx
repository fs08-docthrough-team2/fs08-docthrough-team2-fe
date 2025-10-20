import '@/styles/globals.scss';
import Providers from '@/app/providers.jsx';

export const metadata = {
  title: 'Docthru',
  description: 'Docthrough is a platform for developers to translate and share documentation.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="ko">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
