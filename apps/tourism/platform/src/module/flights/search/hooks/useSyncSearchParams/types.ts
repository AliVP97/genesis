import { IATA_TYPES } from './constants';
import { components } from 'types/international-flight';

export type IataType = (typeof IATA_TYPES)[keyof typeof IATA_TYPES];

export type SearchQuery = {
  id: string;
  originType: IataType;
  destinationType: IataType;
};

/**
 * Api response for airport search
 */
export type SearchAirportsResponse =
  components['schemas']['InternationalFlightPb.SearchAirportsResponse'];

export type SearchAirportsResponseResult =
  components['schemas']['InternationalFlightPb.SearchAirportsResponse_Types_AirportSearchResult'];

export type SearchAirportIataType =
  components['schemas']['InternationalFlightPb.IATA_Types_IATAType'];
