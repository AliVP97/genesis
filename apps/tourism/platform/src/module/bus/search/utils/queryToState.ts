import { queryClient } from 'pages/_app';
import { stationQuery } from 'services/bus/stations';
import { TBusStations } from 'services/bus/stations/interface';
import { TLocation, TQueryObject, TSearchObject } from '../types';
import { validateStation } from './validateStation';

export const seoCodeToStation = async (seoCode: string): Promise<TBusStations> =>
  queryClient.fetchQuery(stationQuery(seoCode));

export const queryToLocation = async (query: TQueryObject): Promise<TLocation> => {
  if (query.id === undefined) {
    throw new Error('id in undefined');
  }

  const [originCode, destinationCode] = query.id?.split('-');

  const [origin, destination] = await Promise.all([
    !!originCode && seoCodeToStation(originCode),
    !!destinationCode && seoCodeToStation(destinationCode),
  ]);

  if (origin) {
    if (originCode !== origin?.stations?.[0]?.seoCode) {
      throw new Error('origin not found');
    }

    if (destination) {
      if (destinationCode !== destination?.stations?.[0]?.seoCode) {
        throw new Error('destionation not found');
      }

      return {
        origin: validateStation(origin?.stations?.[0]),
        destination: validateStation(destination?.stations?.[0]),
      };
    } else if (!destination) {
      return {
        origin: { seoCode: '', stationCode: '', cityName: '' },
        destination: validateStation(origin?.stations?.[0]),
      };
    }
  }

  return {
    origin: { seoCode: '', stationCode: '', cityName: '' },
    destination: { seoCode: '', stationCode: '', cityName: '' },
  };
};

export const queryToState = async (query: TQueryObject): Promise<TSearchObject> => {
  let location: TLocation = {
    origin: { seoCode: '', stationCode: '', cityName: '' },
    destination: { seoCode: '', stationCode: '', cityName: '' },
  };

  try {
    location = await queryToLocation(query);
  } catch (error) {}

  return {
    ...location,
    departureDate: query.departureDate,
  };
};
