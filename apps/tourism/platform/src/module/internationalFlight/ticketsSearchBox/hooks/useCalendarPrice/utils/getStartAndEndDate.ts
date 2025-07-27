import dayjs, { Dayjs } from 'dayjs';
import {
  YearMonth,
  CalendarType,
  CALENDAR_TYPES,
} from 'module/internationalFlight/ticketsSearchBox/types/common';

const yearMonthToDayjs = (yearMonth: YearMonth, calendarType: CalendarType) =>
  dayjs(yearMonth.year + '-' + yearMonth.month, {
    jalali: calendarType === CALENDAR_TYPES.JALALI,
  }).calendar('jalali');

const dayjsToSeconds = (dayjs: Dayjs) => Math.floor(dayjs.unix());

const getStartAndEndDate = (
  yearMonth: YearMonth | undefined | null,
  calendarType: CalendarType,
  enabled: boolean,
) => {
  if (!enabled) {
    return { startDate: undefined, endDate: undefined };
  }

  let start: Dayjs;

  if (!yearMonth) {
    start = dayjs().calendar('jalali');
  } else {
    start = yearMonthToDayjs(yearMonth, calendarType);
  }

  if (start.unix() <= 0) {
    return { startDate: undefined, endDate: undefined };
  }

  const end = start.add(yearMonth?.monthOffset ?? 2, 'month');

  return { startDate: dayjsToSeconds(start), endDate: dayjsToSeconds(end) };
};

export default getStartAndEndDate;
