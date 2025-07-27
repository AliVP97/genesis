import { useQuery } from 'react-query';
import { IHotelRoomsPayload } from 'services/hotel/detail/interface';
import { getHotelRooms } from 'services/hotel/detail/room';

export const useGetHotelRooms = (hotelRoomsPayload: IHotelRoomsPayload) => {
  const { data: hotelRooms, isLoading: hotelRoomsLoading } = useQuery(
    ['getHotelRooms', hotelRoomsPayload.hotelId, hotelRoomsPayload.requestId],
    () => getHotelRooms(hotelRoomsPayload),
  );

  const numberToPersianWorld = (index: number) => {
    const count = index + 1;
    switch (count) {
      case 1:
        return 'اتاق اول';
      case 2:
        return 'اتاق دوم';

      case 3:
        return 'اتاق سوم';

      case 4:
        return 'اتاق چهارم';
      case 5:
        return 'اتاق پنجم';
      case 6:
        return 'اتاق ششم';
    }
  };

  return {
    hotelRooms,
    hotelRoomsLoading,
    numberToPersianWorld,
  };
};
export default useGetHotelRooms;
