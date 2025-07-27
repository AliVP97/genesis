import jmoment from 'moment-jalaali';

import { SearchHistory as TDomesticFlightSearchHistory } from 'module/flights/tickets/ticket/searchTicket/interface';
import {
  TBusLocalStorage,
  THotelSearch as TDomesticHotelSearchHistory,
  TInternationalFlightSearch as TInternationalFlightSearchHistory,
  TTrainLocalStorage,
} from 'utils/helpers/localstorageHelper';
import { getServiceName } from 'utils/helpers/serviceDetector';
import {
  BusMainIcon,
  DomesticFlightIcon,
  GlobalFlightIcon,
  LocalHotelIcon,
  TrainMainIcon,
} from 'assets/icons';
import { queryToState as busQueryToState } from 'module/bus/search/utils';
import { TQueryObject } from 'module/bus/search/types';
import { trainSearchUrlSchema, TTrainUrlQuery } from 'module/train/search/utils';
import { queryToState as trainQueryToState } from 'module/train/utils';

const getDomesticFlightData = () => {
  const data: TDomesticFlightSearchHistory | undefined = JSON.parse(
    localStorage.getItem('last_search') || '[]',
  )[0];

  return {
    departure: {
      title: data?.origin?.city,
      date: data?.departureDate,
    },
    return: {
      title: data?.destination?.city,
      date: data?.returningDate,
    },
    passengersNumber:
      (data?.passenger?.adult || 0) +
      (data?.passenger?.child || 0) +
      (data?.passenger?.infant || 0),
    calendarSystem: data?.calendarSystem,
  };
};

const getInternationalFlightData = () => {
  const data: TInternationalFlightSearchHistory | undefined = JSON.parse(
    localStorage.getItem('international_flight_last_search') || '[]',
  )[0];

  return {
    departure: {
      title: data?.origin?.city,
      date: data?.departureDate,
    },
    return: {
      title: data?.destination?.city,
      date: data?.returningDate,
    },
    passengersNumber:
      (data?.passenger?.adult || 0) +
      (data?.passenger?.child || 0) +
      (data?.passenger?.infant || 0),
    calendarSystem: data?.calendarSystem,
  };
};

const getTrainData = async () => {
  const id = window.location.pathname.split('/')[3];

  if (id) {
    const data: TTrainLocalStorage | undefined = JSON.parse(
      localStorage.getItem('train_last_search') || '[]',
    )[0];

    const query: TTrainUrlQuery = trainSearchUrlSchema.parse({
      id,
      ...window.location.search
        .slice(1)
        .split('&')
        .map((p) => p.split('='))
        .reduce((obj, [key, value]) => ({ ...obj, [key]: value }), {}),
    });

    const { origin, destination, departureDate, returningDate, adult, child, infant } =
      await trainQueryToState(query);

    return {
      departure: {
        title: origin?.farsiName,
        date: jmoment(departureDate, 'jYYYY-jMM-jDD').format('YYYY-MM-DD'),
      },
      return: {
        title: destination?.farsiName,
        date: returningDate
          ? jmoment(returningDate, 'jYYYY-jMM-jDD').format('YYYY-MM-DD')
          : undefined,
      },
      passengersNumber: adult + child + infant,
      calendarSystem: data?.calendarSystem,
    };
  }
};

const getBusData = async () => {
  const id = window.location.pathname.split('/')[3];

  if (id) {
    const data: TBusLocalStorage | undefined = JSON.parse(
      localStorage.getItem('bus_last_search') || '[]',
    )[0];

    const query: TQueryObject = {
      id,
      departureDate: new URLSearchParams(window.location.search).get('departureDate') || '',
    };

    const { origin, destination, departureDate } = await busQueryToState(query);

    return {
      departure: {
        title: origin?.stationName || origin?.cityName,
        date: jmoment(departureDate, 'jYYYY-jMM-jDD').format('YYYY-MM-DD'),
      },
      return: {
        title: destination?.stationName || destination?.cityName,
      },
      calendarSystem: data?.calendarSystem || 'JALALI',
    };
  }
};

const getDomesticHotelData = () => {
  const data: TDomesticHotelSearchHistory | undefined = JSON.parse(
    localStorage.getItem('hotel_last_search') || '[]',
  )[0];

  return {
    departure: {
      title: data?.origin?.city,
      date: data?.departureDate,
    },
    return: {
      title: data?.origin?.city,
      date: data?.returningDate,
    },
    passengersNumber: data?.passenger.reduce(
      (accu, room) => accu + room.adult + room.child.length,
      0,
    ),
    calendarSystem: data?.calendarSystem,
  };
};

export const getSearchBarData = async (path: string) => {
  const getData = {
    flights: getDomesticFlightData,
    international: getInternationalFlightData,
    train: getTrainData,
    bus: getBusData,
    hotel: getDomesticHotelData,
  }[getServiceName(path)];

  const result = await getData?.();

  return result;
};

export const shouldRender = (path: string, isMobile = false) => {
  return (
    (path === '/flights/[id]' && !isMobile) ||
    path === '/international/[id]' ||
    path === '/train/[id]' ||
    path === '/bus/[id]' ||
    path === '/hotel/[id]' ||
    null
  );
};

export const getServiceIcon = (path: string) => {
  return {
    flights: <DomesticFlightIcon />,
    international: <GlobalFlightIcon />,
    train: <TrainMainIcon />,
    bus: <BusMainIcon />,
    hotel: <LocalHotelIcon />,
  }[getServiceName(path)];
};
