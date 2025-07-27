import { TStation } from '../types';
import { TBusStation } from 'services/bus/stations/interface';

export const validateStation = (station: TBusStation | undefined): TStation => {
  if (station === undefined) {
    throw new Error('station in undefined');
  }

  const { seoCode, stationCode, cityName, ...props } = station;

  if (!!seoCode && !!stationCode && !!cityName) {
    return {
      seoCode: seoCode,
      stationCode: stationCode,
      cityName: cityName,
      ...props,
    };
  }

  throw new Error('missing required fields: "seoCode", "stationCode", "cityName"');
};
