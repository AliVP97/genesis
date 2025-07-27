import { toCalendarOccasions } from 'containers/datepicker/datepicker/helper';
import { TCalendarOccasions } from 'containers/datepicker/datepicker/types';
import { useState, useEffect } from 'react';
import { useQuery } from 'react-query';
import { getCalendarOccasions } from 'services/general/calendar';

export const useCalendarOccasions = () => {
  const [calendarOccasions, setCalendarOccasions] = useState<TCalendarOccasions>({});

  const { data: calendarOccasionsResponse } = useQuery(
    ['calendarOccasionsResponse'],
    getCalendarOccasions,
    {
      staleTime: Infinity,
    },
  );

  useEffect(() => {
    setCalendarOccasions(toCalendarOccasions(calendarOccasionsResponse));
  }, [calendarOccasionsResponse]);

  return calendarOccasions;
};
