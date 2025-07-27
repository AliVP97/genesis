import request from 'services/axios';

import API from 'utils/routes/api';
import { TrainVerifyCaptchaRequestBody, TrainVerifyCaptchResponse } from './interface';

export const verifyCaptcha = async (body: TrainVerifyCaptchaRequestBody) => {
  const { data }: { data: TrainVerifyCaptchResponse } = await request.post(
    API.TRAIN.CAPTCHA.VERIFY,
    body,
  );

  return data;
};
