import { CALENDAR_SYSTEMS } from 'containers/datepicker/types/common';
import { calendarSystemToCalendarType } from './mapper';
import { CALENDAR_TYPES } from 'module/internationalFlight/ticketsSearchBox/types/common';

describe('calendarSystemToCalendarType', () => {
  it('should return CALENDAR_TYPES.JALALI when CALENDAR_SYSTEMS.JALALI is passed', () => {
    const result = calendarSystemToCalendarType(CALENDAR_SYSTEMS.JALALI);
    expect(result).toEqual(CALENDAR_TYPES.JALALI);
  });

  it('should return CALENDAR_TYPES.GREGORIAN when CALENDAR_SYSTEMS.GREGORIAN is passed', () => {
    const result = calendarSystemToCalendarType(CALENDAR_SYSTEMS.GREGORIAN);
    expect(result).toEqual(CALENDAR_TYPES.GREGORIAN);
  });
});
