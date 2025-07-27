import { TLocation, TSearchBoxLocation } from '../types';

export const mapToDesktopOriginDestinationState = (state: TLocation): TSearchBoxLocation => {
  return {
    origin: {
      id: state.origin.stationCode,
      title: state.origin.cityName,
      description: state.origin.stationName,
      data: { seoCode: state.origin.seoCode },
    },
    destination: {
      id: state.destination.stationCode,
      title: state.destination.cityName,
      description: state.destination.stationName,
      data: { seoCode: state.destination.seoCode },
    },
  };
};
