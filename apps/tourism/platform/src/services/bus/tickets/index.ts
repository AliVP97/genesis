import API from 'utils/routes/api';
import request from 'services/axios';
import { BusTicketResponse } from './interface';
import { QueryFunctionContext } from 'react-query';

export const getBusTicketList = async (ctx: QueryFunctionContext) => {
  const { data }: { data: BusTicketResponse } = await request.get(API.BUS.GET_BUS_LIST, {
    params: { requestId: ctx.queryKey[1] },
  });
  return data;
};
