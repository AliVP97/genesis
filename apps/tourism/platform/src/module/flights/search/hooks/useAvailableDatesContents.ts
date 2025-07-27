import { GetDomesticTicketResponse, TDaysPrices } from 'services/domestic/flight/interface';
import { TDaysContents } from 'containers/datepicker/datepicker/types';

const pathMap: Record<'departure' | 'returning', 0 | 1> = {
  departure: 0,
  returning: 1,
};

const toDaysContents = (days: TDaysPrices | undefined): TDaysContents => {
  const contents: TDaysContents = {};
  days?.forEach((day) => {
    const key = day.persianDepartureDate
      ?.substring(0, 10)
      .split('')
      .filter((date) => date !== '-')
      .join('');
    if (key) {
      contents[key] = { secondary: day.minimumPrice };
    }
  });
  return contents;
};

export const useAvailableDatesContents = (
  ticketsData: GetDomesticTicketResponse | undefined,
  direction: 'returning' | 'departure',
) => {
  return toDaysContents(ticketsData?.flightQueryResult?.[pathMap[direction]]?.calendarData);
};
