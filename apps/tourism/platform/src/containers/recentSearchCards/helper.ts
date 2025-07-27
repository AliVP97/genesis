import dayjs from 'dayjs';
import { isEqual } from 'lodash';
import jmoment from 'moment-jalaali';

import { SearchHistory as TDomesticFlightSearchHistory } from 'module/flights/tickets/ticket/searchTicket/interface';
import {
  TBusLocalStorage,
  THotelSearch,
  TInternationalFlightSearch as TInternationalFlightSearchHistory,
  TTrainLocalStorage,
} from 'utils/helpers/localstorageHelper';
import { TAdditionalData } from 'module/bus/search/types';
import { trainSearchQuery } from 'module/train/search/helper';
import { TTrainSearchQuery } from 'module/train/search/utils';
import { TTrainAdditionalData } from 'module/train/tickets/interface';
import { TRecentSearchCardData, TRecentSearchCardsData } from './types';

export const sortLocalStorage = (serviceName: string, index: number) => {
  const key = {
    flights: 'last_search',
    international: 'international_flight_last_search',
    train: 'train_last_search',
    bus: 'bus_last_search',
    hotel: 'hotel_last_search',
  }[serviceName];

  if (key) {
    const localStorageData = localStorage.getItem(key);
    const search = localStorageData && JSON.parse(localStorageData);

    if (search) {
      localStorage.setItem(key, JSON.stringify([search[index], ...search.toSpliced(index, 1)]));
    }
  }
};

export const getDomesticFlightCardsData: () => TRecentSearchCardsData = () => {
  if (typeof window === 'undefined') {
    return [];
  }

  // refactor: get local storage data from props.
  const data: TDomesticFlightSearchHistory[] = JSON.parse(
    localStorage?.getItem('last_search') || '[]',
  );

  return data.map((item, index) => ({
    index: index,
    calendarSystem: item.calendarSystem,
    origin: {
      id: item.origin?.value,
      title: item.origin?.city,
    },
    destination: {
      id: item.destination?.value,
      title: item.destination?.city,
    },
    departureDate: new Date(item.departureDate).getTime(),
    returnDate: item.returningDate ? new Date(item.returningDate).getTime() : undefined,
  }));
};

export const getInternationalFlightCardsData = () => {
  const data: TInternationalFlightSearchHistory[] = JSON.parse(
    localStorage.getItem('international_flight_last_search') || '[]',
  );

  return data.map((item, index) => ({
    index: index,
    calendarSystem: item.calendarSystem,
    origin: {
      id: item.origin?.value,
      title: item.origin?.data?.cityTitle,
    },
    destination: {
      id: item.destination?.value,
      title: item.destination?.data?.cityTitle,
    },
    departureDate: new Date(item.departureDate).getTime(),
    returnDate: item.returningDate ? new Date(item.returningDate).getTime() : undefined,
  }));
};

export const getTrainCardsData = (): TRecentSearchCardData<TTrainAdditionalData>[] => {
  const data: TTrainLocalStorage[] = JSON.parse(localStorage.getItem('train_last_search') || '[]');

  return data.map((item, index) => ({
    index: index,
    calendarSystem: item.calendarSystem,
    origin: {
      id: item.origin?.code,
      title: item.origin?.farsiName,
      data: { englishName: item.origin?.englishName as string },
    },
    destination: {
      id: item.destination?.code,
      title: item.destination?.farsiName,
      data: { englishName: item.destination?.englishName as string },
    },
    departureDate: Number(jmoment(item.departureDate, 'YYYY-MM-DD')),
    returnDate: item.returningDate ? Number(jmoment(item.returningDate, 'YYYY-MM-DD')) : undefined,
  }));
};

export const getBusCardsData = (): TRecentSearchCardData<TAdditionalData>[] => {
  const data: TBusLocalStorage[] = JSON.parse(localStorage.getItem('bus_last_search') || '[]');

  return data.map((item, index) => ({
    index: index,
    calendarSystem: item.calendarSystem,
    origin: {
      id: item.origin?.stationCode,
      title: item.origin?.cityName,
      data: { seoCode: item.origin?.seoCode },
    },
    destination: {
      id: item.destination?.stationCode,
      title: item.destination?.cityName,
      data: { seoCode: item.destination?.seoCode },
    },
    departureDate: new Date(item.departureDate).getTime(),
    returnDate: undefined,
  }));
};

export const getDomesticHotelCardsData = () => {
  const data: THotelSearch[] = JSON.parse(localStorage.getItem('hotel_last_search') || '[]');

  return data.map((item, index) => ({
    index: index,
    calendarSystem: item.calendarSystem,
    origin: undefined,
    destination: {
      id: item.origin?.value,
      title: item.origin?.city,
    },
    departureDate: new Date(item.departureDate).getTime(),
    returnDate: item.returningDate ? new Date(item.returningDate).getTime() : undefined,
  }));
};

