import { useQuery } from 'react-query';

import { useAuthContext } from 'utils/hooks/useAuthContext';
import { getPassengerListV2 } from 'services/general/passenger';
import { TPassengersQuery, TUsePassengers } from './types';

export const passengersQuery: TPassengersQuery = () => ({
  queryKey: 'passengers',
  queryFn: getPassengerListV2,
  staleTime: 60000,
});

export const usePassengers: TUsePassengers = (queryOptions) => {
  const { login } = useAuthContext();

  return useQuery({
    ...queryOptions,
    enabled: login || !!queryOptions?.enabled,
    ...passengersQuery(),
  });
};
