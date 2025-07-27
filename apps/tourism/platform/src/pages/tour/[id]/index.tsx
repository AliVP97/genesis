import React, { ReactElement } from 'react';
import TourPlpContainer from '../../../module/tour/plp';
import { Layout } from 'layout/desktopLayout';
import Footer from 'containers/landingPage/components/footer';
import { MobileLayout } from 'layout/mobileLayout';
import MainBreadcrumb from '../../../components/breadcrumb/mainBreadCrumb';
import { GetServerSideProps } from 'next';
import { serverSideBreadCrumbGenerator } from '../../../utils/static/cms';

export default function TourPlp() {
  return (
    <>
      <TourPlpContainer />
    </>
  );
}

TourPlp.getLayout = function getLayout(page: ReactElement) {
  const { breadCrumb, path } = page.props;
  const { device } = page.props;
  return device == 'desktop' ? (
    <>
      <Layout>
        {page}
        <MainBreadcrumb path={path} breadCrumb={breadCrumb} />
      </Layout>
      <Footer />
    </>
  ) : (
    <MobileLayout {...page.props} backBtnLocation="/tour">
      {page}
    </MobileLayout>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { query } = context;
  const isPWA = context.req.headers.host?.includes('pwa');

  if (isPWA) {
    return {
      props: {
        content: [],
        breadCrumb: [],
        path: '',
      },
    };
  }

  try {
    return {
      props: {
        content: [],
        ...serverSideBreadCrumbGenerator(context, query?.destinationName as string),
      },
    };
  } catch (error) {}
  return {
    props: {
      content: null,
      breadCrumb: [],
      path: '',
    },
  };
};
