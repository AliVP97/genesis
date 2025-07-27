import request from 'services/axios';
import API from 'utils/routes/api';
import { TBusStations } from './interface';

export const getBusiestBusTransportServiceProviders = async () => {
  const { data }: { data: TBusStations } = await request.get(API.BUS.FREQUENT_CITIES);
  return data;
};

export const searchStations = async (searchValue: string) => {
  const { data } = await request.get<TBusStations>(API.BUS.GET_BUS_STATIONS, {
    params: { query: searchValue },
  });
  return data;
};
