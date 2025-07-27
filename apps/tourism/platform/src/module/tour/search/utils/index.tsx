import { DesktopOriginDestinationStateType } from 'components/desktopOriginDestination/types';
import {
  DesktopOriginDestinationDataMapperInputType,
  DesktopOriginDestinationLocationsType,
  locationState,
} from 'components/originDestination/interface';

import { Location } from 'assets/icons';
import { TBody } from 'services/tour/v2/searchLocation/types';

type TMapToDesktopOriginDestinationState = (
  state: locationState,
) => DesktopOriginDestinationStateType;

export const mapToDesktopOriginDestinationState: TMapToDesktopOriginDestinationState = (state) => {
  return {
    origin: {
      id: state.origin?.value,
      title: state.origin?.city,
      description: state.origin?.airport,
    },
    destination: {
      id: state.destination?.value,
      title: state.destination?.city,
      description: state.destination?.airport,
    },
  };
};

type TMapToLocationState = (state: DesktopOriginDestinationStateType) => locationState;

type TMapToLocationStateOrigin = (state: {
  title: string;
  subTitle: string;
  description: string;
}) => { origin?: { value: string; city: string } };
type TMapToLocationStateDestination = (state: {
  title: string;
  subTitle: string;
  description: string;
}) => { destination?: { value: string; city: string } };

export const mapToLocationState: TMapToLocationState = (state) => {
  return {
    origin: {
      value: state.origin.id,
      city: state.origin.title,
      airport: state.origin.description as string,
      clicked: state.origin.clicked ? state.origin.clicked : false,
    },
    destination: {
      value: state.destination.id,
      city: state.destination.title,
      airport: state.destination.description as string,
      clicked: state.destination.clicked ? state.destination.clicked : false,
    },
  };
};
export const mapToLocationStateOrigin: TMapToLocationStateOrigin = (state) => {
  return {
    origin: {
      value: state?.description,
      city: state?.title,
    },
  };
};
export const mapToLocationStateDestination: TMapToLocationStateDestination = (state) => {
  return {
    destination: {
      value: state?.description,
      city: state?.title,
    },
  };
};

type TSearchDataMapper = (
  arg: DesktopOriginDestinationDataMapperInputType,
) => DesktopOriginDestinationLocationsType;

export const searchDataMapper: TSearchDataMapper = (response) => {
  return (response as TBody)?.map((item) => ({
    id: item.id,
    icon: <Location />,
    title: item.name,
    subTitle: item.province,
  }));
};

export const checkInputsValidation = (
  originValue: string | undefined,
  DestinationValue: string | undefined,
) => {
  return (
    !!originValue &&
    originValue !== 'undefined' &&
    !!DestinationValue &&
    DestinationValue !== 'undefined'
  );
};
