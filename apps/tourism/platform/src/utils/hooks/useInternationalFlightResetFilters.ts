import router from 'next/router';
import { useAppSelector } from 'store/hook/storeHook';
import { selectSearchData } from 'store/slices/internationalFlight/selectors/search';
import { removeCookie } from 'utils/helpers/coockieHelper';
import { useExpireContext } from './useExpireContext';
import {
  LOCATION_TYPES,
  QUERY_LOCATION_TYPES,
  QUERY_TRIP_TYPES,
  TRIP_TYPES,
} from 'module/internationalFlight/search/constants/common';
import URLS from 'utils/routes/web';
import type {
  LocationType,
  Location,
  CabinType,
} from 'module/internationalFlight/search/types/common';
import { Passengers, Dates, SearchState } from 'store/slices/internationalFlight/search';
import getLastInternationalFlightSearches from 'module/internationalFlight/search/helpers/getLastInternationalFlightSearches';
import { useMemo } from 'react';

type Query = {
  departureDate: string;
  cabinType: string;
  returningDate?: string;
  adult: number;
  child: number;
  infant: number;
  tripMode: string;
  sort: string;
  originType?: string;
  destinationType: string;
};

const IGNORE_PAGES = ['/checkout', '/passengers'] as const;

const createSearchParams = (query: Query) => {
  const searchParams = new URLSearchParams();

  for (const [key, value] of Object.entries(query)) {
    if (value !== undefined) {
      searchParams.append(key, String(value));
    }
  }

  return searchParams.toString();
};

const getLocationType = (locationType?: LocationType) =>
  locationType === LOCATION_TYPES.AIRPORT
    ? QUERY_LOCATION_TYPES.AIRPORT
    : QUERY_LOCATION_TYPES.CITY;

const createPath = (locations: { origin?: Location; destination?: Location }) =>
  URLS.INTERNATIONAL + locations.origin?.iataCode + '-' + locations.destination?.iataCode;

const getTripMode = (tripType: string) =>
  tripType === TRIP_TYPES.ROUND_TRIP ? QUERY_TRIP_TYPES.ROUND_TRIP : QUERY_TRIP_TYPES.ONE_WAY;

const createQuery = (
  passengers: Passengers,
  dates: Dates,
  cabinType: string,
  tripType: string,
  locations: { origin?: Location; destination?: Location },
): Query => ({
  ...passengers,
  departureDate: dates.departure,
  cabinType,
  returningDate: dates.returning,
  tripMode: getTripMode(tripType),
  sort: 'price',
  destinationType: getLocationType(locations?.destination?.type),
  originType: locations.origin?.type ? getLocationType(locations.origin?.type) : '',
});

const isIgnorePage = (path: string) => IGNORE_PAGES.some((page) => path.includes(page));

const useGetSearchData = (): SearchState | undefined => {
  const state = useAppSelector(selectSearchData);

  return useMemo(() => {
    if (!state.locations.origin?.iataCode) {
      // eslint-disable-next-line @typescript-eslint/no-use-before-define
      return getLastSearch();
    }

    return state;
  }, [state]);
};

const getLastSearch = (): SearchState | undefined => {
  const lastSearches = getLastInternationalFlightSearches();

  if (!lastSearches?.length) {
    return;
  }

  const first = lastSearches[0];

  return {
    passengers: {
      adult: first.passenger.adult,
      child: first.passenger.child,
      infant: first.passenger.infant,
    },
    tripType: first.departureDate ? TRIP_TYPES.ROUND_TRIP : TRIP_TYPES.ONE_WAY,
    cabinType: first.cabinType as CabinType,
    dates: {
      departure: first.departureDate,
      returning: first.returningDate,
    },
    locations: {
      destination: {
        type: (first.destination.type?.id ?? '') as LocationType,
        iataCode: first.destination?.value ?? '',
        title: first.destination.value,
        city: first.destination.data?.cityTitle ?? '',
      },
      origin: {
        type: (first.origin?.type?.id ?? '') as LocationType,
        iataCode: first.origin?.value ?? '',
        title: first.origin?.value ?? '',
        city: first.origin?.data?.cityTitle ?? '',
      },
    },
  };
};

const useInternationalFlightResetFilters = () => {
  const { uuidExpired, checkExpiry } = useExpireContext();
  const searchData = useGetSearchData();

  const resetInternationalAction = () => {
    if (!searchData) {
      router.push(URLS.INTERNATIONAL);
      return;
    }

    const { cabinType, dates, locations, passengers, tripType } = searchData;

    localStorage.removeItem('reserve_expiry');

    if (uuidExpired) {
      removeCookie('uuid');
      checkExpiry({ type: 'uuid', expired: false });
    }

    /**
     * This code is used for push url through current search data if is not located
     * in ignore pages but is reload if is request page from search page.
     */
    if (!isIgnorePage(router.asPath)) {
      return router.reload();
    }

    const query = createQuery(passengers, dates, cabinType, tripType, locations);
    const path = createPath(locations);
    const searchParams = createSearchParams(query);
    const url = path + '?' + searchParams;

    // console.log(url);
    router.push(url, undefined, { shallow: true });
  };

  return { resetInternationalAction };
};

export default useInternationalFlightResetFilters;
