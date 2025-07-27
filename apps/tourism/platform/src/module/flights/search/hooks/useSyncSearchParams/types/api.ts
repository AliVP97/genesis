import { definitions } from 'types/domestic-flight-aggregator';

/**
 * Api response for airport search
 */
export type SearchAirportsResponse = definitions['aggregatorAirportSearchResponse'];

export type SearchAirportsResponseResult = NonNullable<SearchAirportsResponse['airports']>[number];
