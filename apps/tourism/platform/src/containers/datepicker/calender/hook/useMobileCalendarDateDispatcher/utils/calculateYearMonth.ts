import { CalendarSystem, CALENDAR_SYSTEMS } from 'containers/datepicker/types/common';
import dayjs from 'dayjs';
import { YearMonth } from 'module/internationalFlight/ticketsSearchBox/types/common';

/**
 * This function is used to calculate the year and month of the elements to calculate the year and month.
 * @param indexes   the indexes of the elements to calculate the year and month
 * @param calendarSystem  the calendar system to use to calculate the year and month  `jalaili` or `gregory`
 * @returns the year and month of the elements
 */
const calculateYearMonth = (indexes: number[], calendarSystem: CalendarSystem): YearMonth => {
  const monthOffset = indexes.length;
  const minIndex = Math.min(...indexes);
  const [year, month] = dayjs(undefined, {
    jalali: calendarSystem === CALENDAR_SYSTEMS.JALALI,
  })
    .add(minIndex, 'month')
    .calendar(calendarSystem === CALENDAR_SYSTEMS.JALALI ? 'jalali' : 'gregory')
    .format('YYYY-MM')
    .split('-')
    .map(Number);

  return { year, month, monthOffset };
};

export default calculateYearMonth;
