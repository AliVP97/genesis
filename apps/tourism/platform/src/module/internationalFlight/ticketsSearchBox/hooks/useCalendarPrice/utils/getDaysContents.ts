import { TDaysContents } from 'containers/datepicker/datepicker/types';
import dayjs from 'dayjs';
import { CalendarPriceResponse } from 'module/internationalFlight/ticketsSearchBox/types/api';
import {
  CalendarType,
  CALENDAR_TYPES,
} from 'module/internationalFlight/ticketsSearchBox/types/common';
import getSecondaryData from './getSecondaryData';

/**
 * Generates the contents of the calendar days based on the provided calendar data and type.
 *
 * @param data - The calendar price response data.
 * @param calendarType - The type of calendar to use (Gregorian or Jalali).
 * @param enabled - Whether the calendar is enabled.
 * @returns The contents of the calendar days.
 */
const getDaysContents = (
  data: CalendarPriceResponse['calendarData'],
  calendarType: CalendarType,
  enabled: boolean,
): TDaysContents => {
  if (!enabled || !data) {
    return {};
  }

  return data.reduce((acc, curr) => {
    const { gregorianDepartureDate, minimumPrice } = curr;
    const day =
      calendarType === CALENDAR_TYPES.JALALI
        ? dayjs(gregorianDepartureDate).calendar('jalali')
        : dayjs(gregorianDepartureDate, { jalali: true }).calendar('jalali');
    const dayString = day.format('YYYYMMDD');
    const secondary = minimumPrice ?? '';
    const secondaryData = getSecondaryData(secondary);

    return {
      ...acc,
      [dayString]: {
        secondaryData,
      },
    };
  }, {} as TDaysContents);
};

export default getDaysContents;
