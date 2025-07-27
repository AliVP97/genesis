import request from 'services/axios';
import API from 'utils/routes/api';
import { TourVoucherPdf } from './interface';

export const downloadTourVoucherApi = async (id: string) => {
  const orderData = { order_id: id };
  const url = API.TOUR.GET_ORDER;
  const { data }: { data: TourVoucherPdf } = await request.post(url, orderData);
  return data;
};
