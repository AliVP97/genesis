import { useQuery } from 'react-query';

import { getCaptchaImage } from './api';
import { TQuery, TUseCaptchaImage } from './types';

export const captchaImageQuery: TQuery = (orderId) => ({
  queryKey: ['train-captcha', orderId],
  queryFn: getCaptchaImage,
});

export const useCaptchaImage: TUseCaptchaImage = (orderId, queryOptions) => {
  return useQuery({
    ...queryOptions,
    ...captchaImageQuery(orderId),
  });
};
