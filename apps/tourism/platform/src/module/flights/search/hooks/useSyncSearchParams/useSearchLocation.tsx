import request from 'services/axios';
import URLS from 'utils/routes/api';
import { useQuery } from 'react-query';
import { IataType, SearchAirportsResponse, SearchAirportsResponseResult } from './types';
import { IATA_TYPES } from './constants';
import { Location } from 'module/internationalFlight/search/types/common';

const predicateResultItem = (
  query: SearchAirportQuery,
  resultItem: SearchAirportsResponseResult,
) => {
  if (query.iataType === IATA_TYPES.AIRPORT && resultItem.iata?.type === 'IATA_TYPE_AIRPORT') {
    return resultItem.iata?.code === query.iataCode;
  }

  if (query.iataType === IATA_TYPES.CITY && resultItem.iata?.type === 'IATA_TYPE_CITY') {
    return resultItem.city?.iata === query.iataCode;
  }

  return false;
};

const transformResponse = (
  item: SearchAirportsResponseResult | undefined,
  queryIataType: IataType,
): Location | undefined => {
  if (!item) {
    return undefined;
  }

  if (queryIataType === IATA_TYPES.AIRPORT) {
    return {
      city: item.city?.name?.persian || '',
      type: 'airport',
      iataCode: item.iata?.code || '',
      title: item.airport?.name?.persian || '',
    };
  }

  return {
    city: item.city?.name?.persian || '',
    type: 'city',
    iataCode: item.city?.iata || '',
    title: item.city?.name?.persian || '',
  };
};

const searchAirport = async (query: SearchAirportQuery): Promise<Location | undefined> => {
  const { data } = await request.get<SearchAirportsResponse>(
    URLS.INTERNATIONALFLIGHT.GET_AIRPORTS + '?query=' + query.iataCode,
  );

  const item = data.results?.find((item) => predicateResultItem(query, item));
  return transformResponse(item, query.iataType);
};

const searchAirports = (queries: SearchAirportQuery[]) =>
  Promise.all(queries.map((query) => searchAirport(query)));

type SearchAirportQuery = {
  iataCode: string;
  iataType: IataType;
};

const useSearchLocation = (queries: SearchAirportQuery[]) =>
  useQuery<(Location | undefined)[]>(
    ['international-flight-search-location', queries.map((query) => query.iataCode)],
    () => searchAirports(queries),
  );

export default useSearchLocation;
