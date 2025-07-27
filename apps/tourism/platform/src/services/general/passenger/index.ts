import { TPassengerV2Payload } from 'services/general/passenger/interface';
import request from 'services/axios';
import API from 'utils/routes/api';
import {
  AddPassenger,
  PassengerPayload,
  DeletePassenger,
  EditPassenger,
  fetchPassengerList,
  CountryResponse,
  TPassengerV2Response,
  PassengerV2EditPayload,
} from './interface';

export const getPassengerList = async () => {
  const { data }: { data: fetchPassengerList } = await request.get(API.PASSENGERS, {});
  return data;
};

export const addPassenger = async (payload: PassengerPayload['body']) => {
  const { data }: { data: AddPassenger } = await request.post(API.PASSENGERS_V2, payload);
  return data;
};

export const deletePassenger = async (id: string) => {
  const { data }: { data: DeletePassenger } = await request.delete(API.PASSENGERS_V2 + `/${id}`);
  return data;
};

export const editPassenger = async (payload: PassengerPayload) => {
  const { data }: { data: EditPassenger } = await request.put(
    API.PASSENGERS + `/${payload.id}`,
    payload.body,
  );
  return data;
};

export const getCountriesList = async () => {
  const { data }: { data: CountryResponse } = await request.get(API.GET_COUNTRIES_V2);
  return data;
};

/*******  V2  *********/

export const getPassengerListV2 = async () => {
  const { data }: { data: TPassengerV2Response } = await request.get(API.PASSENGERS_V2);
  return data;
};

export const addMultiPassenger = async (payload: {
  passengers: Array<PassengerPayload['body']>;
}) => {
  const { data }: { data: AddPassenger } = await request.post(API.PASSENGERS_V2 + '/batch', {
    ...payload,
  });
  return data;
};

export const editPassengerV2 = async (payload: PassengerV2EditPayload) => {
  const { data }: { data: EditPassenger } = await request.put(
    API.PASSENGERS_V2 + `/${payload.id}`,
    payload.body,
  );
  return data;
};

export const addPassengerV2 = async (payload: TPassengerV2Payload) => {
  const { data }: { data: AddPassenger } = await request.post(API.PASSENGERS_V2, payload);
  return data;
};
