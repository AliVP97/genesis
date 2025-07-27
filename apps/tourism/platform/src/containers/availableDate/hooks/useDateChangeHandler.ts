import { useCallback } from 'react';

import moment from 'moment-jalaali';
import queryString from 'query-string';
import { useRouter } from 'next/router';

import { BusParams, FlightInternationalParams, FlightParams } from 'utils/interface';
import { ServiceDetector } from 'utils/helpers/serviceDetector';
import WEB from 'utils/routes/web';
import {
  busUpdateLastSearchStorage,
  hotelUpdateLastSearchStorage,
  internationalFlightUpdateLastSearchStorage,
  updateLastSearchStorage,
} from 'utils/helpers/localstorageHelper';
import getServicesTabOffsetTop from 'utils/helpers/servicesTabScrollTopPosition';
import { useAppDispatch } from 'store/hook/storeHook';
import { scrollHandler } from 'store/slices/domestic-flights/mainPageScrollPlace';
import { trainSearchQuery } from 'module/train/search/helper';
import getTimeStamp from '../utils/getTimeStamp';
import DateType from '../types/DateType';

function getLocalStorageKey(service: string) {
  if (service === 'international') {
    return 'international_flight_last_search';
  }

  if (service === 'flights') {
    return 'last_search';
  }

  return service + '_last_search';
}

const serviceUrls = {
  flights: WEB.DOMESTIC_SEARCH,
  train: WEB.TRAIN,
  bus: WEB.BUS,
  international: WEB.INTERNATIONAL,
  hotel: WEB.HOTEL,
};

const lastSearchHandler = {
  flights: updateLastSearchStorage,
  international: internationalFlightUpdateLastSearchStorage,
  train: () => {
    return;
  },
  bus: busUpdateLastSearchStorage,
  hotel: hotelUpdateLastSearchStorage,
};

type QueryParams = Record<string, string | undefined>;

const filterQueryParams = (query: QueryParams, allowedParams: string[]) => {
  const filteredQuery: QueryParams = {};
  allowedParams.forEach((param) => {
    if (query[param] !== undefined) {
      filteredQuery[param] = query[param];
    }
  });

  return filteredQuery;
};

type Query = {
  id: string;
  departureDate: string;
  returningDate: string | undefined;
};

export default function useDateChangeHandler(
  disable: boolean,
  returning: boolean | undefined,
  onActiveDateChange: (date: DateType) => void,
) {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const service = ServiceDetector();
  const { query } = router;
  const { id } = router.query as Query;

  const onDateChange = useCallback(
    (date: DateType) => () => {
      if (disable) {
        return;
      }

      const key = getLocalStorageKey(service);
      const handlerFn = lastSearchHandler[service as keyof typeof lastSearchHandler];

      const timeStamp = getTimeStamp(date.date as string);
      const today = new Date().setHours(0, 0, 0, 0);

      if (timeStamp < today) {
        return;
      }

      const lastSearch = JSON.parse(localStorage.getItem(key) as string)?.[0];

      onActiveDateChange(date);
      let newQuery = { ...query } as QueryParams;

      const departureDate = getTimeStamp(query.departureDate as string);
      const returningDate = query.returningDate
        ? getTimeStamp(query.returningDate as string)
        : null;

      if (returning) {
        if (!returningDate || timeStamp < departureDate) return;

        handlerFn({
          ...lastSearch,
          returningDate: moment(date.date!.split('-').join('/'), 'jYYYY/jMM/jDD').format(
            'YYYY-MM-DD',
          ),
        });
        newQuery = {
          ...newQuery,
          returningDate: date.date,
          departureFlightId: query.departureFlightId as string,
        };
      } else {
        handlerFn({
          ...lastSearch,
          departureDate: moment(date.date!.split('-').join('/'), 'jYYYY/jMM/jDD').format(
            'YYYY-MM-DD',
          ),
        });

        newQuery = {
          ...newQuery,
          departureDate: date.date,
        };
      }

      let filteredQuery = {};
      if (service === 'flights') {
        filteredQuery = filterQueryParams(newQuery, Object.values(FlightParams));
      } else if (service === 'bus') {
        filteredQuery = filterQueryParams(newQuery, Object.values(BusParams));
      } else if (service === 'train') {
        filteredQuery = filterQueryParams(newQuery, Object.keys(trainSearchQuery.baseSchema.shape));
      } else if (service === 'international') {
        filteredQuery = filterQueryParams(newQuery, Object.values(FlightInternationalParams));
      }

      const serviceName = serviceUrls[service as keyof typeof serviceUrls];

      if (id) {
        const url = {
          pathname: serviceName + id,
          query: queryString.stringify({ ...filteredQuery }),
        };
        router.push(url, undefined, { scroll: false }).then(() => {
          if (service === 'flights') {
            dispatch(scrollHandler({ status: false }));
            setTimeout(() => {
              getServicesTabOffsetTop();
            }, 100);
          }
        });
      }
    },
    [disable, id, onActiveDateChange, query, returning, router, service],
  );

  return { onDateChange };
}
