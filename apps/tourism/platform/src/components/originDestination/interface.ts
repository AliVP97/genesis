import { ChangeEvent } from 'react';

export interface Airport {
  airport_name: string;
  airport_name_fa: string;
  iata: string;
}

export interface Station {
  airport_name: string;
  airport_name_fa: string;
  city_name: string;
  city_name_fa: string;
  country_name: string;
  country_name_fa: string;
  iata: string;
}
export interface City {
  city_name: string;
  city_name_fa: string;
  airports: Airport[];
}
export interface Country {
  country_name: string;
  country_name_fa: string;
  cities: City[];
}
export interface ListItem {
  country_name: string;
  country_name_fa: string;
  cities: City[];
}

export type List = ListItem[];
export interface SelectLocationProps {
  value: Location;
  name: string;
  placeHodler?: string;
  onFocusClass?: string;
  className?: string;
  list?: List;
  history?: List;
  topSearch?: List;
  onSelect(name: string, value: Location): void;
  onChange?: (event: ChangeEvent) => void;
}

export type Location = {
  value: string;
  city: string;
  airport: string;
  type?: {
    id: string;
    title: string;
  };
  data?: { [key: string]: string };

  cityEng?: string;
  // titleEng?: string;
  clicked?: boolean;
};

export interface locationState {
  origin: Location;
  destination: Location;
}

export enum LocationType {
  ORIGIN = 'origin',
  DESTINATION = 'destination',
}

//==========================================================================
//==========================================================================
//==========================================================================
export type {
  TAdditionalDataDefaultValue,
  TOriginDestinationLocationBase,
  DesktopOriginDestinationLocationType,
  DesktopOriginDestinationStateType,
  DesktopOriginDestinationLocationsType,
  DesktopOriginDestinationOnSelectType,
  DesktopOriginDestinationDataMapperInputType,
  DesktopOriginDestinationHistoryType,
  DesktopOriginDestinationPropsType,
  DesktopOriginDestinationListItemIconType,
  DesktopOriginDestinationLocationCardPropsType,
} from '../desktopOriginDestination/types';
