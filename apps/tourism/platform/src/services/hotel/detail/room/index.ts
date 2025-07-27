import request from '../../../axios';
import API from 'utils/routes/api';
import { IHotelRoomsPayload, THotelRooms } from '../interface';

export const getHotelRooms = async (hotelRoomsPayload: IHotelRoomsPayload) => {
  const { data }: { data: THotelRooms } = await request.get(
    API.HOTEL.GET_HOTELS + `/${hotelRoomsPayload.hotelId}/rooms`,
    {
      params: {
        requestId: hotelRoomsPayload?.requestId,
      },
    },
  );
  return data;
};
