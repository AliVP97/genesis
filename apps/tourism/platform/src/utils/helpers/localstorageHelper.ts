import jmoment from 'moment-jalaali';
import { ParsedUrlQuery } from 'querystring';

import { TSearchObject as TBusSearchObject } from 'module/bus/search/types';
import { SearchHistory } from 'module/flights/tickets/ticket/searchTicket/interface';
import { HotelPassengers } from 'module/hotel/ticketsSearchBox/interface';
import { Passengers } from 'module/train/tickets/interface';
import { TInternationalFlightCabinType } from 'services/internationalFlight/airports/interface';
import { CompartmentGenderType } from 'services/train/orders/interface';
import { TTrainStationType } from 'services/train/types';
import { iataToFarsi as flightIataToFarsi } from 'utils/static/flightStatics';
import { iataToFarsi as intFlightIataToFarsi } from 'utils/static/internationalFlight';

export const updateLastSearchStorage = (current: SearchHistory) => {
  let searches: SearchHistory[] = [];
  const prevSearches: SearchHistory[] | [] = JSON.parse(
    localStorage.getItem('last_search') as string,
  );
  if (prevSearches?.length) {
    searches.push(...prevSearches);
  }

  const latest = searches[0];

  !(
    current.origin?.value === latest?.origin?.value &&
    current.destination?.value === latest?.destination?.value &&
    current.departureDate === latest?.departureDate &&
    current.returningDate === latest?.returningDate &&
    current.passenger?.adult === latest?.passenger?.adult &&
    current.passenger?.child === latest?.passenger?.child &&
    current.passenger?.infant === latest?.passenger?.infant
  ) && searches.unshift(current);

  searches = [...searches.slice(0, 5)];

  localStorage.setItem('last_search', JSON.stringify(searches));
};

export interface ITrainSearchHistory {
  origin?: TTrainStationType;
  destination?: TTrainStationType;
  passenger: Passengers;
  departureDate: string;
  returningDate: string | undefined;
  wantCompartment: boolean;
  genderCompartment: CompartmentGenderType;
}

export type TTrainLocalStorage = {
  origin: TTrainStationType;
  destination: TTrainStationType;
  passenger: Passengers;
  departureDate: string;
  returningDate: string | undefined;
  wantCompartment: boolean;
  genderCompartment: CompartmentGenderType;
  calendarSystem?: string;
};

export const trainUpdateLastSearchStorage = (current: TTrainLocalStorage) => {
  let searches: ITrainSearchHistory[] = [];
  const prevSearches: ITrainSearchHistory[] | [] = JSON.parse(
    localStorage.getItem('train_last_search') as string,
  );
  if (prevSearches?.length) {
    searches.push(...prevSearches);
  }

  const latest = searches[0];
  !(
    current.origin?.code === latest?.origin?.code &&
    current.destination?.code === latest?.destination?.code &&
    current.departureDate === latest?.departureDate &&
    current.returningDate === latest?.returningDate &&
    current.genderCompartment === latest?.genderCompartment &&
    current.wantCompartment === latest?.wantCompartment
  ) && searches.unshift(current);

  searches = [...searches.slice(0, 5)];

  localStorage.setItem('train_last_search', JSON.stringify(searches));
};

export type TBusLocalStorage = TBusSearchObject & {
  calendarSystem: 'JALALI' | 'GREGORIAN';
};

export const busUpdateLastSearchStorage = (current: TBusLocalStorage) => {
  let searches: TBusSearchObject[] = [];
  const prevSearches: TBusSearchObject[] | [] = JSON.parse(
    localStorage.getItem('bus_last_search') as string,
  );
  if (prevSearches?.length) {
    searches.push(...prevSearches);
  }
  const latest = searches[0];
  !(
    current.origin.stationCode === latest?.origin?.stationCode &&
    current.destination.stationCode === latest?.destination?.stationCode &&
    current.departureDate === latest?.departureDate
  ) && searches.unshift(current);

  searches = [...searches.slice(0, 5)];

  localStorage.setItem('bus_last_search', JSON.stringify(searches));
};

export type TInternationalFlightSearch = {
  origin: {
    value: string;
    city: string;
    airport: string;
    type?: { id: string; title: string };
    data?: { [key: string]: string };
  };
  destination: {
    value: string;
    city: string;
    airport: string;
    type?: { id: string; title: string };
    data?: { [key: string]: string };
  };
  passenger: Passengers;
  departureDate: string;
  returningDate: string | undefined;
  cabinType: TInternationalFlightCabinType;
  calendarSystem?: string;
  sort?: string;
};

