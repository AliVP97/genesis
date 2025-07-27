import request from 'services/axios';
import API from 'utils/routes/api';
import {THotelPenalty} from './interface';

export const hotelPenalty = async (
  orderId: string,
  rooms: Array<string | undefined>,
) => {
  const {data}: {data: THotelPenalty} = await request.post(
    API.HOTEL.GET_PENALTY(orderId),
    {roomId: rooms},
  );
  return data;
};