export const getDomesticFlightQueryObject = (index: number) => {
  const localStorageData = localStorage.getItem('last_search');

  const search: TDomesticFlightSearchHistory | null =
    localStorageData && JSON.parse(localStorageData)?.[index];

  // local storage to query
  return search
    ? {
        adult: search?.passenger.adult,
        child: search?.passenger.child,
        infant: search?.passenger.infant,
        departureDate: dayjs(search?.departureDate).calendar('jalali').format('YYYY-MM-DD'),
        returningDate:
          search?.returningDate &&
          dayjs(search?.returningDate).calendar('jalali').format('YYYY-MM-DD'),
        sort: 'lowPrice',
      }
    : null;
};

export const getInternationalFlightQueryObject = (index: number) => {
  const localStorageData = localStorage.getItem('international_flight_last_search');

  const search: TInternationalFlightSearchHistory | null =
    localStorageData && JSON.parse(localStorageData)?.[index];

  // local storage to query
  return search
    ? {
        adult: search?.passenger.adult,
        child: search?.passenger.child,
        infant: search?.passenger.infant,
        departureDate: dayjs(search?.departureDate).calendar('jalali').format('YYYY-MM-DD'),
        returningDate:
          search?.returningDate &&
          dayjs(search?.returningDate).calendar('jalali').format('YYYY-MM-DD'),
        sort: 'fast',
        cabinType: search?.cabinType,
        tripMode: search?.returningDate ? '2' : '1',
        originType: search?.origin.type?.id === 'AIRPORT' ? 0 : 1,
        destinationType: search?.destination.type?.id === 'AIRPORT' ? 0 : 1,
      }
    : null;
};

export const getTrainQueryObject = (index: number): TTrainSearchQuery | null => {
  const localStorageData = localStorage.getItem('train_last_search');

  const search: TTrainLocalStorage | null =
    localStorageData && JSON.parse(localStorageData)?.[index];

  // local storage to query
  return search
    ? trainSearchQuery.parse({
        departureDate: jmoment(search?.departureDate, 'YYYY-MM-DD').format('jYYYY-jMM-jDD'),
        returningDate: jmoment(search?.returningDate, 'YYYY-MM-DD').format('jYYYY-jMM-jDD'),
        gender: search?.genderCompartment,
        adult: search?.passenger.adult,
        child: search?.passenger.child,
        infant: search?.passenger.infant,
        wantCompartment: search?.wantCompartment,
        sort: 'lowPrice',
      })
    : null;
};

export const getBusQueryObject = (index: number) => {
  const localStorageData = localStorage.getItem('bus_last_search');

  const search: TBusLocalStorage | null = localStorageData && JSON.parse(localStorageData)?.[index];

  // local storage to query
  return search
    ? {
        departureDate: dayjs(search?.departureDate).calendar('jalali').format('YYYY-MM-DD'),
        returningDate: undefined,
        sort: 'earliestTime',
      }
    : null;
};

type TDomesticHotelQueryObject = {
  id: string;
  checkInDate: string;
  requestId: string;
  checkOutDate: string | undefined;
  rooms: string;
  destinationType: string;
  sort: string;
  cityId: string | undefined;
  cityName: string | undefined;
  readCache?: string;
};
export const getDomesticHotelQueryObject = (index: number): TDomesticHotelQueryObject | null => {
  const localStorageData = localStorage.getItem('hotel_last_search');

  const search: THotelSearch | null = localStorageData && JSON.parse(localStorageData)?.[index];

  let selectedRooms = '';
  search?.passenger.forEach((item) => {
    selectedRooms =
      selectedRooms +
      (selectedRooms ? '-' : '') +
      Array.from({ length: item.adult }, () => 'A').toString();
    if (item?.child.length > 0)
      selectedRooms = selectedRooms + '___' + item?.child?.map((x) => x.value).toString();
    return selectedRooms;
  });

  return search
    ? {
        id: search?.origin.value,
        checkInDate: dayjs(search?.departureDate).calendar('jalali').format('YYYY-MM-DD'),
        checkOutDate:
          search?.returningDate &&
          dayjs(search?.returningDate).calendar('jalali').format('YYYY-MM-DD'),
        rooms: selectedRooms,
        destinationType: search?.origin?.type?.id || '',
        sort: 'offer',
        cityId: search?.origin?.data?.cityId,
        cityName: search?.origin.city,
        requestId: search?.origin.value,
      }
    : null;
};

export const isRepeated = (current: TRecentSearchCardData, cards: TRecentSearchCardData[]) =>
  cards.find(
    (card, index) =>
      current.index < index &&
      isEqual({ ...current, index: undefined }, { ...card, index: undefined }),
  );
