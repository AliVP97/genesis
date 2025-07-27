export const CALENDAR_TYPES = {
  JALALI: 0,
  GREGORIAN: 1,
} as const;

export type CalendarType = (typeof CALENDAR_TYPES)[keyof typeof CALENDAR_TYPES];

export type YearMonth = {
  month: number;
  year: number;
  monthOffset: number;
};

export const FLIGHT_TYPES = {
  ONE_WAY: 'oneWay',
  ROUND_TRIP: 'roundTrip',
} as const;

export type FlightType = (typeof FLIGHT_TYPES)[keyof typeof FLIGHT_TYPES];
