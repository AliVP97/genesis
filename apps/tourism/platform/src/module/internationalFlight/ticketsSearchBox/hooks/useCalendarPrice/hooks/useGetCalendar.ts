import request from 'services/axios';
import API from 'utils/routes/api';
import { useQuery } from 'react-query';
import { CalendarType } from '../../../types/common';
import { CalendarPriceResponse } from '../../../types/api';

const getCalendar = async (
  origin: string | undefined,
  destination: string | undefined,
  startDate: number | undefined,
  endDate: number | undefined,
  type: CalendarType,
) => {
  const { data } = await request.get<CalendarPriceResponse>(API.INTERNATIONALFLIGHT.CALENDAR, {
    params: {
      departureIata: origin,
      arrivalIata: destination,
      startDate,
      endDate,
      calendarType: type,
    },
  });

  return data;
};

const useGetCalendar = (
  origin: string | undefined,
  destination: string | undefined,
  startDate: number | undefined,
  endDate: number | undefined,
  calendarType: CalendarType,
  enabled: boolean,
) =>
  useQuery(
    ['internationalFlightCalendar', origin, destination, startDate, endDate],
    () => getCalendar(origin, destination, startDate, endDate, calendarType),
    {
      enabled: !!origin && !!destination && !!startDate && !!endDate && enabled,
    },
  );

export default useGetCalendar;
