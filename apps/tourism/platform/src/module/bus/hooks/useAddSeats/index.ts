import { AxiosError } from 'axios';
import { useMutation, useQueryClient } from 'react-query';

import { addBusSeats } from 'services/bus/seats';
import { QUERIES } from '../constants';
import { TUseAddSeats } from './types';

export const useAddSeats: TUseAddSeats = (orderId, busId, options) => {
  const queryClient = useQueryClient();

  return useMutation({
    ...options,
    mutationFn: (body) => {
      if (typeof orderId !== 'string') {
        return Promise.reject(new AxiosError('شناسه سفارش صحیح نیست'));
      }

      return addBusSeats(orderId, body);
    },
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries(QUERIES.getOrder(orderId as string));

      options?.onSuccess?.(data, variables, context);
    },
  });
};
