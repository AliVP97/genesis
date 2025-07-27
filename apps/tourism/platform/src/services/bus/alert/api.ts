import API from 'utils/routes/api';
import request from 'services/axios';
import { TGetAlertPayload, TGetAlertResponse, TSetAlertPayload, TSetAlertResponse } from './types';

export const getAlert = async (payload: TGetAlertPayload) => {
  const { data }: { data: TGetAlertResponse } = await request.get(API.BUS.ALERT, {
    params: payload,
  });
  return data;
};

export const setAlert = async (payload: TSetAlertPayload) => {
  const { data }: { data: TSetAlertResponse } = await request.post(API.BUS.ALERT, payload);
  return data;
};

export const updateAlert = async (payload: TSetAlertPayload) => {
  const { data }: { data: TSetAlertResponse } = await request.patch(API.BUS.ALERT, payload);
  return data;
};
