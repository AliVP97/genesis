export type TSearchBarData = {
  departure: {
    title?: string;
    date?: string;
  };
  return: {
    title?: string;
    date?: string;
  };
  passengersNumber?: number;
  calendarSystem?: 'JALALI' | 'GREGORIAN' | string;
};
