import { Order, TripType, TTrips } from 'services/domestic/orders/interface';
import { DateState } from 'containers/datepicker/selectDate/index';
import { OptionTypes } from 'containers/ticketsSort/sortItems';
import { definitions } from 'types/shoppingorder';

export const NUMBER_OF_SKELETON_IN_TRAVEL_LOADING = 3;

export type OrderType = {
  TripType?: TripType;
  createdDate?: string;
  departureCity?: string;
  arrivalCity?: string;
  departurePrice?: string;
  arrivalPrice?: string;
  price?: string;
  orderId?: string;
  orderNumber?: string;
  departureAirline?: string;
  departureTime?: string;
  arrivalAirline?: string;
  returningDepartureTime?: string;
  issueDate?: string;
  return?: boolean;
  arrivalPnr?: string;
  pnr?: string;
  ticketId?: string;
  returnTicketId?: string;
  refundReason?: string;
  returnRefundReason?: string;
  departureIata?: string;
  arivalIata?: string;
  returnDepartureIata?: string;
  returnArivalIata?: string;
  returnArivalCity?: string;
  returnDepartureCity?: string;
  flightId?: string;
  returnFlightId?: string;
  passengers: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    tickets?: definitions['apishoppingorderTicket'][];
    firstName?: string;
    lastName?: string;
    passengerType?: string;
    price?: string;
    ageType?: 'AGE_TYPE_UNDEFINED' | 'AGE_TYPE_ADULT' | 'AGE_TYPE_CHILD' | 'AGE_TYPE_INFANT';
  }[];
};

export type TripRespone = {
  data: Order;
  type: TripType;
};

export enum TravelTabType {
  TRAVELS = 'خریدهای من',
  PASSENGERS = 'لیست مسافران',
}

export enum TravelDetailsTabType {
  DETAILS = 'جزئیات بلیط',
  PASSENGERS = 'مسافران',
}
export enum HotelDetailsTabType {
  DETAILS = 'جزئیات رزرو',
  PASSENGERS = 'اتاق ها و مسافران',
}
export enum TourDetailsTabType {
  DETAILS = 'جزئیات تور',
  PASSENGERS = 'مسافران',
}
export const travelFilterOptions: Array<OptionTypes> = [
  {
    value: 'TRIPTYPE_UNDEFINED',
    title: 'همه',
  },
  {
    value: 'TRIPTYPE_DOMESTIC_FLIGHT',
    title: 'پرواز داخلی',
  },
  {
    value: 'TRIPTYPE_INTERNATIONAL_FLIGHT',
    title: 'پرواز خارجی',
  },
  {
    value: 'TRIPTYPE_TRAIN',
    title: 'قطار',
  },
  {
    value: 'TRIPTYPE_BUS',
    title: 'اتوبوس',
  },
  {
    value: 'HOTEL',
    title: 'هتل',
  },
  {
    value: 'Tour',
    title: 'تور',
  },
];

export type useTravelReturn = {
  orders: TTrips;
  isLoading: boolean;
  filter: travelFilter;
  setFilter: React.Dispatch<React.SetStateAction<travelFilter>>;
  ordersLength: number;
};

export type travelFilter = {
  search: string;
  date: DateState;
  orderType: OptionTypes;
};

export interface ITripDomesticFlight {
  departureAirline?: string;
  departureIata?: string;
  arivalIata?: string;
  pnr?: string;
}

export interface ITripTrain {
  company?: string;
  serialNumber?: string;
  trainInfo?: ITrainInfo;
}

export type TPassengerAgeType =
  | 'AGE_TYPE_UNDEFINED'
  | 'AGE_TYPE_ADULT'
  | 'AGE_TYPE_CHILD'
  | 'AGE_TYPE_INFANT'
  | 'GENDER_TYPE_UNDEFINED'
  | 'GENDER_TYPE_FEMALE'
  | 'GENDER_TYPE_MALE'
  | 'Gender_TYPE_RATHER_NOT_SAY';

export interface ITripPassenger {
  firstName?: string;
  lastName?: string;
  passengerType?: string;
  price?: string;
  ageType?: TPassengerAgeType;
  tickets?: definitions['apishoppingorderTicket'][];
  ticket?: definitions['apishoppingorderTicket'];
}
export interface ITrainInfo {
  departure: string;
  returning?: string;
}

export type TTrip = {
  type?: TripType;
  orderId?: string;
  orderNumber?: string;
  issueDate?: string;
  price?: string;
  status?: string;
  departureCity?: string;
  arrivalCity?: string;
  departurePrice?: string;
  departureTime?: string;
  hasReturn?: boolean;
  ticketId?: string;
  details: ITripDomesticFlight | ITripTrain;
  return?: Omit<TTrip, 'return'>;
  passengers?: Array<ITripPassenger>;
};
