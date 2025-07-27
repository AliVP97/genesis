import { QueryLocationType } from 'module/internationalFlight/search/types/common';

export type SearchLocationQuery = {
  iataCode: string;
  locationType: QueryLocationType;
};
