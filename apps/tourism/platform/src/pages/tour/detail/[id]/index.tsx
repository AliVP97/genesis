import { useGuestLogin } from 'utils/hooks/useGuestLogin';

import React, { ReactElement } from 'react';
import TourDetails from 'module/tour/detail';
import { Layout } from 'layout/desktopLayout';
import Footer from 'containers/landingPage/components/footer';
import { MobileLayout } from 'layout/mobileLayout';
import * as Sentry from '@sentry/nextjs';
import { TTourGetPDPResponse } from 'services/tour/v2/detail/types';
import { getTourDetailSSR } from 'services/tour/v2/detail/getTourDetailSSR';
import { GetServerSideProps } from 'next';
import { serverSideBreadCrumbGenerator } from 'utils/static/cms';
import MainBreadcrumb from 'components/breadcrumb/mainBreadCrumb';

const TourDetail = () => {
  const { guestIsLoggedIn } = useGuestLogin();

  return guestIsLoggedIn && <TourDetails />;
};
TourDetail.getLayout = function getLayout(page: ReactElement) {
  const { device, breadCrumb, path } = page.props;
  return device == 'desktop' ? (
    <>
      <Layout {...page.props}>
        {page}
        <MainBreadcrumb path={path} breadCrumb={breadCrumb} />
      </Layout>
      <Footer />
    </>
  ) : (
    <MobileLayout {...page.props}>{page}</MobileLayout>
  );
};

export default TourDetail;

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { query } = context;
  let detail: TTourGetPDPResponse | null = null;
  try {
    detail = await getTourDetailSSR(query?.id as string, query?.dateId as string);
  } catch (err) {
    Sentry.captureException(err);
  }
  return {
    props: { detail, ...serverSideBreadCrumbGenerator(context, detail?.title as string) },
  };
};
