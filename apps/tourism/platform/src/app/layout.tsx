import { AppRouterCacheProvider } from '@mui/material-nextjs/v15-appRouter';

import './global.css';

export const metadata = {
  title: 'هف هشتاد',
  description: 'Generated by create-nx-workspace',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fa" dir="rtl">
      <body>
        <AppRouterCacheProvider options={{ enableCssLayer: true }}>
          {children}
        </AppRouterCacheProvider>
      </body>
    </html>
  );
}
