import type { ReactElement } from 'react';

import { GetServerSideProps } from 'next';

import { Layout } from 'layout/desktopLayout';
import { MobileLayout } from 'layout/mobileLayout';
import InternationalFlightLanding from 'module/internationalFlight/landing';
import Footer from 'containers/landingPage/components/footer';
import { useIsSuperApp } from 'utils/hooks/useIsSuperApp';
import { LandingPageType } from 'pages/bus';
import { getIntFlightContents } from 'services/domestic/flight';
import { serverSideBreadCrumbGenerator } from 'utils/static/cms';
import MainBreadcrumb from 'components/breadcrumb/mainBreadCrumb';
import { SearchActionSchemaGenerator } from 'utils/static/cms/schema';
export default function InternationalFlight({ content, breadCrumb, path }: LandingPageType) {
  const isSuperApp = useIsSuperApp();
  return (
    <>
      {!isSuperApp && (
        <InternationalFlightLanding content={content} breadCrumb={breadCrumb} path={path} />
      )}
    </>
  );
}
InternationalFlight.getLayout = function getLayout(page: ReactElement) {
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
    const fetchContent = await getIntFlightContents();
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
