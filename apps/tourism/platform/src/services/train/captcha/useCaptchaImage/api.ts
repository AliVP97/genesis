import request from 'services/axios';
import API from 'utils/routes/api';
import { TData, TQueryFunction } from './types';

export const getCaptchaImage: TQueryFunction = async (arg) => {
  const { data } = await request.get<TData>(API.TRAIN.CAPTCHA.GET_IMAGE(arg.queryKey[1]));

  return data;
};
