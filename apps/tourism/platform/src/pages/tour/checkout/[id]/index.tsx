import type { ReactElement } from 'react';
import { TourLayout } from 'layout/tourLayout';
import { MobileLayout } from 'layout/mobileLayout';
import Footer from 'containers/landingPage/components/footer';
import Head from 'next/head';

import * as Sentry from '@sentry/nextjs';
import { getTourCheckoutSSR } from 'services/tour/v2/checkout/getTourCheckoutSSR';
import { TTourGetCheckoutResponse } from 'services/tour/v2/checkout/type';
import TourCheckoutContainer from '../../../../module/tour/checkout';

export default function TourCheckout({ detail }: { detail: TTourGetCheckoutResponse }) {
  const url = typeof window !== 'undefined' && window.location.href;
  return (
    <>
      <Head>
        <title>تور|هف‌هشتاد</title>
        <meta
          name="description"
          content="رزرو تور با هف‌هشتاد تجربه ای متفاوت. هف‌هشتاد با پشتیبانی 24 ساعته و بهترین قیمت"
        />
        <meta name="keywords" content="تور گروهی" />
        <meta property="og:title" content="تور|هف‌هشتاد" />
        <meta
          property="og:describtion"
          content="رزرو تور با هف‌هشتاد تجربه ای متفاوت. هف‌هشتاد با پشتیبانی 24 ساعته و بهترین قیمت"
        />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="هف‌هشتاد" />
        <meta property="og:locale" content="fa_IR" />
        <meta property="og:image" content="" />
        <meta property="og:image:alt" content="تور" />
        <meta property="og:url" content={url.toString() as string} />
      </Head>
      <TourCheckoutContainer detail={detail} />
    </>
  );
}
TourCheckout.getLayout = function getLayout(page: ReactElement) {
  return page.props.device == 'desktop' ? (
    <>
      <TourLayout>{page}</TourLayout>
      <Footer />
    </>
  ) : (
    <>
      <MobileLayout {...page.props}>{page}</MobileLayout>
      <Footer />
    </>
  );
};

export const getServerSideProps = async ({
  query,
}: {
  query: { id: string; requestId: string };
}) => {
  let detail: TTourGetCheckoutResponse | null = null;
  try {
    detail = await getTourCheckoutSSR(query.id, query.requestId);
  } catch (err) {
    Sentry.captureException(err);
  }

  return { props: { detail } };
};
