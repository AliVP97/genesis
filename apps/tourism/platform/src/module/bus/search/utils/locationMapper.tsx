import { TBusStations } from 'services/bus/stations/interface';
import { TAdditionalData, TLocation, TSearchBoxStation, TStation } from '../types';

import { BusOutlineIcon } from 'assets/icons';
import { DesktopOriginDestinationStateType } from 'components/originDestination/interface';

export const stationTostate = (station: TStation): TSearchBoxStation => {
  return {
    id: station.stationCode,
    icon: <BusOutlineIcon className="fill-grey-2" />,
    title: station?.cityName,
    description: station?.stationName,
    subTitle: station.provinceName,
    data: { seoCode: station.seoCode },
  };
};

export const locationMapper = (response?: TBusStations): TSearchBoxStation[] => {
  return (
    response?.stations
      ?.filter(
        (item) =>
          typeof item.seoCode !== undefined &&
          typeof item.stationCode !== undefined &&
          typeof item.cityName !== undefined,
      )
      ?.map((item) => stationTostate(item as TStation)) || []
  );
};

const stateTostation = (state: TSearchBoxStation): TStation => {
  return {
    stationCode: state.id,
    cityName: state.title,
    stationName: state.description,
    provinceName: state.subTitle,
    seoCode: state.data?.seoCode,
  };
};

export const locationReverseMapper = (
  state: DesktopOriginDestinationStateType<TAdditionalData>,
): TLocation => {
  if (
    (state.origin.clicked && typeof state.origin.data?.seoCode !== 'string') ||
    (state.destination.clicked && typeof state.destination.data?.seoCode !== 'string')
  ) {
    throw new Error('"seoCode" in not defined');
  }

  return {
    origin: stateTostation(state.origin as TSearchBoxStation),
    destination: stateTostation(state.destination as TSearchBoxStation),
  };
};
