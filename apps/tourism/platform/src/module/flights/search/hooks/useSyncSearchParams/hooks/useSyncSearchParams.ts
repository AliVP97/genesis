import { useEffect } from 'react';
import useIataCodes, { IataCodes } from './useParamsId';
import useSearchLocations from './useSearchLocations';
import { useAppDispatch } from 'store/hook/storeHook';
import { useRouter } from 'next/router';
import { SearchQuery } from '../../../types/common';
import {
  Dates,
  searchDatesChanged,
  searchLocationsChanged,
  searchPassengersChanged,
} from 'store/slices/domestic-flights/search';
import getPassengers from '../utils/getPassengers';
import { SearchLocationQuery } from '../types/common';
import type { Location } from 'module/flights/search/types/common';
import { notFoundRedirectUrlChanged } from 'store/slices/app/app';
import URLS from 'utils/routes/web';

const getSearchQueries = ({ originIata, destinationIata }: IataCodes): SearchLocationQuery[] => {
  if (originIata) {
    return [{ iataCode: originIata }, { iataCode: destinationIata }];
  }

  return [{ iataCode: destinationIata }];
};

const isSearchValid = ({ destinationIata }: IataCodes): boolean => Boolean(destinationIata);

function validateAndGetData(
  data: (Location | undefined)[] | undefined,
  hasOrigin: boolean,
): undefined | { origin?: Location; destination: Location } {
  if (!data) {
    return undefined;
  }

  if (hasOrigin && data[0] && data[1]) {
    return {
      origin: data[0],
      destination: data[1],
    };
  }

  if (!hasOrigin && data[0]) {
    return {
      destination: data[0],
    };
  }

  return undefined;
}

const useSyncSearchParams = () => {
  const iataCodes = useIataCodes();
  const validSearch = isSearchValid(iataCodes);
  const searchQueries = getSearchQueries(iataCodes);
  const hasOrigin = Boolean(iataCodes.originIata);
  const { data, isLoading } = useSearchLocations(searchQueries, {
    enabled: validSearch,
  });
  const dispatch = useAppDispatch();
  const router = useRouter();

  useEffect(() => {
    dispatch(notFoundRedirectUrlChanged(URLS.DOMESTIC));
  }, []);

  useEffect(() => {
    if (!validSearch) {
      router.replace('/404');
      return;
    }

    if (isLoading) {
      return;
    }

    const result = validateAndGetData(data, hasOrigin);

    if (!result) {
      router.replace('/404');
      return;
    }

    const { origin, destination } = result;
    dispatch(searchLocationsChanged({ origin, destination }));
  }, [data, dispatch, isLoading, validSearch, router, hasOrigin]);

  useEffect(() => {
    if (!hasOrigin) {
      return;
    }

    const { departureDate, returningDate, ...queryPassengers } = router.query as SearchQuery;
    const passengers = getPassengers(queryPassengers);
    const dates: Dates = { departure: departureDate, returning: returningDate };

    dispatch(searchDatesChanged(dates));
    dispatch(searchPassengersChanged(passengers));
  }, [dispatch, hasOrigin, router.query]);
};

export default useSyncSearchParams;
