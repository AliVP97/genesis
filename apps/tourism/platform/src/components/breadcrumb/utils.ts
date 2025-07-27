import { iataToFarsi } from 'utils/static/flightStatics';
import { stationLatinToFarsi as trainStationLatinToFarsi } from 'utils/static/trainStatic';
import { stationLatinToFarsiHead as busStationLatinToFarsi } from 'utils/static/busStaticHeader';

import { ParsedUrlQuery } from 'querystring';
import {
  breadCrumbModel,
  breadCrumbObjectModel,
  CityExtractorProps,
  TranslatorModel,
  TranslatorProps,
} from './types';
import {
  constantGenerator,
  excludedList,
  internationalIata,
  localPaths,
  productionEnvironments,
  productionPaths,
  serviceConstant,
  SERVICES,
} from './constants';

const iataCodeToFarsiTranslator = ({ iata, service }: TranslatorProps) => {
  const translator: TranslatorModel = {
    flights: iataToFarsi[iata ?? ''],
    international: internationalIata[iata ?? ''],
    train: iata ? trainStationLatinToFarsi[iata] : '',
    bus: iata ? busStationLatinToFarsi[iata]?.split('-')[0] : '',
  };
  return translator[service] ?? '';
};

const getCityId = (queryValue: string | string[] | undefined) => {
  return (typeof queryValue === 'string' ? queryValue : '-')?.split('-');
};

const getCityName = (query: ParsedUrlQuery, service: string) => {
  if (service === SERVICES.hotel) {
    return `${query?.cityName || ''}`;
  }
  if (service === SERVICES.tour) {
    return `${query?.destinationName || ''}`;
  }
  if (service === SERVICES.visa) {
    return serviceConstant[query?.name as string] || '';
  }

  const [iata1, iata2] = getCityId(query?.id);
  return `${iataCodeToFarsiTranslator({ iata: iata1, service }) || ''} ${
    iataCodeToFarsiTranslator({ iata: iata2, service }) || ''
  }`.trim();
};

/**
 * @function generateBreadcrumbEntry
 * @description generates an object with cityname and cityId for breadcrumb
 * @param {ParsedUrlQuery} query - query object from next/router
 * @param {string} service - service name
 * @param {string} [tourCityName] - city name for tour
 * @param {string} [hotelName] - hotel name for hotel
 * @returns {CityExtractorProps} - object with cityname and cityId
 * this function return breadcrumb entry based on recived params.
 * for example for route : /tourism/flights/KSH-THR
 * returned: {cityId : ['KSH', 'THR'] , cityname:"کرمانشاه تهران"}
 */
export const generateBreadcrumbEntry = (
  query: ParsedUrlQuery,
  service: string,
  tourCityName?: string,
  hotelName?: string,
): CityExtractorProps => {
  const queryKey = service === SERVICES.visa ? query?.name : query?.id;
  const cityId = service === SERVICES.tour ? getCityId(query?.type) : getCityId(queryKey);
  const cityName = getCityName(query, service);
  if (service === SERVICES.tour) {
    return {
      cityname: tourCityName ? `${tourCityName}` : '',
      cityId: [``],
    };
  }
  if (service === SERVICES.hotel) {
    return {
      cityname: hotelName ? `${hotelName}` : '',
      cityId: [`detail/${cityId.join('-')}`],
    };
  }
  return { cityname: cityName, cityId };
};

/**
 * @function generateKeyValue
 * @description generates object with key and value for breadcrumb
 * @param {string[]} services - array of services
 * @param {ParsedUrlQuery} query - query object from next/router
 * @param {string} [cityName] - city name for tour
 * @param {string} [hotelName] - hotel name for hotel
 * @returns {breadCrumbObjectModel} - object with key and value for breadcrumb
 * this function generate object with key and value for breadcrumb based on recived params.
 * for example for route : /tourism/flights/KSH-THR
 * returned: {"/tourism/flights/KSH-THR" : {"fa" : "کرمانشاه تهران"}}
 */
