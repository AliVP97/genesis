import { QueryFunctionContext } from 'react-query';
import request from 'services/axios';
import API from 'utils/routes/api';
import {
  Order,
  GetTripReponse,
  TFlightCreateOrderPayload,
  TFlightCreateOrderResponse,
} from './interface';

export const getOrders = async (ctx: QueryFunctionContext) => {
  const { data }: { data: GetTripReponse } = await request.get(API.GET_TRIPS, {
    params: ctx.queryKey[1],
  });
  return data;
};

export const getOrder = async (ctx: QueryFunctionContext) => {
  const { data }: { data: Order } = await request.get(API.ORDERS + `/${ctx.queryKey[1]}`, {
    // headers: {
    //   'Cache-Control': 'no-store, no-cache',
    //   Pragma: 'no-cache',
    // },
  });
  return data;
};

export const createDomesticOrder = async (payload: TFlightCreateOrderPayload) => {
  const { data }: { data: TFlightCreateOrderResponse } = await request.post(API.ORDERS2, payload);
  return data;
};
