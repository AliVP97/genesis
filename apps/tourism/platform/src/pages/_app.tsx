import { ReactElement, ReactNode, useEffect } from 'react';

import type { NextPage } from 'next';
import type { AppProps } from 'next/app';
import type { AppContext } from 'next/app';
import { ToastContainer } from 'react-toastify';
import { Provider } from 'react-redux';
import { QueryClient, QueryClientProvider } from 'react-query';
import { PersistGate } from 'redux-persist/integration/react';
import dayjs from 'dayjs';
import jalaliday from 'jalali-plugin-dayjs';
import Script from 'next/script';
import { persistor, store } from 'store';
import { Device } from 'utils/interface';
import ExpireModal from 'containers/expireModal';
import { createRandomID } from 'utils/helpers/createRandomId';
import ErrorBoundary from 'containers/error-boundries';
import { ParsedUrlQuery } from 'querystring';
import { TopBanner } from 'components/TopBanner';
import { NewSeoMeta } from 'utils/cms/components/seo';
import { AuthProvider } from '../context/login';
import { SelectedTicketProvider } from '../context/selectedTicket';
import { ExpireProvider } from '../context/expire';
import { SearchQueryProvider } from '../context/searchQuery';
import { removeCookie } from '../utils/helpers/coockieHelper';

import 'styles/app.scss';
import 'leaflet/dist/leaflet.css';
import 'react-toastify/dist/ReactToastify.css';
dayjs.extend(jalaliday);

type DeviceType = keyof typeof Device;

type NextPageWithLayout = NextPage & {
  getLayout?: (page: ReactElement) => ReactNode;
};

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
    },
  },
});

const Head = () => (
  <NewSeoMeta>
    <meta charSet="utf-8" />
    <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
    <meta
      name="viewport"
      content="width=device-width,initial-scale=1,minimum-scale=1,maximum-scale=1,user-scalable=no"
    />
    <link rel="manifest" href="/tourism/manifest.json" />
    <link rel="icon" href="/tourism/favicon.ico" />
    <link rel="apple-touch-icon" sizes="192x192" href="/tourism/icons/icon-192x192.png" />
    <meta name="theme-color" content="#194b9b" />
    <meta property="og:type" content="website" />
    <meta property="og:site_name" content="هف‌هشتاد" />
    <meta property="og:locale" content="fa_IR" />
    <meta name="google-site-verification" content="RfbGeE4zLTK1oOYBFxxjDtMt_dMgVAnc2tdnuuClzI4" />
    <meta name="robots" content="index,follow" />
    <meta name="googlebot" content="index,follow" />
  </NewSeoMeta>
);

function MyApp({
  Component,
  pageProps,
  device,
  query,
  pathname,
}: {
  Component: AppPropsWithLayout;
  pageProps: AppPropsWithLayout;
  device: DeviceType;
  // query?: Record<string, string>;
  query?: ParsedUrlQuery;
  pathname: string;
}) {
  // @ts-ignore: Unreachable code error
  const getLayout = Component.getLayout ?? ((page) => page);

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-empty-function, no-console
    if (process.env.NODE_ENV === 'production') console.log = function noConsole() {};
    // if (process.env.NODE_ENV === 'production') {
    //   const app = initializeApp(firebaseConfig);
    //   getAnalytics(app);
    //   getPerformance(app);
    // }
    if (window && typeof window !== 'undefined') {
      const APP_VERSION = localStorage.getItem('tourism-version') as string;
      const CURRENT_VERSION = process.env.NEXT_PUBLIC_VERSION;
      if (APP_VERSION !== CURRENT_VERSION) {
        removeCookie('access-token');
        removeCookie('refresh-token');
        removeCookie('mobile');
        localStorage.setItem('tourism-version', CURRENT_VERSION as string);
      }
      const userId = localStorage.getItem('user_id') as string;
      if (!userId) localStorage.setItem('user_id', JSON.stringify(createRandomID()));
    }
  }, []);

  return (
    <>
      <ErrorBoundary>
        <QueryClientProvider client={queryClient}>
          <AuthProvider>
            <ExpireProvider>
              <SelectedTicketProvider>
                <SearchQueryProvider>
                  <Provider store={store}>
                    <Head />
                    {pathname === '/tourism/train' && <TopBanner />}
                    {typeof window !== 'undefined' ? (
                      <PersistGate loading={<></>} persistor={persistor}>
                        {getLayout(
                          // @ts-ignore: Unreachable code error
                          <Component {...pageProps} device={device} query={query} />,
                        )}
                      </PersistGate>
                    ) : (
                      getLayout(
                        // @ts-ignore: Unreachable code error
                        <Component {...pageProps} device={device} query={query} />,
                      )
                    )}
                    <ToastContainer enableMultiContainer limit={device === 'mobile' ? 1 : 3} />
                    <ExpireModal />
                  </Provider>
                </SearchQueryProvider>
              </SelectedTicketProvider>
            </ExpireProvider>
          </AuthProvider>
        </QueryClientProvider>
      </ErrorBoundary>
      {/* <Script
        id="goftino-widget"
        strategy="lazyOnload"
        dangerouslySetInnerHTML={{
          __html: `!function(){var i="h2wXdQ",a=window,d=document;function g(){var g=d.createElement("script"),s="https://www.goftino.com/widget/"+i,l=localStorage.getItem("goftino_"+i);g.async=!0,g.src=l?s+"?o="+l:s;d.getElementsByTagName("head")[0].appendChild(g);}"complete"===d.readyState?g():a.attachEvent?a.attachEvent("onload",g):a.addEventListener("load",g,!1);}();`,
        }}
      /> */}
      {process.env.NEXT_PUBLIC_GOOGLE_TAG_MANAGER && (
        <Script
          id="google-tag-manager"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
                    new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
                    j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
                    'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
                    })(window,document,'script','dataLayer','${process.env.NEXT_PUBLIC_GOOGLE_TAG_MANAGER}');`,
          }}
        />
      )}
    </>
  );
}

MyApp.getInitialProps = async ({ ctx }: AppContext) => {
  const { req, query, pathname } = ctx;
  const userAgent = req ? req.headers['user-agent'] : navigator.userAgent;
  let device: DeviceType = Device.desktop;
  if (userAgent && /Android|webOS|iPhone|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent)) {
    device = Device.mobile;
  }
  return {
    device,
    query,
    pathname,
  };
};

export default MyApp;
