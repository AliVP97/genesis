import { useEffect, useState } from 'react';

import jmoment from 'moment-jalaali';
import { useRouter } from 'next/router';

import { DateState } from 'containers/datepicker/selectDate';
import { useCalendarOccasions } from 'utils/hooks/useCalendarOccasions';
import { useLastSearchCalendarSystem } from 'utils/hooks/useLastSearchCalendarSystem';

export const useCalendar = () => {
  const { query } = useRouter();

  const [date, setDate] = useState<DateState>({
    from: null,
    to: null,
  });

  const { calendarSystem, handleCalendarSystemChange } =
    useLastSearchCalendarSystem('bus_last_search');

  const calendarOccasions = useCalendarOccasions();

  useEffect(() => {
    query.departureDate &&
      setDate({
        from: Number(jmoment(query.departureDate as string, 'jYYYY-jMM-jDD')),
        to: null,
      });
  }, [query.departureDate]);

  return {
    date,
    setDate,
    calendarSystem,
    handleCalendarSystemChange,
    calendarOccasions,
  };
};
