import request from 'services/axios';
import API from 'utils/routes/api';
import { TAddPassengersBody } from './interface';

export const addBusPassengers = async (orderId: string, body: TAddPassengersBody) => {
  const { data } = await request.post(API.BUS.ADD_BUS_PASSENGERS(orderId), body);
  return data;
};
