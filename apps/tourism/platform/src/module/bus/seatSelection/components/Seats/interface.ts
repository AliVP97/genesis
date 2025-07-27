import { TBusSeatAvailability } from 'services/bus/seats/interface';

export const PersianBusSeatAvailability: Record<TBusSeatAvailability, string> = {
  UNDEFINED: 'نا مشخض',
  SEAT_AVAILABLE: 'قابل رزرو',
  SEAT_UNAVAILABLE_MAN: 'آقا',
  SEAT_UNAVAILABLE_WOMAN: 'خانم',
  SEAT_UNAVAILABLE_EMPTY: 'آقا',
};
