import { useQuery } from 'react-query';

import { useAuthContext } from 'utils/hooks/useAuthContext';
import { TPassengersQuery, TUsePassengers } from './types';
import { getAllPassenger } from 'services/passenger';

export const passengersQuery: TPassengersQuery = (isInternational: boolean) => {
  const serviceName = (isInternational ? 'international' : 'domestic') + '-' + 'bus';

  return {
    queryKey: ['passengerList', serviceName],
    queryFn: () => getAllPassenger(serviceName),
    staleTime: 60000,
  };
};

export const usePassengers: TUsePassengers = (isInternational, queryOptions) => {
  const { login } = useAuthContext();

  return useQuery({
    ...queryOptions,
    enabled: login || !!queryOptions?.enabled,
    ...passengersQuery(isInternational),
  });
};
