import { SearchHistory } from './interface';
import { DesktopOriginDestinationHistoryType } from 'components/desktopOriginDestination/types';

export const mapToDesktopOriginDestinationHistory: (
  arg: SearchHistory[],
) => DesktopOriginDestinationHistoryType = (searchHistory) => {
  return searchHistory.reduce(
    (prev: DesktopOriginDestinationHistoryType, curr) => {
      // origin:
      curr.origin &&
        !prev?.origin.find((item) => item.id === curr?.origin?.value) &&
        prev?.origin.push({
          id: curr.origin?.value,
          title: curr?.origin?.city,
          // subTitle:  curr?.origin?.airport,
          description: '',
          sideContent: curr.origin.type?.title,
          type: curr.origin.type,
          data: curr.origin.data,
        });
      // destination:
      curr.destination &&
        !prev?.destination.find((item) => item.id === curr?.destination?.value) &&
        prev?.destination.push({
          id: curr.destination?.value,
          title: curr?.destination?.city,
          // subTitle: curr?.destination?.airport,
          description: '',
          sideContent: curr.destination.type?.title,
          type: curr.destination.type,
          data: curr.destination.data,
        });
      return prev;
    },
    { origin: [], destination: [] },
  );
};

export interface IProps {
  flightType: 'oneWay' | 'roundTrip';
  originLocation: string;
  destinationLocation: string;
  dateFrom: number | null;
  dateTo: number | null;
  passenger: number;
}
export const isDisable = ({
  flightType,
  originLocation,
  destinationLocation,
  dateFrom,
  dateTo,
  passenger,
}: IProps) => {
  if (flightType === 'oneWay')
    return !originLocation || !destinationLocation || !dateFrom || !passenger;
  else return !originLocation || !destinationLocation || !dateFrom || !dateTo || !passenger;
};
