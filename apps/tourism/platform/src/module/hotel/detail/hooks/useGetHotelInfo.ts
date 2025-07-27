import { useQuery } from 'react-query';
import { getHotelInfo } from 'services/hotel/hotelsAndCities';

export const UseGetHotelInfo = (hotelId: string, requestId: string) => {
  const { data: hotel, isLoading: isLoading } = useQuery(['getHotelInfo', hotelId], () =>
    getHotelInfo(requestId, hotelId),
  );
  return {
    hotel,
    isLoading,
  };
};
export default UseGetHotelInfo;
