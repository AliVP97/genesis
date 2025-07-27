import { SearchHistory } from './interface';
import { DesktopOriginDestinationHistoryType } from 'components/desktopOriginDestination/types';

export const mapToDesktopOriginDestinationHistory: (
  arg: SearchHistory[],
) => DesktopOriginDestinationHistoryType = (searchHistory) => {
  return searchHistory.reduce(
    (prev: DesktopOriginDestinationHistoryType, curr) => {
      // origin:
      !prev?.origin?.find((item) => item.id === curr?.origin?.value) &&
        prev?.origin.push({
          id: curr?.origin?.value,
          title: curr?.origin?.city,
          subTitle: curr?.origin?.airport,
          cityEng: curr?.origin?.cityEng,
          description: '',
          type: curr?.origin.type,
          data: {
            cityId: curr.origin.data?.cityId || '',
            cityName: curr.origin.data?.cityName || '',
            uuid: curr.origin.data?.uuid || '',
          },
        });
      // destination:
      !prev?.destination?.find((item) => item.id === curr?.destination?.value) &&
        prev?.destination.push({
          id: curr.destination?.value,
          title: curr?.destination?.city,
          subTitle: curr?.destination?.airport,
          description: '',
          type: curr?.origin.type,
        });
      return prev;
    },
    { origin: [], destination: [] },
  );
};

export interface IProps {
  originLocation: string;
  dateFrom: number | null;
  dateTo: number | null;
}

export const isDisable = ({ originLocation, dateFrom, dateTo }: IProps) => {
  // alert((!originLocation || !dateFrom) + '');
  return !originLocation || !dateFrom || !dateTo;
};

// submit search
