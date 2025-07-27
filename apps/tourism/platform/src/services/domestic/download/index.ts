import request from 'services/axios';
import API from 'utils/routes/api';
import { ticketpdf } from './interface';

export const downloadApi = async (id: string) => {
  const { data }: { data: ticketpdf } = await request.get(API.DOWNLOAD + `/${id}/pdf`);
  return data;
};

export const internationalFlightDownloadApi = async (id: string) => {
  const { data }: { data: ticketpdf } = await request.get(
    API.INTERNATIONALFLIGHT.CREATE_ORDER + `/${id}/pdf`,
  );
  return data;
};
