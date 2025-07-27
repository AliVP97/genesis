import { AirlineTypes } from 'containers/filter/filterTicket/interface';

export const towardDurationFilters = [
  {
    value: '0-6',
    type: 'toward',
    title: 'بامداد ( 00 تا ۶ )',
  },
  {
    value: '6-12',
    type: 'toward',
    title: 'صبح(6 تا 12)',
  },
  {
    value: '12-18',
    type: 'toward',
    title: 'عصر(12 تا 18)',
  },
  {
    value: '18-24',
    type: 'toward',
    title: 'شب(18 تا 24)',
  },
];
export const backwardDurationFilters = [
  {
    value: '0-6',
    type: 'backward',
    title: 'بامداد ( 00 تا ۶ )',
  },
  {
    value: '6-12',
    type: 'backward',
    title: 'صبح(6 تا 12)',
  },
  {
    value: '12-18',
    type: 'backward',
    title: 'عصر(12 تا 18)',
  },
  {
    value: '18-24',
    type: 'backward',
    title: 'شب(18 تا 24)',
  },
];
export const stopCountFilters = [
  {
    value: '0',
    type: 'stops',
    title: 'بدون توقف',
  },
  {
    value: '1',
    type: 'stops',
    title: '۱ توقف',
  },
  {
    value: '2',
    type: 'stops',
    title: '۲ توقف و بیشتر',
  },
];

export const airlines: AirlineTypes[] = [
  {
    key: '0',
    name: 'آتا',
    priceFrom: 52478000,
  },
  {
    key: '1',
    name: 'قشم ایر',
    priceFrom: 75123000,
  },
  {
    key: '2',
    name: 'معراج',
    priceFrom: 65213000,
  },
  {
    key: '3',
    name: 'کاسپین',
    priceFrom: 92336000,
  },
  {
    key: '4',
    name: 'ایران سفر',
    priceFrom: 34219000,
  },
  {
    key: '5',
    name: 'ماهان',
    priceFrom: 52614000,
  },
];
export const ticketTypeFilterData = [
  {
    value: 'charter',
    title: 'چارتری',
    type: 'ticketType',
  },
  {
    value: 'system',
    title: 'سیستمی',
    type: 'ticketType',
  },
];
export const flightClassFilterData = [
  {
    value: 'ECONOMY',
    title: 'اکونومی',
    type: 'flightClass',
  },
  {
    value: 'BUSINESS',
    title: 'بیزینس',
    type: 'flightClass',
  },
];
