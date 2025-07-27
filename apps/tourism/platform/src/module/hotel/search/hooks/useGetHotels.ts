import { useQuery } from 'react-query';
import { getHotelsList } from 'services/hotel/prepare';
import { TGetHotelSearchIdResponse } from 'services/hotel/prepare/interface';

export const useGetHotels = (requestIdData: TGetHotelSearchIdResponse) => {
  const {
    data: hotelsData,
    isLoading: isHotelsLoading,
    isFetching: isHotelsFetching,
    error: getHotelListError,
  } = useQuery(['getHotelsList'], () => getHotelsList(requestIdData?.requestId as string), {
    enabled: !!requestIdData?.requestId,
    refetchInterval: (data) =>
      !data?.isFinished ? Number(requestIdData?.secBetweenRequests) * 1000 : false,
  });
  const coveragePercent = hotelsData?.coveragePercent;

  return {
    hotelsData,
    isHotelsLoading,
    isHotelsFetching,
    coveragePercent,
    getHotelListError,
  };
};
