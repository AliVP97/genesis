import {
  DesktopOriginDestinationHistoryType,
  DesktopOriginDestinationLocationType,
} from 'components/desktopOriginDestination/types';
import { TBusStation } from 'services/bus/stations/interface';
import { RequireKeys } from 'utils/interface';
import { TBusSearchQuery } from './constants';

export interface IBusStation {
  stationCode: string;
  stationName: string;
  cityName: string;
  provinceName: string;
}

export type TAdditionalData = {
  seoCode: string;
};

export type TStation = RequireKeys<TBusStation, 'seoCode' | 'stationCode' | 'cityName'>;

export type TLocation = {
  origin: TStation;
  destination: TStation;
};

export type TSearchBoxStation = RequireKeys<
  DesktopOriginDestinationLocationType<TAdditionalData>,
  'data'
>;

export type TSearchBoxLocation = {
  origin: TSearchBoxStation;
  destination: TSearchBoxStation;
};

export type TLocationHistory = DesktopOriginDestinationHistoryType<TAdditionalData>;

export type TSearchObject = TLocation & {
  departureDate: string;
};

export type TQueryObject = TBusSearchQuery;
