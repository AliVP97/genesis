import request from 'services/axios';
import API from 'utils/routes/api';
import { hotelVoucherPdf } from './interface';

export const downloadHotelVoucherApi = async (id: string) => {
  const { data }: { data: hotelVoucherPdf } = await request.get(
    API.HOTEL.GET_ORDER + `/${id}/ticketPdf`,
  );
  return data;
};
