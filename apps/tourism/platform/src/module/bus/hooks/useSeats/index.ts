import { useQuery } from 'react-query';

import { getBusSeats } from 'services/bus/seats';
import { TSeatsQuery, TUseSeats } from './types';

export const seatsQuery: TSeatsQuery = (busId) => ({
  queryKey: ['bus-seats', busId],
  queryFn: getBusSeats,
  staleTime: 10000,
});

export const useSeats: TUseSeats = (busId, queryOptions) => {
  return useQuery({
    enabled: !!busId,
    ...queryOptions,
    ...seatsQuery(busId as string),
  });
};
