import { useEffect } from 'react';
import useSearchLocationQueries from './useSearchLocationQueries';
import useSearchLocations from './useSearchLocations';
import { useAppDispatch } from 'store/hook/storeHook';
import { useRouter } from 'next/router';
import { SearchQuery } from '../../../types/common';
import getTripType from '../utils/getTripType';
import {
  Dates,
  searchCabinTypeChanged,
  searchDatesChanged,
  searchLocationsChanged,
  searchPassengersChanged,
  searchTripTypeChanged,
} from 'store/slices/internationalFlight/search';
import getPassengers from '../utils/getPassengers';
import type { Location } from 'module/internationalFlight/search/types/common';
import { notFoundRedirectUrlChanged } from 'store/slices/app/app';
import URLS from 'utils/routes/web';
import { CMSData } from 'utils/handlePageValidation/types/common';

function validateAndGetData(
  data: (Location | undefined)[] | undefined,
  isSingleIata: boolean | undefined,
): undefined | { origin?: Location; destination?: Location } {
  if (!data) {
    return undefined;
  }

  // whenever isSingleIata is false, we should have two location.
  if (!isSingleIata && data[0] && data[1]) {
    return {
      origin: data[0],
      destination: data[1],
    };
  }

  // whenever isSingleIata is true, we should have one location, and first
  // result is destination.
  if (isSingleIata && data[0]) {
    return {
      destination: data[0],
    };
  }

  return undefined;
}

const useSyncSearchParams = (isSingleIata: boolean | undefined, cmsData: CMSData | undefined) => {
  const searchQueries = useSearchLocationQueries();
  const { data, isLoading } = useSearchLocations(searchQueries);
  const dispatch = useAppDispatch();
  const router = useRouter();

  useEffect(() => {
    dispatch(notFoundRedirectUrlChanged(URLS.INTERNATIONAL));
  }, []);

  useEffect(() => {
    if (isLoading) {
      return;
    }

    const result = validateAndGetData(data, isSingleIata);

    // While cmsData and result both are not available then this should be
    // redirected to 404 page.
    if (!result && !cmsData) {
      router.replace('/404');
      return;
    }

    // Whether cmsData is available then it should be redirected to landing page with
    // undefined origin and destination otherwise this should have both iata
    // codes to fill out in inputs.
    const { origin, destination } = result ?? {};
    dispatch(searchLocationsChanged({ origin, destination }));
  }, [data, dispatch, isLoading, router, isSingleIata, cmsData]);

  useEffect(() => {
    if (isSingleIata) {
      return;
    }

    const { departureDate, returningDate, tripMode, cabinType, ...queryPassengers } =
      router.query as SearchQuery;
    const tripType = getTripType(tripMode);
    const passengers = getPassengers(queryPassengers);
    const dates: Dates = { departure: departureDate, returning: returningDate };

    dispatch(searchDatesChanged(dates));
    dispatch(searchTripTypeChanged(tripType));
    dispatch(searchCabinTypeChanged(cabinType));
    dispatch(searchPassengersChanged(passengers));
  }, [dispatch, isSingleIata, router.query]);
};

export default useSyncSearchParams;
