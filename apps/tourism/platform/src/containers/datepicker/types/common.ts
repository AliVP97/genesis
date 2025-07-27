export const CALENDAR_SYSTEMS = {
  JALALI: 'jalali',
  GREGORIAN: 'gregorian',
} as const;

export type CalendarSystem = (typeof CALENDAR_SYSTEMS)[keyof typeof CALENDAR_SYSTEMS];
