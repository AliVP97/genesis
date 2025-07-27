import { useMutation, useQuery } from 'react-query';

import { notify } from 'utils/notification';
import { getAlert, setAlert, updateAlert } from '../api';
import { TError, TPayload } from './types';
import { TSetAlertPayload, TSetAlertResponse } from '../types';

export const useAlert = (payload?: TPayload) => {
  const {
    data,
    isFetching: isGetLoading,
    error: getError,
    refetch,
  } = useQuery({
    queryKey: ['train-alert', payload],
    queryFn: () => getAlert(payload as TPayload),
    enabled: !!(payload?.originCode && payload?.destinationCode && payload?.departureDate),
    staleTime: Infinity,
    retry: 3,
  });

  const {
    mutate: setAlertMutation,
    isLoading: isSetLoading,
    error: setError,
  } = useMutation<TSetAlertResponse, TError, Pick<TSetAlertPayload, 'id' | 'isActive'>>({
    mutationFn: ({ id, isActive }) =>
      id ? updateAlert({ ...payload, id, isActive }) : setAlert({ ...payload, isActive }),
    onSuccess: ({ message }) => {
      notify({
        message,
      });
      refetch();
    },
    onError: ({ response }) => {
      notify({
        message: response?.data.message,
      });
    },
  });

  return {
    data,
    isLoading: isGetLoading || isSetLoading,
    error: getError || setError,
    setAlert: setAlertMutation,
    refetch,
  };
};
