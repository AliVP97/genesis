import { useQuery } from 'react-query';
import { getHotelPassengerConfig } from 'services/hotel/passenger';

const useGetHotelPassengerConfig = () => {
  const { data: hotelPassengerConfig, isLoading } = useQuery(
    ['getHotelConfig'],
    getHotelPassengerConfig,
  );
  return {
    hotelPassengerConfig,
    isLoading,
  };
};

export default useGetHotelPassengerConfig;
