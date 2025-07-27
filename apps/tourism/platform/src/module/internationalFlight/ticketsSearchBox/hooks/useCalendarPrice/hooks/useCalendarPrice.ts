import { useState, useMemo, useCallback } from 'react';
import { useAppSelector } from 'store/hook/storeHook';
import {
  selectMobileSearchCalendarDate,
  selectSearchCalendarSystem,
} from 'store/slices/app/selectors/calendars';
import useGetCalendar from './useGetCalendar';
import { YearMonth } from '../../../types/common';
import { locationState } from 'components/originDestination/interface';
import getStartAndEndDate from '../utils/getStartAndEndDate';
import getDaysContents from '../utils/getDaysContents';
import { calendarSystemToCalendarType } from '../utils/mapper';
import useDeviceDetect from 'utils/hooks/useDeviceDetect';
import { TDaysContents } from 'containers/datepicker/datepicker/types';

type UseCalendarPrice = (
  location: locationState,
  enabled: boolean,
) => {
  handleMonthChange: (yearMonth: Omit<YearMonth, 'monthOffset'>) => void;
  daysContents: TDaysContents;
};

/**
 * @description
 * this hook is used to get the days contents to be rendered in the calendar
 * @param location the location which is considered origin and destination
 * @param enabled the state to know when this hook should be enabled
 * @returns the days contents to be rendered and a function to handle the change from calendar
 */
const useCalendarPrice: UseCalendarPrice = (location, enabled) => {
  const [desktopYearMonth, setDesktopYearMonth] = useState<YearMonth>();
  const mobileYearMonth = useAppSelector(selectMobileSearchCalendarDate);
  const calendarSystem = useAppSelector(selectSearchCalendarSystem);
  const calendarType = calendarSystemToCalendarType(calendarSystem);
  const { isMobile } = useDeviceDetect();
  const yearMonth = isMobile ? mobileYearMonth : desktopYearMonth;
  const origin = location.origin?.value;
  const destination = location.destination?.value;

  const { startDate, endDate } = useMemo(
    () => getStartAndEndDate(yearMonth, calendarType, enabled),
    [calendarType, yearMonth, enabled],
  );

  const { data } = useGetCalendar(origin, destination, startDate, endDate, calendarType, enabled);

  const daysContents = useMemo(
    () => getDaysContents(data?.calendarData, calendarType, enabled),
    [data?.calendarData, calendarType, enabled],
  );

  const handleMonthChange = useCallback(
    ({ month, year }: Omit<YearMonth, 'monthOffset'>) => {
      if (enabled) {
        setDesktopYearMonth({ month: month + 1, year, monthOffset: 2 });
      }
    },
    [enabled],
  );

  return {
    daysContents,
    handleMonthChange,
  };
};

export default useCalendarPrice;
