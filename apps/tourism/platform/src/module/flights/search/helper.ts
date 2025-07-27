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
  if (currentQuery?.id !== prevQuery?.id) return true;
  return false;
};
