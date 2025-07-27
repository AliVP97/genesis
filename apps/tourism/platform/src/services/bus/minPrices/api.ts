import request from 'services/axios';
import API from 'utils/routes/api';
import {TDaysPricesResponse} from 'services/train/tickets/interface';

export const getMinPrices = async (
  originCode: string,
  destinationCode: string,
) => {
  const {data} = await request.get<TDaysPricesResponse>(
    API.BUS.GET_DAYS_PRICES,
    {
      params: {originCode, destinationCode},
    },
  );
  return data;
};
