import { ParsedUrlQuery } from 'querystring';
import {
  getDomFlightFullQuery,
  getIntFlightFullQuery,
} from 'containers/landingPage/utility/helper';

const isFullQuery = (pathName: string, query: ParsedUrlQuery | undefined) => {
  // TODO: use regex
  const pathsToRedirect = ['/flights/[id]'];

  if (pathsToRedirect.includes(pathName)) {
    return query && Object.keys(query).length === 1 && query.id ? null : true;
  }

  return true;
};

const getFullQuery = (serviceName: string) => {
  const getQuery = {
    flights: getDomFlightFullQuery,
    international: getIntFlightFullQuery,
  }[serviceName];

  return getQuery?.();
};

export { isFullQuery, getFullQuery };
