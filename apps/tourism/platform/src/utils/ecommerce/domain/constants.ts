import { BaseTrackingEventActionType } from './baseActionTypes';

export type EventTypes = BaseTrackingEventActionType | '';

export const Services = {
  TOUR: 'Tour',
  VISA: 'Visa',
  DOMESTIC_BUS: 'Domestic Bus',
  INTERNATIONAL_BUS: 'International Bus',
  DOMESTIC_FLIGHT: 'Domestic Flight',
  INTERNATIONAL_FLIGHT: 'International Flight',
  DOMESTIC_TRAIN: 'Domestic Train',
  INTERNATIONAL_TRAIN: 'International Train',
};

export const Currency = {
  TRY: 'TRY',
};

export const ProductType = {
  TRAIN: 'قطار',
  HOTEL: 'هتل',
  DOMESTIC_FLIGHT: 'پرواز داخلی',
  INTERNATIONAL_FLIGHT: 'پرواز خارجی',
};
export const ROUNDED_TRIP = 'رفت و برگشت';
export const ONE_WAY_TRIP = 'یکطرفه';
export const CHARTER = 'Charter';
export const SYSTEM = 'System';

export enum TripModeEnum {
  'two' = '2',
}

export const ServiceNameFromPaymentSide = {
  BUS: 'bus',
  HOTEL: 'hotel',
  INTERNATIONALFLIGHT: 'international-flight',
  TRAIN: 'rajatrain',
  TOUR: 'tour',
  // notice: domestic flight service name on payment side is tourism
  DOMESTICFLIGHT: 'tourism',
};
