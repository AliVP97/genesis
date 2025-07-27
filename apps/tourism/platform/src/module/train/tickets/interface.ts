import {
  DesktopOriginDestinationHistoryType,
  DesktopOriginDestinationStateType,
} from 'components/desktopOriginDestination/types';
import { TTrainStationType } from 'services/train/types';
import { definitions } from 'types/rajatrain';

export type TicketType = definitions['rajaTrainInfo'];

export enum TabType {
  DETAIL = 'DETAIL',
  POLICY = 'POLICY',
  MIDDLESTATIONS = 'MIDDLESTATIONS',
}

export const detailOptions = [
  {
    label: 'جزییات بلیط',
    value: TabType.DETAIL,
  },
  {
    label: 'ایستگاه‌های بین‌راهی',
    value: TabType.MIDDLESTATIONS,
  },
  {
    label: 'قوانین استرداد',
    value: TabType.POLICY,
  },
];

export interface Passengers {
  adult: number;
  child: number;
  infant: number;
}

export interface SearchHistory {
  origin: TTrainStationType;
  destination: TTrainStationType;
  passenger: Passengers;
  departureDate: string;
  returningDate: string | undefined;
}

export type TTrainAdditionalData = {
  englishName: string;
};

export type TLocationHistoryType = DesktopOriginDestinationHistoryType<TTrainAdditionalData>;

export type TLocationStateType = DesktopOriginDestinationStateType<TTrainAdditionalData>;

export type TicketList = TicketType[];
export type WagonType = definitions['rajaWagonType'];
export type TrainTicket = TicketType & { isCoupe: boolean };
export type TrainTicketType = definitions['rajaTrainTicket'];

export const PersianWagonType = {
  WAGON_TYPE_UNDEFINED: 'نا مشخض',
  WAGON_TYPE_COMPARTMENT_4: 'کوپه‌ای 4 نفره',
  WAGON_TYPE_COMPARTMENT_6: 'کوپه‌ای 6 نفره',
  WAGON_TYPE_BUS_4: 'اتوبوسی 4 نفره',
  WAGON_TYPE_BUS_6: 'اتوبوسی 6 نفره',
};

type TWagon =
  | 'WAGON_TYPE_BUS_4'
  | 'WAGON_TYPE_BUS_6'
  | 'WAGON_TYPE_COMPARTMENT_4'
  | 'WAGON_TYPE_COMPARTMENT_6'
  | 'WAGON_TYPE_UNDEFINED';

export const wagonType = (type: TWagon) => {
  switch (type) {
    case 'WAGON_TYPE_BUS_4':
      return 'اتوبوسی ۴ نفره';
    case 'WAGON_TYPE_BUS_6':
      return 'اتوبوسی ۶ نفره';
    case 'WAGON_TYPE_COMPARTMENT_4':
      return 'کوپه ای ۴ نفره';
    case 'WAGON_TYPE_COMPARTMENT_6':
      return 'کوپه ای ۶ نفره';
    default:
      return '';
  }
};

export interface OptionTypes {
  value: string;
  title: string;
}

export const options: OptionTypes[] = [
  {
    value: 'lowPrice',
    title: 'ارزان ترین',
  },
  {
    value: 'highPrice',
    title: 'گران ترین',
  },
  {
    value: 'earliestTime',
    title: 'زودترین',
  },
  {
    value: 'recentTime',
    title: 'دیرترین',
  },
];

export type TrainType = 'oneWay' | 'roundTrip';

export type TSexType =
  | 'SEX_CODE_UNSPECIFIED'
  | 'SEX_CODE_MEN_ONLY'
  | 'SEX_CODE_WOMEN_ONLY'
  | 'SEX_CODE_FAMILY';

export type TServices = 'flight' | 'train' | 'bus';
