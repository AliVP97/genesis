import { QueryType } from 'utils/helpers/global';

/**
 * List of filter keys that should be removed from the query.
 */
const QUERY_FILTER_KEYS = [
  'priceRange',
  'departureDuration',
  'departureTime',
  'departureStops',
  'airlines',
  'ticketType',
];

/**
 * Creates a new query and pushes it to the router with the given state. It
 * removes all keys belong to the filter keys from the query.
 *
 * @param query original query with extra filter keys
 * @returns new query without filter keys
 */
export default function getQueryWithoutFilterKeys(query: QueryType): QueryType {
  const rawQuery: Record<string, string> = {};

  for (const key in query as QueryType) {
    if (!QUERY_FILTER_KEYS.includes(key)) {
      rawQuery[key] = query[key] as string;
    }
  }

  return rawQuery;
}
