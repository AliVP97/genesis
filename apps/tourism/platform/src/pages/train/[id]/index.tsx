import React, { ReactElement, useEffect } from 'react';

import { GetServerSideProps } from 'next';
import { isEqual } from 'lodash';
import { useRouter } from 'next/router';

import { ParsedUrlQuery } from 'querystring';
import Footer from 'containers/landingPage/components/footer';
import { Layout } from 'layout/desktopLayout';
import { MobileLayout } from 'layout/mobileLayout';
import SearchTrain from 'module/train/search';
import MainBreadcrumb from 'components/breadcrumb/mainBreadCrumb';
import { trainSearchUrlSchema } from 'module/train/search/utils';
import { useGuestLogin } from 'utils/hooks/useGuestLogin';
import { Device } from 'utils/interface';
import { serverSideBreadCrumbGenerator } from 'utils/static/cms';
import { FaqSchemaGenerator, SearchActionSchemaGenerator } from 'utils/static/cms/schema';
import { trainSearchQuery } from 'module/train/search/helper';
import { useIsSuperApp } from 'utils/hooks/useIsSuperApp';
import { DataApiResponse } from 'utils/cms/services/type';
import { cmsFactory } from 'utils/cms/factory';
import { fetchDynamicCmsData } from 'utils/cms/services/api';
import { SearchPageHeader } from 'utils/cms/components/seo/helpers/searchPageHeader';
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

const Search = ({ content, showLandingPage }: Props) => {
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
              <SearchTrain isLoginCall={true} />
            </>
          )}
    </>
  );
};

Search.getLayout = function getLayout(page: ReactElement) {
  const { device, breadCrumb, path, showLandingPage, content, url } = page.props;
  return device == 'desktop' ? (
    <>
      <Layout>
        <SearchActionSchemaGenerator path={path || ''} />
        <FaqSchemaGenerator content={content} path={path || ''} />
        <SearchPageHeader url={url} service={'train'} />
        {page}
        <MainBreadcrumb path={path} breadCrumb={breadCrumb} />
      </Layout>
      <Footer />
    </>
  ) : (
    <>
      <MobileLayout
        {...page.props}
        backBtnLocation="/train"
        title={showLandingPage && 'جستجوی سفر'}
        shouldShowServicesTab={() => showLandingPage}
        contentElementProps={{ style: { padding: 0 } }}
      >
        <SearchActionSchemaGenerator path={path || ''} />
        <FaqSchemaGenerator content={content} path={path || ''} />
        {page}
        <MainBreadcrumb path={path} breadCrumb={breadCrumb} />
      </MobileLayout>
      {showLandingPage && (
        <>
          <div className="clearfix"></div>
          <Footer />
        </>
      )}
    </>
  );
};

const shouldShowLandingPage = (query: ParsedUrlQuery) => {
  if (Object.keys(query).length > 1) {
    return false;
  }
  return true;
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
      const parsedQuery = trainSearchUrlSchema.parse(context.query);
      if (!isEqual(parsedQuery, context.query)) {
        const { id, ...restQueries } = parsedQuery;
        const query = trainSearchQuery.stringify(restQueries);
        return {
          redirect: {
            destination: `/train/${id}?${query}`,
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
      captureInvalidUrl({ url: urlName, service: 'train' });
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
