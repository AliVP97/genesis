import request from 'services/axios';

import API from 'utils/routes/api';
import { TTourTripListResponse } from './types';

export const getHotTours = async () => {
  const { data }: { data: TTourTripListResponse } = await request.get(API.TOUR.GET_HOT_TOURS);
  return data;
};
