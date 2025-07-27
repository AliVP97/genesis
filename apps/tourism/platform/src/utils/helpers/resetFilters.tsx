import Router from 'next/router';
import moment from 'moment-jalaali';
import { stringify, ParsedUrlQuery } from 'querystring';

import { TTrainSearchQuery } from 'module/train/search/utils';
import { trainSearchQuery } from 'module/train/search/helper';
import { CompartmentGenderType } from 'services/train/tickets/interface';
import WEB from 'utils/routes/web';

export const resetFilters = (query: ParsedUrlQuery, push: typeof Router.push, flag?: string) => {
  const location = (query?.id as string)?.split('-');
  const service = Router.pathname === '/' ? 'flights' : Router.pathname.substr(1);
  // Convert undefined values to an empty string
  const convertUndefinedToEmpty = (
    obj: Record<string, string | number | string[] | undefined | boolean>,
  ) => Object.fromEntries(Object.entries(obj).filter(([, v]) => Boolean(v)));

  let defaultQuery = convertUndefinedToEmpty({
    adult: query?.adult || 1,
    infant: query?.infant || 0,
    child: query?.child || 0,
    departureDate: query?.departureDate || moment().format('jYYYY-jMM-jDD'),
    returningDate: query.returningDate ? query.returningDate : undefined,
    sort: 'lowPrice',
    departureFlightId: query?.departureFlightId,
  });
  if (flag === 'roundTrip') {
    defaultQuery = { tripType: '1', ...defaultQuery };
  }
  const trainDefaultQuery: TTrainSearchQuery = trainSearchQuery.parse({
    adult: query.adult,
    infant: query.infant,
    child: query.child,
    departureDate: query.departureDate,
    returningDate: query.returningDate ? query.returningDate : undefined,
    wantCompartment: query?.wantCompartment === 'true',
    gender: query.gender as CompartmentGenderType,
    sort: 'lowPrice',
  });

  push(
    {
      pathname: service.includes('flights')
        ? WEB.DOMESTIC_SEARCH + location[0] + '-' + location[1]
        : WEB.TRAIN + location[0] + '-' + location[1],
      query: stringify(service.includes('flights') ? defaultQuery : trainDefaultQuery),
    },
    undefined,
    { shallow: true },
  ).catch(() => {
    throw new Error('try it again');
  });
};
