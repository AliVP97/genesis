import request from '../../../axios';
import API from 'utils/routes/api';
import { TTourGetPDPResponse } from './types';

export const getTourDetail = async (tourId: string, calenderId: string) => {
  const { data }: { data: TTourGetPDPResponse } = await request.get(
    API.TOUR.GET_TOUR_DETAIL + `/${tourId}`,
    { params: { packageDateID: calenderId } },
  );
  return data;
};