export const internationalFlightUpdateLastSearchStorage = (current: TInternationalFlightSearch) => {
  let searches: TInternationalFlightSearch[] = [];
  const prevSearches: TInternationalFlightSearch[] | [] = JSON.parse(
    localStorage.getItem('international_flight_last_search') as string,
  );
  if (prevSearches?.length) {
    searches.push(...prevSearches);
  }

  const latest = searches[0];
  !(
    current?.origin?.value === latest?.origin?.value &&
    current?.destination?.value === latest?.destination?.value &&
    current?.departureDate === latest?.departureDate &&
    current?.returningDate === latest?.returningDate &&
    current?.passenger?.adult === latest?.passenger?.adult &&
    current?.passenger?.child === latest?.passenger?.child &&
    current?.passenger?.infant === latest?.passenger?.infant &&
    current?.cabinType === latest?.cabinType &&
    /**
     * origin or designation type is not same as previous one which means
     * ALL_AIRPORTS or AIRPORT.
     */
    current?.origin.type?.id === latest?.origin.type?.id &&
    current?.destination.type?.id === latest?.destination.type?.id
  ) && searches.unshift(current);

  searches = [...searches.slice(0, 5)];

  localStorage.setItem('international_flight_last_search', JSON.stringify(searches));
};

export type THotelSearch = {
  origin: {
    value: string;
    city: string;
    airport: string;
    type?: {
      id?: string;
      title?: string;
    };
    data?: { [key: string]: string };
    cityEng?: string;
  };
  passenger: Array<HotelPassengers>;
  departureDate: string;
  returningDate: string | undefined;
  calendarSystem?: string;
};

export const hotelUpdateLastSearchStorage = (value: THotelSearch) => {
  let searches: THotelSearch[] = [];
  const prevSearches: THotelSearch[] | [] = JSON.parse(
    localStorage.getItem('hotel_last_search') as string,
  );
  if (prevSearches?.length) {
    searches.push(...prevSearches);
  }

  searches.unshift(value);

  searches = [...searches.slice(0, 5)];

  localStorage.setItem('hotel_last_search', JSON.stringify(searches));
};

export const domesticFlightQueryToLastSearch: (i: ParsedUrlQuery) => SearchHistory = (query) => {
  const iatas = (query.id as string)?.split('-');
  const originIata = iatas[0];
  const destinationIata = iatas[1];
  return {
    origin: {
      value: originIata,
      city: flightIataToFarsi[originIata],
      airport: '',
    },
    destination: {
      value: destinationIata,
      city: flightIataToFarsi[destinationIata],
      airport: '',
    },
    departureDate: jmoment(query.departureDate as string, 'jYYYY-jMM-jDD').format('YYYY-MM-DD'),
    returningDate:
      query.returningDate &&
      jmoment(query.returningDate as string, 'jYYYY-jMM-jDD').format('YYYY-MM-DD'),
    passenger: {
      adult: 1,
      child: 0,
      infant: 0,
    },
    calendarSystem: 'JALALI',
  };
};

export const intFlightQueryToLastSearch: (i: ParsedUrlQuery) => TInternationalFlightSearch = (
  query,
) => {
  const iatas = (query.id as string)?.split('-');
  const originIata = iatas[0];
  const destinationIata = iatas[1];
  return {
    origin: {
      value: originIata,
      city: intFlightIataToFarsi[originIata],
      type: {
        id: 'AIRPORT', // WARNING
        title: originIata,
      },
      /* data: {
        cityTitle: 'تهران',
      }, */
      airport: '',
    },
    destination: {
      value: destinationIata,
      city: intFlightIataToFarsi[destinationIata],
      type: {
        id: 'AIRPORT', // WARNING
        title: destinationIata,
      },
      /* data: {
        cityTitle: 'استانبول',
      }, */
      airport: '',
    },
    passenger: {
      adult: 1,
      child: 0,
      infant: 0,
    },
    departureDate: jmoment(query.departureDate as string, 'jYYYY-jMM-jDD').format('YYYY-MM-DD'),
    returningDate:
      query.returningDate &&
      jmoment(query.returningDate as string, 'jYYYY-jMM-jDD').format('YYYY-MM-DD'),
    cabinType: 'CABIN_TYPE_ECONOMY',
    calendarSystem: 'JALALI',
  };
};
