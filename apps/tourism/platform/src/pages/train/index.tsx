import type { ReactElement } from 'react';

import { GetServerSideProps } from 'next';

import { Layout } from 'layout/desktopLayout';
import { MobileLayout } from 'layout/mobileLayout';
import Footer from 'containers/landingPage/components/footer';
import { useIsSuperApp } from 'utils/hooks/useIsSuperApp';
import { NewLandingPageType } from 'pages/bus';
import { serverSideBreadCrumbGenerator } from 'utils/static/cms';
import MainBreadcrumb from 'components/breadcrumb/mainBreadCrumb';
import { SearchActionSchemaGenerator } from 'utils/static/cms/schema';
import { cmsFactory } from 'utils/cms/factory';
import { fetchDynamicCmsData } from 'utils/cms/services/api';
export default function Train({ content }: NewLandingPageType) {
  const isSuperApp = useIsSuperApp();
  return <>{!isSuperApp && cmsFactory({ cmsData: content })}</>;
}
Train.getLayout = function getLayout(page: ReactElement) {
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
      <div className="clearfix"></div>
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
    const urlName = context?.resolvedUrl?.includes('?')
      ? context?.resolvedUrl?.split('?')[0].substring(1)
      : context?.resolvedUrl?.substring(1);
    const fetchCmsData = await fetchDynamicCmsData({
      path: urlName,
      isDynamicPath: true,
    });

    return {
      props: {
        content: fetchCmsData?.data,
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
