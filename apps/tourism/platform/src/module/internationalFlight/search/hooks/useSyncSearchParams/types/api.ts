import { components } from 'types/international-flight';

/**
 * Api response for airport search
 */
export type SearchAirportsResponse =
  components['schemas']['InternationalFlightPb.SearchAirportsResponse'];

export type SearchAirportsResponseResult =
  components['schemas']['InternationalFlightPb.SearchAirportsResponse_Types_AirportSearchResult'];

export type SearchAirportIataType =
  components['schemas']['InternationalFlightPb.IATA_Types_IATAType'];
