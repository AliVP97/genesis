import { useQuery } from 'react-query';
import { getPassengerListV2 } from 'services/general/passenger';

const UseGetPassengers = (enabled: boolean) => {
  const {
    data: passengers,
    isLoading: passengerLoading,
    refetch: getPassengers,
  } = useQuery('passengerList', getPassengerListV2, { enabled, cacheTime: 0 });

  return { passengerLoading, passengers, getPassengers };
};

export { UseGetPassengers };
