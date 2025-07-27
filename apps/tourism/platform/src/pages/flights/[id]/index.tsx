import React, { ReactElement, useEffect } from 'react';

import { useRouter } from 'next/router';
import { GetServerSideProps } from 'next';
import * as Sentry from '@sentry/nextjs';

import { Layout } from 'layout/desktopLayout';
import { MobileLayout } from 'layout/mobileLayout';
import { Device } from 'utils/interface';
import SearchFlight from 'module/flights/search';
import Footer from 'containers/landingPage/components/footer';
import { useGuestLogin } from 'utils/hooks/useGuestLogin';
import { domesticFlightQueryToLastSearch } from 'utils/helpers/localstorageHelper';
import { IResponseBusyRoute } from 'containers/landingPage/types';
import { getDomesticLandingContent } from 'services/domestic/content';
import { flightStaticContent } from 'utils/static/cms/flights';
import handlePageValidation, {
  validateQueryDateRange,
  validateParamsIata,
  validateQuerySchema,
} from 'utils/handlePageValidation';
import domesticFlightQuerySchema from 'module/flights/search/constants/domesticFlightQuerySchema';
import { serverSideBreadCrumbGenerator } from 'utils/static/cms';
import MainBreadcrumb from 'components/breadcrumb/mainBreadCrumb';
import { useAuthContext } from 'utils/hooks/useAuthContext';
import { FaqSchemaGenerator, SearchActionSchemaGenerator } from 'utils/static/cms/schema';
import useSyncSearchParams from 'module/flights/search/hooks/useSyncSearchParams';
import { useIsSuperApp } from '../../../utils/hooks/useIsSuperApp';
export type Airline = { code?: string; name?: string; price?: number };

interface Props {
  device: Device;
  content: IResponseBusyRoute;
  isSingleIata: boolean;
}

const Search = ({ device, content, isSingleIata = false }: Props): ReactElement | null => {
  const { login, setLoginModalVisible } = useAuthContext();
  const { query, replace, asPath, pathname } = useRouter();

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (!login && query?.departureFlightId) {
        setLoginModalVisible(true);
      }
    }, 200);

    return () => clearTimeout(timeoutId);
  }, [login]);
  const { guestIsLoggedIn } = useGuestLogin();
  const isSuperApp = useIsSuperApp();
  const { loadSearchResultContent, loadSearchResultFaqContent } = flightStaticContent(
    query,
    content,
  );
  useSyncSearchParams();

  useEffect(() => {
    if (query.id) {
      replace(asPath);
      loadSearchResultContent();
    }
  }, [query?.id]);

  return (
    <>
      {guestIsLoggedIn && (
        <div className="d-flex flex-column">
          {!isSingleIata && (
            <SearchFlight
              device={device}
              isLoginCall={true}
              lastSearch={
                query.urlAutoCompleted ? domesticFlightQueryToLastSearch(query) : undefined
              }
            />
          )}
          {pathname.includes('/flights') && !isSuperApp && loadSearchResultContent()}
          {pathname.includes('/flights') && !isSuperApp && loadSearchResultFaqContent()}
        </div>
      )}
    </>
  );
};

Search.getLayout = function getLayout(page: ReactElement) {
  const { device, breadCrumb, path, isSingleIata, content } = page.props;
  return device === 'desktop' ? (
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
      backBtnLocation="/"
      title={isSingleIata && 'جستجوی سفر'}
      shouldShowServicesTab={() => isSingleIata}
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
  const validationResult = handlePageValidation(
    context,
    [
      validateParamsIata('id'),
      validateQuerySchema(domesticFlightQuerySchema),
      validateQueryDateRange('departureDate', 'returningDate'),
    ],
    { sortedQueryKeys: Object.keys(domesticFlightQuerySchema.shape) },
  );

  if (!validationResult.isValid) {
    return validationResult.response;
  }

  const { id } = context.params ?? {}; // Ensure id exists

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
    const fetchContent = await getDomesticLandingContent(id as string);
    const content = fetchContent.data.length !== 0 ? fetchContent.data[0] : null;

    return {
      props: {
        content: content,
        ...serverSideBreadCrumbGenerator(context),
        ...validationResult.props,
      },
    };
  } catch (error) {
    Sentry?.captureException(error);
    return {
      props: {
        content: null, // Return an empty array to avoid undefined issues
        error: 'Content could not be fetched', // Inform the component of the failure
        breadCrumb: [],
        path: '',
      },
    };
  }
};
