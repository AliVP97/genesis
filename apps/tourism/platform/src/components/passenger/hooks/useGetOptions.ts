import { useQuery } from 'react-query';
import { getPassengerOptions } from 'services/passenger';

const useGetOptions = (serviceName: string) => {
  const { data } = useQuery(['passengerOptions', serviceName], () =>
    getPassengerOptions(serviceName),
  );
  return data;
};

export default useGetOptions;
