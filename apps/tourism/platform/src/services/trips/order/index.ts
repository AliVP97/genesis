import { QueryFunctionContext } from 'react-query';
import request from 'services/axios';
import API from 'utils/routes/api';
import { TTrip } from '../types';

export const getTrip = async (ctx: QueryFunctionContext) => {
  const { data }: { data: TTrip } = await request.get(
    API.GET_TRIPS + `/${ctx.queryKey[1]}/${ctx.queryKey[2]}`,
  );
  return data;
};
