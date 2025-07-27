import request from 'services/axios';
import { THotelAddPassengers, THotelAddPassengersResponse, HotelAddPassengersV2 } from './types';
import { TGetHotelOrder } from 'services/hotel/orders/interface';

export const getOrder = async (ctx: string | string[] | undefined) => {
  const { data }: { data: TGetHotelOrder } = await request.get(`hotel/v1/order/${ctx}`);
  return data;
};

export const hotelAddPassengers = async (payload: {
  orderId: string | string[] | undefined;
  passengers: THotelAddPassengers[];
}) => {
  const { data }: { data: THotelAddPassengersResponse } = await request.post(
    `hotel/v1/order/${payload.orderId}/passenger`,
    { passenger: payload.passengers },
  );
  return data;
};

export const hotelAddPassengersV2 = async (orderId: string, passengers: HotelAddPassengersV2) => {
  const { data }: { data: THotelAddPassengersResponse } = await request.post(
    `hotel/v2/order/${orderId}/passenger`,
    { ...passengers },
  );
  return data;
};
