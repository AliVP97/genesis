import { IPassengersType } from '../list/interface';

export const getTotalDomesticFlightTicketPassenger = (): Array<IPassengersType> => {
  const searchQuery = JSON.parse(localStorage.getItem('search-query') as string);
  const passengers: Array<IPassengersType> = [];
  if (searchQuery?.adult > 0) {
    Array.from(Array(Number(searchQuery?.adult)).keys()).forEach(() =>
      passengers.push({
        type: 'adult',
        number: 1,
        id: Date.now().toString(36),
      }),
    );
  }
  if (searchQuery?.child > 0) {
    Array.from(Array(Number(searchQuery?.child)).keys()).forEach(() =>
      passengers.push({
        type: 'child',
        number: searchQuery?.child,
        id: Date.now().toString(36),
      }),
    );
  }
  if (searchQuery?.infant > 0) {
    Array.from(Array(Number(searchQuery?.infant)).keys()).forEach(() =>
      passengers.push({
        type: 'infant',
        number: 1,
        id: Date.now().toString(36),
      }),
    );
  }
  return passengers;
};
