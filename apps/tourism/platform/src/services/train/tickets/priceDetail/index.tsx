import request from 'services/axios';
import API from 'utils/routes/api';
import { PriceDetailData, PriceDetailPayload } from './interface';

export const priceDetail = async (payload: PriceDetailPayload) => {
  const { data }: { data: PriceDetailData } = await request.post(
    API.TRAIN.GET_TRAIN + `/${payload.trainId}/price-detail`,
    {
      passenger: { ...payload.passenger },
      wantCompartment: payload.wantCompartment,
    },
  );
  return data;
};
