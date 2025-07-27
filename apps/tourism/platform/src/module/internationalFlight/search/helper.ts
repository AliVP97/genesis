import { ParsedUrlQuery } from 'querystring';

export const checkQueryDiff = (currentQuery: ParsedUrlQuery, prevQuery: ParsedUrlQuery | null) => {
  if (!prevQuery) return true;
  if (currentQuery?.departureDate !== prevQuery?.departureDate) return true;
  if (currentQuery?.returningDate !== prevQuery?.returningDate) return true;
  if (
    currentQuery?.child !== prevQuery?.child ||
    currentQuery?.infant !== prevQuery?.infant ||
    currentQuery?.adult !== prevQuery?.adult
  )
    return true;
  if (currentQuery?.cabinType != prevQuery?.cabinType) return true;
  if (currentQuery?.id !== prevQuery?.id) return true;

  /**
   * Determine if the origin or destination has changed or not when which of
   * them is 1 is to use the airport code and otherwise for all_airports.
   */
  const isOriginDestSame =
    currentQuery?.originType !== prevQuery?.originType ||
    currentQuery?.destinationType !== prevQuery?.destinationType;

  if (isOriginDestSame) {
    return true;
  }

  return false;
};
