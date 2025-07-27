import React, { ReactElement } from 'react';

import { GetServerSideProps } from 'next';

import { Layout } from 'layout/desktopLayout';
import { MobileLayout } from 'layout/mobileLayout';
import HotelLandingPage from 'module/hotel/landing';
import { useIsSuperApp } from 'utils/hooks/useIsSuperApp';
import Footer from 'containers/landingPage/components/footer';
import { getHotelContents } from 'services/domestic/flight';
import { LandingPageType } from 'pages/bus';
import { serverSideBreadCrumbGenerator } from 'utils/static/cms';
import MainBreadcrumb from 'components/breadcrumb/mainBreadCrumb';
import { SearchActionSchemaGenerator } from 'utils/static/cms/schema';
export default function LocalHotel({ content, breadCrumb, path }: LandingPageType) {
  const isSupperApp = useIsSuperApp();
  return (
    <>
      {!isSupperApp && <HotelLandingPage content={content} breadCrumb={breadCrumb} path={path} />}
    </>
  );
}
LocalHotel.getLayout = function getLayout(page: ReactElement) {
  const { breadCrumb, path } = page.props;

  return page.props.device == 'desktop' ? (
    <>
      <Layout>
        <SearchActionSchemaGenerator path={path || ''} />
        {page}
        <MainBreadcrumb path={path} breadCrumb={breadCrumb} />
      </Layout>
      <Footer />
    </>
  ) : (
    <>
      <MobileLayout {...page.props}>
        <SearchActionSchemaGenerator path={path || ''} />
        {page}
        <MainBreadcrumb path={path} breadCrumb={breadCrumb} />
      </MobileLayout>
      <Footer />
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
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
    const fetchContent = await getHotelContents();
    const { data } = fetchContent;
    return {
      props: {
        content: data[0].attributes,
        ...serverSideBreadCrumbGenerator(context),
      },
    };
  } catch {
    return {
      props: {
        content: [],
        breadCrumb: [],
        path: '',
      },
    };
  }
};
