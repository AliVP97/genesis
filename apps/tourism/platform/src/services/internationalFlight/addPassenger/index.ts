import request from 'services/axios';
import { TSetPassengersPayload, TSetPassengersResponse } from './interface';
import API from 'utils/routes/api';
export const setPassengers = async (payload: TSetPassengersPayload) => {
  const { data }: { data: TSetPassengersResponse } = await request.post(
    API.INTERNATIONALFLIGHT.CREATE_ORDER_V2 + `/${payload.orderId}` + '/set-passengers',
    payload,
  );
  return data;
};
