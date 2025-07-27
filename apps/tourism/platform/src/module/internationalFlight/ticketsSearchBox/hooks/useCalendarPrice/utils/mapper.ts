import { CALENDAR_SYSTEMS, CalendarSystem } from 'containers/datepicker/types/common';
import {
  CalendarType,
  CALENDAR_TYPES,
} from 'module/internationalFlight/ticketsSearchBox/types/common';

export const calendarSystemToCalendarType = (calendarSystem: CalendarSystem): CalendarType =>
  calendarSystem === CALENDAR_SYSTEMS.JALALI ? CALENDAR_TYPES.JALALI : CALENDAR_TYPES.GREGORIAN;
