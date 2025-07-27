import { useQuery } from 'react-query';

import { searchStations } from '../api';
import { TQuery, TUseStations } from './types';

export const stationQuery: TQuery = (searchValue: string) => ({
  queryKey: ['train-stations', searchValue],
  queryFn: () => searchStations(searchValue),
  staleTime: Infinity,
  retry: 3,
});

export const useStations: TUseStations = (searchValue, queryOptions) => {
  return useQuery({
    ...stationQuery(searchValue),
    ...queryOptions,
  });
};
