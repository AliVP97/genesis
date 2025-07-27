import { useEffect, useState } from 'react';
import { ParsedUrlQuery } from 'querystring';
import { getTimeStampFromDashedJalali } from 'utils/helpers/global';
import { useRouter } from 'next/router';
import {
  TRangeDatePickerDate,
  TRangeDatePickerRange,
  TRangeDatePickerCalendarSystem,
} from 'components/rangeDatePicker/types';
import queryString from 'query-string';
import dayjs from 'dayjs';

const toJalali = (date: TRangeDatePickerDate) =>
  dayjs(date, { locale: 'fa' }).calendar('jalali').format('YYYY-MM-DD');

export const useRangeDatePicker = () => {
  const { query, push } = useRouter();

  const getDateRange = (query: ParsedUrlQuery) => ({
    from: getTimeStampFromDashedJalali(query.departureDate as string),
    to: getTimeStampFromDashedJalali(query.returningDate as string),
  });

  const handleSubmit = (range: TRangeDatePickerRange) => {
    void push({
      pathname: window.location.pathname.replace('/tourism', ''),
      query: queryString.stringify({
        ...query,
        ...{
          departureDate: toJalali(range.from),
          returningDate: toJalali(range.to),
        },
      }),
    });
  };

  const [calendarSystem, setCalendarSystem] = useState<TRangeDatePickerCalendarSystem>('jalali');
  useEffect(() => {
    setCalendarSystem(
      localStorage.getItem('searchCalendarSystem') as TRangeDatePickerCalendarSystem,
    );
  }, []);

  const [title, setTitle] = useState<string | null>('');
  useEffect(() => {
    const lastSearches = JSON.parse(
      localStorage.getItem('international_flight_last_search') || '[]',
    );
    const lastSearch = lastSearches[lastSearches.length - 1];
    const title =
      (lastSearch?.origin?.city ? lastSearch?.origin?.city + ' - ' : '') +
      (lastSearch?.destination?.city || '');
    setTitle(title);
  }, []);

  return { getDateRange, handleSubmit, calendarSystem, setCalendarSystem, title };
};
