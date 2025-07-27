import React, { ReactElement, useEffect } from 'react';

import { GetServerSideProps } from 'next';
import { isEqual } from 'lodash';
import { useRouter } from 'next/router';

import { ParsedUrlQuery } from 'querystring';
import MainBreadcrumb from 'components/breadcrumb/mainBreadCrumb';
import Footer from 'containers/landingPage/components/footer';
import { Layout } from 'layout/desktopLayout';
import { MobileLayout } from 'layout/mobileLayout';
import BusTicketList from 'module/bus/tickets';
import { Device } from 'utils/interface';
import { serverSideBreadCrumbGenerator } from 'utils/static/cms';
import { FaqSchemaGenerator, SearchActionSchemaGenerator } from 'utils/static/cms/schema';
import { fetchDynamicCmsData } from 'utils/cms/services/api';
import { cmsFactory } from 'utils/cms/factory';
import { DataApiResponse } from 'utils/cms/services/type';
import { busSearchQuerySchema } from 'module/bus/search/constants';
import { useIsSuperApp } from 'utils/hooks/useIsSuperApp';
import { useGuestLogin } from 'utils/hooks/useGuestLogin';
import { captureInvalidUrl } from 'utils/errorhandler';
type Props = {
  device: Device;
  breadCrumb: Record<string, never>;
  path: string;
  url: string;
} & (
  | {
      content: DataApiResponse;
      showLandingPage: false;
    }
  | {
      content: DataApiResponse;
      showLandingPage: true;
    }
);

const shouldShowLandingPage = (query: ParsedUrlQuery) => {
  if (Object.keys(query).length > 1) {
    return false;
  }

  return true;
};

const Search = ({ device, content, showLandingPage }: Props) => {
  const { guestIsLoggedIn } = useGuestLogin();
  const { query, replace, asPath } = useRouter();
  const isSuperApp = useIsSuperApp();

  useEffect(() => {
    if (query.id) {
      if (!showLandingPage) {
        replace(asPath);
        cmsFactory({ cmsData: content });
      }
    }
  }, [query?.id]);
  return (
    <>
      {showLandingPage
        ? !isSuperApp && cmsFactory({ cmsData: content })
        : guestIsLoggedIn && (
            <>
              <BusTicketList device={device} isLoginCall={true} />
            </>
          )}
    </>
  );
};

Search.getLayout = function getLayout(page: ReactElement) {
  const { device, breadCrumb, path, showLandingPage, content } = page.props;
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
    <MobileLayout
      {...page.props}
      backBtnLocation="/bus"
      title={showLandingPage && 'جستجوی سفر'}
      shouldShowServicesTab={() => showLandingPage}
    >
      <SearchActionSchemaGenerator path={path || ''} />
      <FaqSchemaGenerator content={content} path={path || ''} />
      {page}
      <MainBreadcrumb path={path} breadCrumb={breadCrumb} />
    </MobileLayout>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const showLandingPage = shouldShowLandingPage(context.query);
  const isPWA = context.req.headers.host?.includes('pwa');
  const urlName = context?.resolvedUrl?.includes('?')
    ? context?.resolvedUrl?.split('?')[0]?.substring(1)
    : context?.resolvedUrl?.substring(1);

  try {
    if (isPWA) {
      return {
        props: {
          content: null,
          showLandingPage,
          breadCrumb: [],
          path: '',
          url: '',
        },
      };
    }
    if (!showLandingPage) {
      const parsedQuery = busSearchQuerySchema.parse(context.query);
      if (!isEqual(parsedQuery, context.query)) {
        const { id, ...restQueries } = parsedQuery;
        const query = new URLSearchParams(restQueries);
        return {
          redirect: {
            destination: `/bus/${id}?${query.toString()}`,
            permanent: true,
          },
        };
      }
    }
    const fetchCmsData = await fetchDynamicCmsData({
      path: urlName,
      isDynamicPath: true,
    });

    return {
      props: {
        url: `${urlName}`,
        content: fetchCmsData?.data,
        showLandingPage,
        ...serverSideBreadCrumbGenerator(context),
      },
    };
  } catch (error: any) {
    if (error?.response?.status === 404) {
      captureInvalidUrl({ url: urlName, service: 'bus' });
      return {
        notFound: true,
      };
    }
    return {
      props: {
        content: null,
        showLandingPage,
        breadCrumb: [],
        path: '',
        url: '',
      },
    };
  }
};

export default Search;
