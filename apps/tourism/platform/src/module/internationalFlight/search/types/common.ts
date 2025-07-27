import { z } from 'zod';
import internationalFlightQuerySchema from '../constants/internationalFlightQuerySchema';
import {
  CABIN_TYPES,
  LOCATION_TYPES,
  QUERY_LOCATION_TYPES,
  QUERY_SORTS,
  QUERY_TRIP_TYPES,
  TRIP_TYPES,
} from '../constants/common';

export type InternationalFlightSearchQuery = z.infer<typeof internationalFlightQuerySchema>;

export type InternationalFlightSearchParams = {
  id: string;
};

export type LocationType = (typeof LOCATION_TYPES)[keyof typeof LOCATION_TYPES];

export type QueryLocationType = (typeof QUERY_LOCATION_TYPES)[keyof typeof QUERY_LOCATION_TYPES];

export type Location = {
  type: LocationType;
  iataCode: string;
  title: string;
  city: string;
};

export type TripType = (typeof TRIP_TYPES)[keyof typeof TRIP_TYPES];

export type QueryTripType = (typeof QUERY_TRIP_TYPES)[keyof typeof QUERY_TRIP_TYPES];

export type SearchQuery = {
  adult: string;
  child: string;
  infant: string;
  sort: QuerySort;
  cabinType: CabinType;
  returningDate?: string;
  departureDate: string;
  tripMode: QueryTripType;
  originType: QueryLocationType;
  destinationType: QueryLocationType;
};

export type CabinType = (typeof CABIN_TYPES)[keyof typeof CABIN_TYPES];

export type QuerySort = (typeof QUERY_SORTS)[keyof typeof QUERY_SORTS];
