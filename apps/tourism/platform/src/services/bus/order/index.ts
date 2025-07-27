import { QueryFunctionContext } from 'react-query';
import request from 'services/axios';
import API from 'utils/routes/api';
import {
  BusPrepareRequest,
  BusPrepareResponse,
  CreateOrderData,
  CreateOrderPayload,
  TBusOrder,
  TOrderDiscountResponse,
  TRemoveOrderDiscountResponse,
} from './interface';

export const prepareBus = async (query: BusPrepareRequest) => {
  const { data }: { data: BusPrepareResponse } = await request.post(API.BUS.GET_UUID, { ...query });
  return data;
};

export const createOrder = async (payload: CreateOrderPayload) => {
  const { data }: { data: CreateOrderData } = await request.post(
    `${API.BUS.CREATE_ORDER}/${payload.busId}`,
  );
  return data;
};

export const getOrder = async (ctx: QueryFunctionContext) => {
  const { data }: { data: TBusOrder } = await request.get(
    API.BUS.GET_BUS_ORDER + `/${ctx.queryKey[1]}`,
  );
  return data;
};

export const applyDiscountOnOrder = async (orderId: string, discountCode: string) => {
  const { data }: { data: TOrderDiscountResponse } = await request.post(
    API.BUS.ORDER_DISCOUNT(orderId),
    { discountCode },
  );
  return data;
};
export const removeDiscountFromOrder = async (orderId: string) => {
  const { data }: { data: TRemoveOrderDiscountResponse } = await request.delete(
    API.BUS.ORDER_DISCOUNT(orderId),
  );
  return data;
};
