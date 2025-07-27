export const LOCATION_TYPES = {
  AIRPORT: 'airport',
  CITY: 'city',
} as const;

export const QUERY_LOCATION_TYPES = {
  AIRPORT: '0',
  CITY: '1',
} as const;

export const TRIP_TYPES = {
  ONE_WAY: 'oneway',
  ROUND_TRIP: 'round-trip',
} as const;

export const QUERY_TRIP_TYPES = {
  ONE_WAY: '1',
  ROUND_TRIP: '2',
} as const;

export const CABIN_TYPES = {
  UNDEFINED: 'CABIN_TYPE_UNDEFINED',
  ECONOMY: 'CABIN_TYPE_ECONOMY',
  PREMIUM: 'CABIN_TYPE_PREMIUM',
  BUSINESS: 'CABIN_TYPE_BUSINESS',
  FIRST: 'CABIN_TYPE_FIRST',
} as const;

export const QUERY_SORTS = {
  LOW_PRICE: 'lowPrice',
  EARLIEST_TIME: 'earliestTime',
  RECENT_TIME: 'recentTime',
  FAST: 'fast',
  PRICE: 'price',
} as const;
