import type { ReactElement } from 'react';
import { MobileLayout } from 'layout/mobileLayout';
import { Layout } from 'layout/desktopLayout';
import Footer from 'containers/landingPage/components/footer';
import { useIsSuperApp } from 'utils/hooks/useIsSuperApp';
import HomeLandingPage from '../module/home/landing';
import { GetServerSideProps } from 'next';
import { getTourismLandingContents } from 'services/tourism-landing';
import { LandingPageType } from './bus';
import MainBreadcrumb from 'components/breadcrumb/mainBreadCrumb';
import { serverSideBreadCrumbGenerator } from 'utils/static/cms';
import { SearchActionSchemaGenerator } from 'utils/static/cms/schema';

export default function Page({ content, breadCrumb, path }: LandingPageType) {
  const isSuperApp = useIsSuperApp();

  return !isSuperApp && <HomeLandingPage content={content} breadCrumb={breadCrumb} path={path} />;
}
Page.getLayout = function getLayout(page: ReactElement) {
  const { breadCrumb, path, device } = page.props;
  return device == 'desktop' ? (
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
  try {
    const fetchContent = await getTourismLandingContents();
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
