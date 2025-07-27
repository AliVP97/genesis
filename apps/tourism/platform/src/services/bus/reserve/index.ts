import request from 'services/axios';
import API from 'utils/routes/api';
import { ReserveBusResponse } from './interface';

export const reserveTicket = async (orderId: string) => {
  const { data }: { data: ReserveBusResponse } = await request.post(
    API.BUS.RESERVE_TICKET + `/${orderId}`,
  );
  return data;
};
