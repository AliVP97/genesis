import request from 'services/axios';
import API from 'utils/routes/api';
import { ticketpdf } from './interface';

export const downloadApi = async (id: string) => {
  const { data }: { data: ticketpdf } = await request.get(API.TRAIN.DOWNLOAD + `/${id}`);
  return data;
};
