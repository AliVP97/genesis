import { ParsedUrlQuery } from 'querystring';

export const checkQueryDiff = (currentQuery: ParsedUrlQuery, prevQuery: ParsedUrlQuery | null) => {
  if (!prevQuery) return true;
  if (currentQuery?.departureDate !== prevQuery?.departureDate) return true;
  if (currentQuery?.id !== prevQuery?.id) return true;
  return false;
};
