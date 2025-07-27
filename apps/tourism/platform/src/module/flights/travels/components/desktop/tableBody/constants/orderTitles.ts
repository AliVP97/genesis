import { TTripTypes } from 'services/domestic/orders/interface';

export const TRIP_TYPES_TITLES: Record<TTripTypes, string> = {
  Flight: 'پرواز داخلی',
  Train: 'قطار',
  Bus: 'اتوبوس',
  International_Flight: 'پرواز خارجی',
  Hotel: 'هتل',
  Undefined: '-',
  Tour: 'تور',
};