const generateKeyValue = (
  services: string[],
  query: ParsedUrlQuery,
  cityName?: string,
  hotelName?: string,
) => {
  const breadCrumbs: breadCrumbObjectModel = {};
  const key = `${constantGenerator(services).baseUrl}/${generateBreadcrumbEntry(
    query,
    constantGenerator(services).urlParams.serviceText,
    hotelName,
  ).cityId.join('-')}`;

  const serviceValue = `${
    serviceConstant[constantGenerator(services).urlParams.serviceText] ?? ''
  }`;

  if (constantGenerator(services).urlParams.serviceText === 'tour') {
    const tour = `${constantGenerator(services).baseUrl}/${services[3]}`.split('?')[0];
    const queryString = constantGenerator(services).urlParams.hotelDetail.split('?')[1] || '';
    const params = new URLSearchParams(queryString);
    const type = params.get('type')?.toUpperCase();
    let cityNameValue = cityName ?? '';
    if (constantGenerator(services).urlParams.hotelDetail.startsWith('-')) {
      cityNameValue =
        type === 'DOMESTIC'
          ? 'جستجو تور داخلی'
          : type === 'INTERNATIONAL'
            ? 'جستجو تور خارجی'
            : 'جستجو';
    }
    breadCrumbs[tour] = { fa: cityNameValue };

    if (constantGenerator(services).tourConditions.isTourDetailUrl && query?.id) {
      breadCrumbs[constantGenerator(services).baseUrl] = {
        fa: serviceValue ?? '',
      };

      const tourDetailUrl = `${constantGenerator(services).baseUrl}/detail/`;

      breadCrumbs[tourDetailUrl] = { fa: cityNameValue };
      breadCrumbs[constantGenerator(services).baseUrl + '/detail/' + query?.id] = {
        fa: cityNameValue,
      };
    }
  }

  if (constantGenerator(services).hotelConditions.isHotelSearch) {
    const hotelSearchUrl = `${constantGenerator(services).baseUrl}/${services[3]}`.split('?')[0];
    breadCrumbs[hotelSearchUrl] = { fa: cityName ?? '' };
  }

  //check for hotel detail path /hotel/detail
  if (constantGenerator(services).hotelConditions.isHotelDetailUrl) {
    breadCrumbs[constantGenerator(services).baseUrl] = {
      fa: serviceValue ?? '',
    };
    const hotelDetailUrl = `${constantGenerator(services).baseUrl}/detail`;
    breadCrumbs[hotelDetailUrl] = { fa: cityName ?? '' };
    breadCrumbs[key] = { fa: hotelName ?? '' };
  } else {
    const value = `${serviceConstant[constantGenerator(services).urlParams.serviceText] ?? ''} ${
      generateBreadcrumbEntry(query, constantGenerator(services).urlParams.serviceText, cityName)
        ?.cityname ?? ''
    }`;
    breadCrumbs[constantGenerator(services).baseUrl] = {
      fa: serviceValue ?? '',
    };
    breadCrumbs[key] = { fa: value ?? '' };
  }
  return breadCrumbs;
};

/**
 * Generates breadcrumb and schema objects based on the provided URL, query, and optional city and hotel names.
 * Determines the appropriate paths to use based on the URL and service type.
 *
 * @param {string} url - The URL representing the current path.
 * @param {ParsedUrlQuery} query - Query parameters extracted from the URL.
 * @param {string} [cityName] - Optional city name for tour context.
 * @param {string} [hotelName] - Optional hotel name for hotel context.
 * @returns {breadCrumbModel} - Object containing breadcrumb and schema objects.
 */

export const breadCrumbGenerator = (
  url: string,
  query: ParsedUrlQuery,
  cityName?: string,
  hotelName?: string,
) => {
  const generatedObjects: breadCrumbModel = {
    breadCrumb: undefined,
    schema: undefined,
  };
  const urlParams = url.split('/', 4);
  let paths: breadCrumbObjectModel = {};

  // check if url for using in other env except production
  if (productionEnvironments(urlParams[0])) {
    paths = {
      ...productionPaths,
    };
  } else {
    paths = {
      ...localPaths,
    };
  }

  const keyValueObjetc = generateKeyValue(urlParams, query, cityName, hotelName);
  generatedObjects.breadCrumb = {
    ...keyValueObjetc,
    ...paths,
  };
  return generatedObjects;
};

/**
 * Generates breadcrumb and schema objects based on the provided URL, query, and optional city and hotel names.
 * Determines the appropriate paths to use based on the URL and service type.
 *
 * @param {string} url - The URL representing the current path.
 * This function checks if a given URL contains any of the paths
 * in the excludedList array. It returns true if the URL contains any
 * of these paths, and false otherwise.
 */

export const isExcludedPathPresent = (url: string): boolean => {
  return excludedList.some((excludedPath) => url.includes(excludedPath));
};

/**
 * Generates a full URL based on the provided fullPath.
 * If the fullPath includes 'tourism/hotel/detail', it replaces it with 'tourism/hotel'.
 * If the fullPath contains 'localhost', it returns an HTTP URL, otherwise it returns an HTTPS URL.
 */
export const hrefGenerator = (fullPath: string): string => {
  let path = fullPath;
  if (fullPath.includes('tourism/hotel/detail')) {
    path = fullPath.replace('tourism/hotel/detail', 'tourism/hotel');
  }
  if (fullPath.includes('tourism/tour/detail')) {
    path = fullPath.replace('tourism/tour/detail', 'tourism/tour');
  }
  return fullPath.includes('localhost') ? `http://${path}` : `https://${path}`;
};
