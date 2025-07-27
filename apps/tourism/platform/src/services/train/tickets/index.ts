import { QueryFunctionContext } from 'react-query';

import API from 'utils/routes/api';
import request from 'services/axios';
import {
  TrainMiddleStationsResponse,
  TrainResponse,
  TrainTicketRequest,
  TDaysPricesResponse,
} from './interface';

export const getTrainTicketList = async (query: TrainTicketRequest) => {
  const { data }: { data: TrainResponse } = await request.post(API.TRAIN.GET_TRAIN_TICKET, {
    queries: query.queries,
  });
  return data;
};

export const getMiddleStations = async (ctx: QueryFunctionContext) => {
  const { data }: { data: TrainMiddleStationsResponse } = await request.get(
    API.TRAIN.GET_TRAIN + `/${ctx.queryKey[1]}` + '/intermediatestations',
  );
  return data;
};

export const getDaysPrices = async (origin: string, destination: string) => {
  const { data }: { data: TDaysPricesResponse } = await request.get(
    `${API.TRAIN.GET_DAYS_PRICES}?originCode=${origin}&destinationCode=${destination}`,
  );
  return data;
};
