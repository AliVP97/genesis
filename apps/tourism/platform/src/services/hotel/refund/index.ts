import request from 'services/axios';
import API from 'utils/routes/api';
import {QueryFunctionContext} from 'react-query';
import {THotelRefundable, TIntHotelRoomRefundResponse} from './interface';

export const getHotelRefundable = async (ctx: QueryFunctionContext) => {
  const { data }: { data: THotelRefundable } = await request.get(
    API.HOTEL.GET_ORDER + `/${ctx.queryKey[1]}/refund`,
  );
  return data;
};

export const hotelRefund = async (orderId: string, rooms: Array<string | undefined>) => {
  const { data }: { data: unknown } = await request.post(`hotel/v1/order/${orderId}/refund`, {
    roomId: rooms,
  });
  return data;
};

export const internationalHotelRefund = async (
  orderId: string,
  rooms: Array<string | undefined>,
) => {
  const {data}: {data: TIntHotelRoomRefundResponse} = await request.post(
    `hotel/v1/refund/${orderId}`,
    {roomId: rooms},
  );
  return data;
};
