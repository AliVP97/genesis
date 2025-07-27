import { useQuery } from 'react-query';

import { getOrder } from 'services/bus/order';
import { TOrderQuery, TUseOrder } from './types';

export const orderQuery: TOrderQuery = (orderId) => ({
  queryKey: ['bus-order', orderId],
  queryFn: getOrder,
  staleTime: 30000, // 5 minutes
});

export const useOrder: TUseOrder = (orderId, queryOptions) => {
  return useQuery({
    enabled: !!orderId,
    ...orderQuery(orderId as string),
    ...queryOptions,
  });
};
