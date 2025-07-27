import request from 'services/axios';

import API from 'utils/routes/api';
import { Ttourv1FrequenciesResponse } from './types';

export const getDestinationTour = async (tourType: string) => {
  const { data }: { data: Ttourv1FrequenciesResponse } = await request.get(
    API.TOUR.GET_CITIES + `/${tourType}`,
  );
  return data;
};
