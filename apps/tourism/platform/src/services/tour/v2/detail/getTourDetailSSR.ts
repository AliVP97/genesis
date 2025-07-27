import API from 'utils/routes/api';
import { TTourGetPDPResponse } from './types';
import axios from 'axios';

export const getTourDetailSSR = async (tourId: string, calenderId: string) => {
  const { data }: { data: TTourGetPDPResponse } = await axios.get(
    API.TOUR.GET_TOUR_DETAIL + `/${tourId}`,
    {
      baseURL: process.env.NEXT_PUBLIC_BASE_URL,
      params: { packageDateID: calenderId },
      headers: {
        Authorization: 'OB55xx3c=~jh',
      },
    },
  );
  return data;
};
