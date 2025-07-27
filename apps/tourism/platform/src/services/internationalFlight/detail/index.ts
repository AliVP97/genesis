import request from '../../axios';
import API from 'utils/routes/api';
import { TInternationalTicketDetailResponse, TTicketDetailPayload } from './interface';

export const getTicketDetail = async (payload: TTicketDetailPayload) => {
  const { data }: { data: TInternationalTicketDetailResponse } = await request.get(
    API.INTERNATIONALFLIGHT.GET_TICKET_DETAIL +
      `/${payload.requestId}/itineraries/${payload.itineraryId}`,
  );
  return data;
};
