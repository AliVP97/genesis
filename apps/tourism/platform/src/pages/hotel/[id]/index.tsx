import React, { ReactElement } from 'react';

import { GetServerSideProps } from 'next';

import { Layout } from 'layout/desktopLayout';
import { MobileLayout } from 'layout/mobileLayout';
import { Device } from 'utils/interface';
import SearchHotel from 'module/hotel/search';
import Footer from 'containers/landingPage/components/footer';
import { useGuestLogin } from 'utils/hooks/useGuestLogin';
import { serverSideBreadCrumbGenerator } from 'utils/static/cms';
import MainBreadcrumb from 'components/breadcrumb/mainBreadCrumb';
import { FaqSchemaGenerator, SearchActionSchemaGenerator } from 'utils/static/cms/schema';
interface Props {
  device: Device;
}

const Search = ({ device }: Props) => {
  const { guestIsLoggedIn } = useGuestLogin();
  return guestIsLoggedIn && <SearchHotel device={device} isLoginCall={true} />;
};

Search.getLayout = function getLayout(page: ReactElement) {
  const { device, breadCrumb, path, content } = page.props;
  return device == 'desktop' ? (
    <>
      <Layout>
        <SearchActionSchemaGenerator path={path || ''} />
        <FaqSchemaGenerator content={content} path={path || ''} />
        {page}
        <MainBreadcrumb path={path} breadCrumb={breadCrumb} />
      </Layout>
      <Footer />
    </>
  ) : (
    <MobileLayout {...page.props}>
      <SearchActionSchemaGenerator path={path || ''} />
      <FaqSchemaGenerator content={content} path={path || ''} />
      {page}
      <MainBreadcrumb path={path} breadCrumb={breadCrumb} />
    </MobileLayout>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const isPWA = context.req.headers.host?.includes('pwa');

  if (isPWA) {
    return {
      props: {
        content: null,
        breadCrumb: [],
        path: '',
      },
    };
  }

  try {
    return {
      props: {
        content: [],
        ...serverSideBreadCrumbGenerator(context, context.query.cityName as string),
      },
    };
  } catch (error) {
    // sentry log
  }
  return {
    props: {
      content: null,
      breadCrumb: [],
      path: '',
    },
  };
};

export default Search;
