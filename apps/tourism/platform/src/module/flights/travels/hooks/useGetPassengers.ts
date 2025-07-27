import { useQuery } from 'react-query';
import { getPassengerListV2 } from 'services/general/passenger';
const UseGetPassengers = () => {
  const {
    data: passengers,
    isLoading: passengerLoading,
    refetch: getPassengers,
  } = useQuery('passengerList', getPassengerListV2, { enabled: false });
  return { passengers, passengerLoading, getPassengers };
};

export default UseGetPassengers;
