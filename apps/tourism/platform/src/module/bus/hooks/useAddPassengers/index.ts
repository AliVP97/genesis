import { useEffect } from 'react';

import { AxiosError } from 'axios';
import { useMutation, useQueryClient } from 'react-query';

import { addBusPassengers } from 'services/bus/passengers';
import { QUERIES } from '../constants';
import { TUseAddPassengers } from './types';

export const useAddPassengers: TUseAddPassengers = (orderId, options) => {
  const queryClient = useQueryClient();

  useEffect(() => {
    return () => {
      queryClient.invalidateQueries(QUERIES.getPassengers());
    };
  }, []);

  return useMutation({
    ...options,
    mutationFn: (body) => {
      if (typeof orderId !== 'string') {
        return Promise.reject(new AxiosError('شناسه سفارش صحیح نیست'));
      }

      return addBusPassengers(orderId, body);
    },
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries(QUERIES.getOrder(orderId as string));

      options?.onSuccess?.(data, variables, context);
    },
  });
};
