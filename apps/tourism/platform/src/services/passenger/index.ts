import request from 'services/axios';
import {
  AddPassengerPayload,
  AddPassengerResponse,
  GetAllPassengerResponse,
  GetPassengerOptionsResponse,
  GetPassengrFieldsResponse,
} from './interface';

import {
  ADD_PASSENGER,
  DELETE_PASSENGER,
  GET_ALL_PASSENGER,
  GET_PASSENGER_FIELDS,
  GET_PASSENGER_OPTIONS,
  UPDATE_PASSENGER,
} from './services';

export const getPassengerFields = async (serviceName: string) => {
  const { data }: { data: GetPassengrFieldsResponse } = await request.get(
    GET_PASSENGER_FIELDS(serviceName),
  );
  return data;
};

export const addPassenger = async (payload: AddPassengerPayload) => {
  const { data }: { data: AddPassengerResponse } = await request.post(ADD_PASSENGER(), {
    ...payload,
  });
  return data;
};
export const updatePassenger = async (payload: AddPassengerPayload, id: string) => {
  const { data }: { data: AddPassengerResponse } = await request.put(UPDATE_PASSENGER(id), {
    ...payload,
  });
  return data;
};
export const getPassengerOptions = async (serviceName: string) => {
  const { data }: { data: GetPassengerOptionsResponse } = await request.get(
    GET_PASSENGER_OPTIONS(serviceName),
  );
  return data;
};

export const getAllPassenger = async (serviceName: string, referenceDate?: string) => {
  const { data }: { data: GetAllPassengerResponse } = await request.get(
    GET_ALL_PASSENGER(serviceName, referenceDate),
  );
  return data;
};

export const deletePassenger = async (id: string) => {
  const { data }: { data: GetAllPassengerResponse } = await request.delete(DELETE_PASSENGER(id));
  return data;
};
