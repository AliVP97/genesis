import request from 'services/axios';
import URLS from 'utils/routes/api';
import { useQuery } from 'react-query';
import type { Location } from 'module/flights/search/types/common';
import { SearchAirportsResponseResult, SearchAirportsResponse } from '../types/api';
import { SearchLocationQuery } from '../types/common';

const predicateResultItem = (
  query: SearchLocationQuery,
  resultItem: NonNullable<SearchAirportsResponse['airports']>[number],
) => {
  return query.iataCode === resultItem.iata;
};

const transformResponse = (
  item: SearchAirportsResponseResult | undefined,
): Location | undefined => {
  if (!item) {
    return undefined;
  }

  return {
    airport: item.name?.farsi || '',
    city: item.city?.name?.farsi || '',
    value: item.iata || '',
  };
};

const searchAirport = async (query: SearchLocationQuery): Promise<Location | undefined> => {
  const { data } = await request.get<SearchAirportsResponse>(
    URLS.GET_AIRPORTS + '?query=' + query.iataCode,
  );

  const item = data.airports?.find((item) => predicateResultItem(query, item));

  return transformResponse(item);
};

const searchAirports = (queries: SearchLocationQuery[]) =>
  Promise.all(queries.map((query) => searchAirport(query)));

const useSearchLocations = (
  queries: SearchLocationQuery[],
  { enabled }: { enabled?: boolean } = {},
) =>
  useQuery<(Location | undefined)[]>(
    ['domestic-flight-search-location', queries.map((query) => query.iataCode)],
    () => searchAirports(queries),
    { enabled },
  );

export default useSearchLocations;
