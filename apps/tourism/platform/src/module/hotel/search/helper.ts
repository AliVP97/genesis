import { ParsedUrlQuery } from 'querystring';

export const checkQueryDiff = (currentQuery: ParsedUrlQuery, prevQuery: ParsedUrlQuery | null) => {
  if (!prevQuery) return true;
  if (currentQuery?.id !== prevQuery?.id) return true;
  if (currentQuery?.rooms !== prevQuery?.rooms) return true;
  if (currentQuery?.cityId !== prevQuery?.cityId) return true;
  if (currentQuery?.cityName !== prevQuery?.cityName) return true;
  if (currentQuery?.hotelId !== prevQuery?.hotelId) return true;
  if (currentQuery?.checkInDate !== prevQuery?.checkInDate) return true;
  if (currentQuery?.checkOutDate !== prevQuery?.checkOutDate) return true;
  return false;
};
