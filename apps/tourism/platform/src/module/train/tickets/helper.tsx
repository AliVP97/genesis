import { TrainIcon } from 'assets/icons';
import {
  DesktopOriginDestinationDataMapperInputType,
  DesktopOriginDestinationLocationsType,
} from 'components/desktopOriginDestination/types';
import { TDaysContents } from 'containers/datepicker/datepicker/types';
import { TInitialState } from 'module/train/tickets/components/searchTicket';
import { TrainSearchResponse } from 'services/train/stations/interface';
import { TDaysPricesResponse } from 'services/train/tickets/interface';
import {
  SearchHistory,
  TLocationHistoryType,
  TLocationStateType,
  TTrainAdditionalData,
} from './interface';

export const mapToDesktopOriginDestinationHistory = (
  searchHistory: SearchHistory[],
): TLocationHistoryType =>
  searchHistory.reduce(
    (prev: TLocationHistoryType, curr) => {
      // origin:
      if (curr.origin.code && curr.origin.farsiName && curr.origin.englishName) {
        !prev?.origin.find((item) => item.id === curr.origin.code) &&
          prev?.origin.push({
            id: curr.origin.code,
            title: curr.origin.farsiName,
            data: { englishName: curr.origin.englishName },
          });
      }
      // destination:
      if (curr.destination.code && curr.destination.farsiName && curr.destination.englishName) {
        !prev?.destination.find((item) => item.id === curr?.destination.code) &&
          prev?.destination.push({
            id: curr.destination.code,
            title: curr.destination.farsiName,
            data: { englishName: curr.destination.englishName },
          });
      }

      return prev;
    },
    { origin: [], destination: [] },
  );

export const mapToDesktopOriginDestinationState: (state: TInitialState) => TLocationStateType = (
  state,
) => {
  return {
    origin: {
      id: state.origin.code,
      title: state.origin.farsiName,
      data: { englishName: state.origin.englishName },
    },
    destination: {
      id: state.destination.code,
      title: state.destination.farsiName,
      data: { englishName: state.destination.englishName },
    },
  };
};

export const mapToLocationState = (state: TLocationStateType): TInitialState => {
  return {
    origin: {
      code: state.origin.id,
      farsiName: state.origin.title,
      englishName: state.origin.data?.englishName || '',
    },
    destination: {
      code: state.destination.id,
      farsiName: state.destination.title,
      englishName: state.destination.data?.englishName || '',
    },
  };
};

export interface IProps {
  tripMode: 'oneWay' | 'roundTrip';
  originLocation: string;
  destinationLocation: string;
  dateFrom: number | null;
  dateTo: number | null;
  passenger: number;
}
export const isDisable = ({
  tripMode,
  originLocation,
  destinationLocation,
  dateFrom,
  dateTo,
  passenger,
}: IProps) => {
  if (tripMode === 'oneWay')
    return !originLocation || !destinationLocation || !dateFrom || !passenger;
  else return !originLocation || !destinationLocation || !dateFrom || !dateTo || !passenger;
};

export const toDaysContents = (days: TDaysPricesResponse | undefined) => {
  const contents: TDaysContents = {};
  days?.calendarData?.forEach((day) => {
    const key =
      day.persianDepartureDate &&
      day.persianDepartureDate
        .substring(0, 10)
        .split('')
        .filter((date) => date !== '-')
        .join('');
    key && (contents[key] = { secondary: day.minimumPrice });
  });
  return contents;
};

export const desktopOriginDestinationDataMapper = (
  response?: DesktopOriginDestinationDataMapperInputType,
) => {
  return (response as TrainSearchResponse)?.stations?.map((item) => ({
    id: item.code,
    icon: <TrainIcon className="fill-grey-2" />,
    title: item?.farsiName,
    data: { englishName: item?.englishName },
  })) as DesktopOriginDestinationLocationsType<TTrainAdditionalData>;
};
