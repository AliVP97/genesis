import React, { ReactElement, useEffect } from 'react';

import { useRouter } from 'next/router';
import { GetServerSideProps } from 'next';

import { Layout } from 'layout/desktopLayout';
import { MobileLayout } from 'layout/mobileLayout';
import { Device } from 'utils/interface';
import Footer from 'containers/landingPage/components/footer';
import { useGuestLogin } from 'utils/hooks/useGuestLogin';
import { SearchIntFlight } from 'module/internationalFlight/search';
import { intFlightQueryToLastSearch } from 'utils/helpers/localstorageHelper';
import { useIsSuperApp } from 'utils/hooks/useIsSuperApp';
import { IResponseBusyRoute } from 'containers/landingPage/types';
import { getInternationalLandingContent } from 'services/internationalFlight/content';
import { flightStaticContent } from 'utils/static/cms/flights';
import { serverSideBreadCrumbGenerator } from 'utils/static/cms';
import MainBreadcrumb from 'components/breadcrumb/mainBreadCrumb';
import { FaqSchemaGenerator, SearchActionSchemaGenerator } from 'utils/static/cms/schema';
import useSyncSearchParams from 'module/internationalFlight/search/hooks/useSyncSearchParams';
import internationalFlightQuerySchema from 'module/internationalFlight/search/constants/internationalFlightQuerySchema';
import handlePageValidation, {
  validateParamsIata,
  validateQuerySchema,
  validateQueryTripMode,
  validateQueryDateRange,
} from 'utils/handlePageValidation';
import { CMSData } from 'utils/handlePageValidation/types/common';

interface Props {
  device: Device;
  cmsData?: CMSData;
  isSingleIata?: boolean;
  content: IResponseBusyRoute;
}

const Search = ({ device, content, isSingleIata, cmsData }: Props) => {
  const { guestIsLoggedIn } = useGuestLogin();
  const { query, pathname } = useRouter();
  const isSuperApp = useIsSuperApp();
  const { loadSearchResultContent, loadSearchResultFaqContent } = flightStaticContent(
    query,
    content,
  );
  useSyncSearchParams(isSingleIata, cmsData);

  useEffect(() => {
    if (query.id) {
      loadSearchResultContent();
    }
  }, [query?.id]);

  return (
    <>
      {guestIsLoggedIn && (
        <>
          {!isSingleIata && (
            <SearchIntFlight
              device={device}
              isLoginCall={true}
              lastSearch={query.urlAutoCompleted ? intFlightQueryToLastSearch(query) : undefined}
            />
          )}
          {/* {pathname.includes('/international') && !isSuperApp && (
            <BusyRoutesDescription
              localContent={internationalFlightBusyLines}
            />
          )} */}
          {pathname.includes('/international') && !isSuperApp && loadSearchResultContent()}
          {pathname.includes('/international') && !isSuperApp && loadSearchResultFaqContent()}
        </>
      )}
    </>
  );
};

Search.getLayout = function getLayout(page: ReactElement) {
  const { device, breadCrumb, path, content, isSingleIata } = page.props;
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
      backBtnLocation="/international"
      title={isSingleIata && 'جستجوی سفر'}
      shouldShowServicesTab={() => (isSingleIata ? 'international' : '')}
    >
      <SearchActionSchemaGenerator path={path || ''} />
      <FaqSchemaGenerator content={content} path={path || ''} />
      {page}
      <MainBreadcrumb path={path} breadCrumb={breadCrumb} />
    </MobileLayout>
  );
};

export default Search;

export const getServerSideProps: GetServerSideProps = async (context) => {
  try {
    const validationResult = handlePageValidation(
      context,
      [
        validateParamsIata('id'),
        validateQuerySchema(internationalFlightQuerySchema),
        validateQueryDateRange('departureDate', 'returningDate'),
        validateQueryTripMode(),
      ],
      { sortedQueryKeys: Object.keys(internationalFlightQuerySchema.shape) },
    );

    if (!validationResult.isValid) {
      return validationResult.response;
    }

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

    const fetchContent = await getInternationalLandingContent(context.query?.id as string);

    const content = fetchContent.data.length !== 0 ? fetchContent.data[0] : null;
    return {
      props: {
        content: content,
        ...validationResult.props,
        ...serverSideBreadCrumbGenerator(context),
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
