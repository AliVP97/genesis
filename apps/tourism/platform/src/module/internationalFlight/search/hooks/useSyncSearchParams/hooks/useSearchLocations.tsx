import request from 'services/axios';
import URLS from 'utils/routes/api';
import { useQuery } from 'react-query';
import type { Location, QueryLocationType } from 'module/internationalFlight/search/types/common';
import { LOCATION_TYPES, QUERY_LOCATION_TYPES } from '../../../constants/common';
import { SearchAirportsResponseResult, SearchAirportsResponse } from '../types/api';
import { SearchLocationQuery } from '../types/common';

const predicateResultItem = (
  query: SearchLocationQuery,
  resultItem: SearchAirportsResponseResult,
) => {
  if (
    query.locationType === QUERY_LOCATION_TYPES.AIRPORT &&
    resultItem.iata?.type === 'IATA_TYPE_AIRPORT'
  ) {
    return resultItem.iata?.code === query.iataCode;
  }

  if (
    query.locationType === QUERY_LOCATION_TYPES.CITY &&
    resultItem.iata?.type === 'IATA_TYPE_CITY'
  ) {
    return resultItem.city?.iata === query.iataCode;
  }

  return false;
};

const transformResponse = (
  item: SearchAirportsResponseResult | undefined,
  queryLocationType: QueryLocationType,
): Location | undefined => {
  if (!item) {
    return undefined;
  }

  if (queryLocationType === QUERY_LOCATION_TYPES.AIRPORT) {
    return {
      type: LOCATION_TYPES.AIRPORT,
      iataCode: item.iata?.code || '',
      city: item.city?.name?.persian || '',
      title: item.airport?.name?.persian || '',
    };
  }

  return {
    type: LOCATION_TYPES.CITY,
    iataCode: item.city?.iata || '',
    city: item.city?.name?.persian || '',
    title: item.city?.name?.persian || '',
  };
};

const searchAirport = async (query: SearchLocationQuery): Promise<Location | undefined> => {
  const { data } = await request.get<SearchAirportsResponse>(
    URLS.INTERNATIONALFLIGHT.GET_AIRPORTS + '?query=' + query.iataCode,
  );

  const item = data.results?.find((item) => predicateResultItem(query, item));

  return transformResponse(item, query.locationType);
};

const searchAirports = (queries: SearchLocationQuery[]) =>
  Promise.all(queries.map((query) => searchAirport(query)));

const useSearchLocations = (queries: SearchLocationQuery[]) =>
  useQuery<(Location | undefined)[]>(
    ['international-flight-search-location', queries.map((query) => query.iataCode)],
    () => searchAirports(queries),
  );

export default useSearchLocations;
