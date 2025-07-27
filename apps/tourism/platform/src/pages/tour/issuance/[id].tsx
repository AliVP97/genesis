import Head from 'next/head';
import TourIssuance from '../../../module/tour/issuance';
import type { ReactElement } from 'react';
import { TourLayout } from 'layout/tourLayout';
import Footer from 'containers/landingPage/components/footer';
import { MobileLayout } from 'layout/mobileLayout';

export default function Issuance() {
  return (
    <>
      <Head>
        <title>صدور بلیت | هف‌هشتاد</title>
        <meta name="description" content="صفحه مربوط به صدور بلیت‌های مسافرتی هف‌هشتاد" />
      </Head>
      <div className="d-flex flex-column">
        <TourIssuance />
      </div>
    </>
  );
}

Issuance.getLayout = function getLayout(page: ReactElement) {
  return page.props.device == 'desktop' ? (
    <>
      <TourLayout>{page}</TourLayout>
      <Footer />
    </>
  ) : (
    <>
      <MobileLayout {...page.props}>{page}</MobileLayout>
      <div className="clearfix"></div>
      <Footer />
    </>
  );
};
