// import {TTourGetPDPResponse} from '../detail/types';
import axios from 'axios';
import API from 'utils/routes/api';
import { TTourGetCheckoutResponse } from './type';

export const getTourCheckoutSSR = async (packageDateID: string, requestID: string) => {
  const { data }: { data: TTourGetCheckoutResponse } = await axios.get(
    API.TOUR.GET_CHECK_OUT + `/${packageDateID}`,
    {
      baseURL: process.env.NEXT_PUBLIC_BASE_URL,
      params: { requestID: requestID },
      headers: {
        Authorization: 'OB55xx3c=~jh',
      },
    },
  );
  return data;
};
