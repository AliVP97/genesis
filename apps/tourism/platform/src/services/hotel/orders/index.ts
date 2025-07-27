import request from 'services/axios';
import API from 'utils/routes/api';
import {
  TGetHotelOrder,
  THotelContactInfo,
  THotelReserveResponse,
  TCreateOrderPayload,
  TCreateOrderResponse,
} from './interface';
import { QueryFunctionContext } from 'react-query';

export const getOrder = async (ctx: QueryFunctionContext) => {
  const { data }: { data: TGetHotelOrder } = await request.get(
    API.HOTEL.GET_ORDER + `/${ctx.queryKey[1]}`,
  );
  return data;
};

export const reserve = async (id: string, acceptPriceChange: boolean) => {
  const { data }: { data: THotelReserveResponse } = await request.post(
    `${API.HOTEL.GET_ORDER}/${id}/reserve`,
    {
      acceptPriceChange,
    },
  );
  return data;
};

export const createOrder = async (createOrderPayload: TCreateOrderPayload) => {
  const { data }: { data: TCreateOrderResponse } = await request.post(
    API.HOTEL.GET_ORDER + '/create',
    {
      roomIds: createOrderPayload.roomIds,
      hotelId: createOrderPayload.hotelId,
      cityId: createOrderPayload.cityId,
      requestId: createOrderPayload.requestId,
    },
  );
  return data;
};

export const contactInfo = async (payload: THotelContactInfo) => {
  const { data }: { data: Record<string, never> } = await request.post(API.HOTEL.CONTACT_INFO, {
    email: payload.email,
    orderId: payload.orderId,
    phoneNumber: payload.phoneNumber,
  });
  return data;
};
