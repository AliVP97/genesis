import { QueryFunctionContext } from 'react-query';

import request from 'services/axios';
import API from 'utils/routes/api';
import { BusSeatsResponse, TAddSeatBody } from './interface';

export const getBusSeats = async (ctx: QueryFunctionContext) => {
  const { data }: { data: BusSeatsResponse } = await request.get(API.BUS.GET_BUS_SEATS, {
    params: { busId: ctx.queryKey[1] },
  });
  return data;
};

export const addBusSeats = async (orderId: string, body: TAddSeatBody) => {
  const { data } = await request.post(API.BUS.ADD_BUS_SEATS(orderId), body);
  return data;
};
