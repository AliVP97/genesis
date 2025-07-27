import request from 'services/axios';
import API from 'utils/routes/api';
import { TrainSearchResponse } from './interface';

export const getBusiestTransportServiceProviders = async () => {
  const { data }: { data: TrainSearchResponse } = await request.get(
    API.TRAIN.GET_BUSIEST_TRANSPORT_SERVICE_PROVIDERS,
  );
  return data;
};

export const searchStations = async (searchValue: string) => {
  const { data } = await request.get<TrainSearchResponse>(API.TRAIN.GET_TRAIN_STATIONS, {
    params: { query: searchValue },
  });

  return data;
};
