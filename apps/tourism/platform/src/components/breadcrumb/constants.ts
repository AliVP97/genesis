import { ServicesContsantModel } from './types';
import {
  iataToFarsiCity as iataToInternationalAirPorts,
  iataToFarsi as iataToFarsiInternationalCity,
} from 'utils/static/internationalFlight';

export const serviceConstant: ServicesContsantModel = {
  flights: 'خرید بلیط هواپیما',
  international: 'خرید بلیط هواپیما خارجی',
  bus: 'خرید بلیط اتوبوس',
  visa: 'اخذ ویزای توریستی',
  hotel: 'رزرو هتل',
  tour: 'رزرو تور',
  intTour: 'رزرو تور خارجی',
  domTour: 'رزرو تور داخلی',
  train: 'خرید بلیط قطار',
  dubai: 'دبی',
  russia: 'روسیه',
  hafhashtad: 'هف‌هشتاد',
  tourism: 'خدمات گردشگری',
};

const pathValues = {
  baseUrl: { fa: serviceConstant.hafhashtad },
  tourismBaseUrl: { fa: serviceConstant.tourism },
  domestic: { fa: serviceConstant.domTour },
  international: { fa: serviceConstant.intTour },
};

export const productionPaths = {
  '780.ir': pathValues.baseUrl,
  '780.ir/tourism': pathValues.tourismBaseUrl,
  '780.ir/tourism/tour/domestic': pathValues.domestic,
  '780.ir/tourism/tour/international': pathValues.international,
};

export const localPaths = {
  'localhost:3000': pathValues.baseUrl,
  'localhost:3000/tourism': pathValues.tourismBaseUrl,
  'localhost:3000/tourism/tour/domestic': pathValues.domestic,
  'localhost:3000/tourism/tour/international': pathValues.international,
  'stage-tourism.780.ir': pathValues.baseUrl,
  'stage-tourism.780.ir/tourism': pathValues.tourismBaseUrl,
  'stage-tourism.780.ir/tourism/tour/domestic': pathValues.domestic,
  'stage-tourism.780.ir/tourism/tour/international': pathValues.international,
  'test-tourism.780.ir': pathValues.baseUrl,
  'test-tourism.780.ir/tourism': pathValues.tourismBaseUrl,
  'test-tourism.780.ir/tourism/tour/domestic': pathValues.domestic,
  'test-tourism.780.ir/tourism/tour/international': pathValues.international,
  '780.travel/.ir': pathValues.baseUrl,
  '780.travel/.ir/tourism': pathValues.tourismBaseUrl,
  '780.travel/.ir/tourism/tour/domestic': pathValues.domestic,
  '780.travel/.ir/tourism/tour/international': pathValues.international,
};

export const excludedList = ['/companies', '/airlines', '/airlines/', '/companies/'];
export const SERVICES = {
  hotel: 'hotel',
  visa: 'visa',
  tour: 'tour',
};

export const internationalIata = Object.assign(
  {},
  iataToFarsiInternationalCity,
  iataToInternationalAirPorts,
);

/**
 * @function constantGenerator
 * @description generates object with constants based on input array
 * @param {string[]} services - array of services
 * @returns {object} - object with constants
 * this function generate object with constants based on input array
 * The constants are:
 * - baseUrlText: first item of array
 * - tourismText: second item of array
 * - serviceText: third item of array
 * - hotelDetail: fourth item of array
 * - baseUrl: generated based on input array
 * - hotelConditions: object with two properties:
 *   - isHotelDetailUrl: boolean, true if third item of array is 'detail'
 *   - isHotelSearch: boolean, true if the pattern matches
 */
export const constantGenerator = (services: string[]) => {
  const urlParams = {
    baseUrlText: `${services[0]}`,
    tourismText: `${services[1]}`,
    serviceText: `${services[2]}`,
    hotelDetail: `${services[3]}`,
  };
  const pattern = /^hotel\/[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$/;
  const hotelConditions = {
    isHotelDetailUrl: `${urlParams.serviceText}/${urlParams.hotelDetail}` === 'hotel/detail',
    isHotelSearch: pattern.test(`${urlParams.serviceText}/${urlParams.hotelDetail}`.split('?')[0]),
  };

  const tourConditions = {
    isTourDetailUrl: `${urlParams.serviceText}/${urlParams.hotelDetail}` === 'tour/detail',
  };

  const baseUrl = `${urlParams.baseUrlText}/${urlParams.tourismText}${
    urlParams.serviceText ? '/' + urlParams.serviceText : ''
  }`;

  return { hotelConditions, tourConditions, baseUrl, urlParams };
};

export const productionEnvironments = (service: string): boolean => {
  const environments = ['780.ir'];
  return environments.includes(service);
};
