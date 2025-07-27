import {useQuery} from 'react-query';

import {getMinPrices} from '../api';
import {TQuery, TUseMinPrices} from './types';
import {toDaysContents} from 'module/train/tickets/helper';
import {TLocation} from 'module/bus/search/types';

export const minPriceQuery: TQuery = payload => ({
  queryKey: ['bus-min-prices', payload],
  queryFn: () =>
    getMinPrices(
      (payload as TLocation).origin.stationCode,
      (payload as TLocation).destination.stationCode,
    ),
  enabled:
    !!payload &&
    !!payload.origin.stationCode &&
    !!payload.destination.stationCode,
});

export const useMinPrices: TUseMinPrices = (payload, queryOptions) => {
  return useQuery({
    ...minPriceQuery(payload),
    ...queryOptions,
    select: toDaysContents,
  });
};
