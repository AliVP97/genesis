import request from 'services/axios';
import API from 'utils/routes/api';
import { busTicketPdf } from './interface';

export const downloadBusTicketApi = async (id: string) => {
  const { data }: { data: busTicketPdf } = await request.get(API.BUS.DOWNLOAD + `/${id}/pdf`);
  return data;
};
