import { AxiosRequestConfig } from 'axios';

import request from 'services/axios';
import API from 'utils/routes/api';
import { definitions, operations } from 'types/rajatrain';

type TReserveQuery = operations['Train_CreatePaymentWithCaptcha']['parameters']['path'];
export type TReserveBody = definitions['TrainCreatePaymentWithCaptchaBody'];

type TReserveResponse = definitions['rajaCreatePaymentResponse'];

export const reserveOrder = async (
  { orderId, ...payload }: TReserveQuery & TReserveBody,
  axiosConfig?: AxiosRequestConfig,
) => {
  const { data }: { data: TReserveResponse } = await request.post(
    API.TRAIN.CREATE_PAYMENT(orderId),
    payload,
    axiosConfig,
  );
  return data;
};
