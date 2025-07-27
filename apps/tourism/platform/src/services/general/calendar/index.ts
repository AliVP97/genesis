import request from 'services/axios';
import { TCalendarOccasionsResponse } from 'containers/datepicker/datepicker/types';
import API from 'utils/routes/api';

export const getCalendarOccasions = async () => {
  const { data }: { data: TCalendarOccasionsResponse } = await request.get(API.GET_CALENDAR_EVENTS);
  return data;
};
