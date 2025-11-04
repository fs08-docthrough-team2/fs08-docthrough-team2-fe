import '@/styles/globals.scss';
import Providers from '@/app/providers.jsx';
import GNB from '@/components/organisms/GNB/GNB';
import AuthBootstrapper from '@/components/common/AuthBootstrapper.jsx';
import { AppToaster } from '@/components/common/Sonner';

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
        <Providers>
          <AuthBootstrapper />
          <GNB />
          {children}
        </Providers>
        <AppToaster />
      </body>
    </html>
  );
}
