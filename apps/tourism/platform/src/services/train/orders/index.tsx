import { QueryFunctionContext } from 'react-query';

import request from 'services/axios';
import API from 'utils/routes/api';
import {
  AddOrderPassengerPayload,
  CreateOrderData,
  CreateOrderPayload,
  SetPassengersOptionalService,
  TrainOrder,
} from './interface';

export const createOrder = async (payload: CreateOrderPayload) => {
  const { data }: { data: CreateOrderData } = await request.post(API.TRAIN.GET_TRAIN_ORDERS, {
    requestedTrain: payload.requestedTrain,
    passenger: { ...payload.passenger },
    compartmentGenderType: payload.compartmentGenderType,
  });
  return data;
};

export const getOrder = async (ctx: QueryFunctionContext) => {
  const { data }: { data: TrainOrder } = await request.get(
    API.TRAIN.GET_TRAIN_ORDERS + `/${ctx.queryKey[1]}`,
  );
  return data;
};

export const getOrderV2 = async (ctx: QueryFunctionContext) => {
  const { data }: { data: TrainOrder } = await request.get(
    API.TRAIN.GET_TRAIN_ORDERS_V2 + `/${ctx.queryKey[1]}`,
  );
  return data;
};

export const addOrderPassenger = async (payload: AddOrderPassengerPayload, orderId: string) => {
  const { data }: { data: AddOrderPassengerPayload } = await request.post(
    `${API.TRAIN.GET_TRAIN_ORDERS}/${orderId}/${API.TRAIN.ADD_TRAIN_ORDER_PASSENGER}`,
    {
      ...payload,
    },
  );

  return data;
};

export const setPassengerOptionalService = async (
  payload: SetPassengersOptionalService,
  orderId: string,
) => {
  const { data }: { data: SetPassengersOptionalService } = await request.post(
    `${API.TRAIN.GET_TRAIN_ORDERS}/${orderId}/${API.TRAIN.PASSENGER_SERVICE}`,
    {
      ...payload,
    },
  );

  return data;
};

export * from './reserve';
