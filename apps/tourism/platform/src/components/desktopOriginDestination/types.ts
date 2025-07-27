import { ReactElement } from 'react';

import { LocationType } from 'components/originDestination/interface';
import { QueryFunctionContext, UseQueryOptions } from 'react-query';
import { TBusStations } from 'services/bus/stations/interface';
import { SearchAirportsResponse } from 'services/domestic/flight/interface';
import { THotelsAndCitiesResponse } from 'services/hotel/hotelsAndCities/interface';
import { TInternationalFlightSearchAirportsResponse } from 'services/internationalFlight/airports/interface';
import { TrainSearchResponse } from 'services/train/stations/interface';
import { definitions } from 'types/rajatrain';
import { TBody as TTourSearchLocationResponse } from 'services/tour/v2/searchLocation/types';

export type TAdditionalDataDefaultValue = Record<string, string>;

export type TOriginDestinationLocationBase<D = TAdditionalDataDefaultValue> = {
  id: string;
  title: string;
  subTitle?: string;
  icon?: DesktopOriginDestinationListItemIconType;
  description?: string;
  sideContent?: string;
  titleEng?: string;
  cityEng?: string;
  clicked?: boolean;
  type?: {
    id: string;
    title: string;
  };

  elementName?: string;
  data?: D;
};

export type DesktopOriginDestinationLocationType<D = TAdditionalDataDefaultValue> =
  TOriginDestinationLocationBase<D> & {
    children?: TOriginDestinationLocationBase<D>[];
  };

export type DesktopOriginDestinationStateType<D = TAdditionalDataDefaultValue> = {
  origin: DesktopOriginDestinationLocationType<D>;
  destination: DesktopOriginDestinationLocationType<D>;
};

export type DesktopOriginDestinationLocationsType<D = TAdditionalDataDefaultValue> =
  DesktopOriginDestinationLocationType<D>[];

export type DesktopOriginDestinationOnSelectType<D = TAdditionalDataDefaultValue> = (
  e: DesktopOriginDestinationStateType<D>,
) => void;

export type DesktopOriginDestinationDataMapperInputType =
  | SearchAirportsResponse
  | definitions['rajaStationSearchResponse']
  | TInternationalFlightSearchAirportsResponse
  | THotelsAndCitiesResponse;

export type DesktopOriginDestinationHistoryType<D = TAdditionalDataDefaultValue> =
  | {
      origin: DesktopOriginDestinationLocationsType<D>;
      destination: DesktopOriginDestinationLocationsType<D>;
    }
  | undefined;

export type DesktopOriginDestinationPropsType<
  T =
    | SearchAirportsResponse
    | TrainSearchResponse
    | TBusStations
    | TInternationalFlightSearchAirportsResponse
    | TTourSearchLocationResponse
    | THotelsAndCitiesResponse,
  D = TAdditionalDataDefaultValue,
> = {
  state: DesktopOriginDestinationStateType<D>;
  originOnly?: boolean;
  defaultData: {
    title: string;
    value: DesktopOriginDestinationLocationsType<D>;
  };
  onSelect: DesktopOriginDestinationOnSelectType<D>;
  api: {
    fetcher: (ctx: QueryFunctionContext) => Promise<T>;
    params?: { domestic: boolean };
    dataMapper: (arg?: T) => DesktopOriginDestinationLocationsType<D>;
  };
  history: DesktopOriginDestinationHistoryType<D>;
  onClearHistory: (e: LocationType) => void;
  originPlaceHolder?: string;
  banEnglishInput?: boolean;
  inputCharsLengthToSearch?: number;
  defaultQuery?: (searchValue: string) => UseQueryOptions<T>;
  showTransportServiceProviderTitle?: boolean;
  showDescription?: boolean;
  style?: 'categoryTitle' | '';
  skeleton?: JSX.Element;
};

export type DesktopOriginDestinationListItemIconType = ReactElement;

export type DesktopOriginDestinationLocationCardPropsType = {
  title: string;
  detail: string;
  icon?: DesktopOriginDestinationListItemIconType;
  onClick: () => void;
  onDelete?: () => void;
  showDeleteButton?: boolean;
  description?: string;
  sideContent?: string;
  elementName?: string;
};

export type ActiveInputNameType = 'origin' | 'destination' | undefined;

export type Point = 'origin' | 'destination';
