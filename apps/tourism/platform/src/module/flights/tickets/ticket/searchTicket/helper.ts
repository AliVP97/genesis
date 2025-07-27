import { SearchHistory } from './interface';
import { DesktopOriginDestinationHistoryType } from 'components/desktopOriginDestination/types';

export const mapToDesktopOriginDestinationHistory: (
  arg: SearchHistory[],
) => DesktopOriginDestinationHistoryType = (searchHistory) =>
  searchHistory.reduce(
    (prev: DesktopOriginDestinationHistoryType, curr) => {
      // origin:
      curr.origin &&
        curr.origin.airport &&
        !prev?.origin.find((item) => item.id === curr?.origin?.value) &&
        prev?.origin.push({
          id: curr.origin?.value,
          title: curr?.origin?.city,
          description: curr?.origin?.airport,
        });
      // destination:
      curr.destination &&
        curr.destination.airport &&
        !prev?.destination.find((item) => item.id === curr?.destination?.value) &&
        prev?.destination.push({
          id: curr.destination?.value,
          title: curr.destination?.city,
          description: curr.destination?.airport,
        });
      return prev;
    },
    { origin: [], destination: [] },
  );

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
