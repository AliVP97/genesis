import { useRouter } from 'next/router';
import dayjs from 'dayjs';
import queryString from 'query-string';

import { TQueryObject } from 'module/hotel/ticketsSearchBox/interface';
import { removeCookie } from 'utils/helpers/coockieHelper';
import WEB from 'utils/routes/web';
import { TTrainSearchQuery } from 'module/train/search/utils';
import { useDomesticHotelSearch } from '../../containers/recentSearchCards/hooks/useDomesticHotelSearch';
import { THotelSearch } from '../helpers/localstorageHelper';
import { useExpireContext } from './useExpireContext';
import useInternationalFlightResetFilters from './useInternationalFlightResetFilters';

export const useResetFilters = () => {
  const router = useRouter();
  const { push, pathname, query } = router;
  const { uuidExpired, checkExpiry } = useExpireContext();
  const domesticHotelSearch = useDomesticHotelSearch();
  const { resetInternationalAction } = useInternationalFlightResetFilters();

  type FlightsQueryObject = {
    departureDate: string;
    adult: number;
    child: number;
    infant: number;
    returningDate?: string;
    sort: string;
    expired?: string | boolean;
  };

  type BusQueryObject = {
    departureDate: string;
    sort: string;
  };

  type LocalStorageQuery = FlightsQueryObject | TTrainSearchQuery | BusQueryObject;

  const localStorageQuery = (currentQuery: LocalStorageQuery): string | undefined => {
    if (Object.values(currentQuery).length > 1) {
      return queryString.stringify(currentQuery);
    } else return '';
  };

  const queryId = (origin: string, destination: string): string | undefined => {
    if (origin && destination) {
      return origin + '-' + destination;
    } else return '';
  };

  const resetFlightAction = () => {
    const lastSearch = JSON.parse(localStorage?.getItem('last_search') as string)?.[0];
    let queryObject: FlightsQueryObject = {
      ...lastSearch?.passenger,
      sort: 'lowPrice',
      departureDate: dayjs(lastSearch?.departureDate).calendar('jalali').format('YYYY-MM-DD'),
      returningDate: lastSearch?.returningDate
        ? dayjs(lastSearch?.returningDate).calendar('jalali').format('YYYY-MM-DD')
        : undefined,
    };
    if (pathname === '/flights/[id]') {
      queryObject = {
        ...queryObject,
        expired: query.hasOwnProperty('expired') ? query.expired === 'false' : true,
      };
    }
    localStorage.removeItem('reserve_expiry');
    const queryPath = queryId(lastSearch?.origin?.value, lastSearch?.destination?.value);
    const pushPage = () =>
      push(
        {
          pathname: WEB.DOMESTIC_SEARCH + queryPath,
          query: queryPath && localStorageQuery(queryObject),
        },
        undefined,
        { shallow: false },
      ).catch(() => {
        throw new Error('try it again');
      });
    if (uuidExpired) {
      removeCookie('uuid');
      checkExpiry({ type: 'uuid', expired: false });
      pushPage();
    } else {
      checkExpiry({ type: 'reserve', expired: false });
      pushPage();
    }
  };

  const resetTrainAction = () => {
    const lastSearch = JSON.parse(localStorage?.getItem('train_last_search') as string)?.[0];
    const queryObject: TTrainSearchQuery = {
      ...lastSearch?.passenger,
      sort: 'lowPrice',
      departureDate: dayjs(lastSearch?.departureDate).calendar('jalali').format('YYYY-MM-DD'),
      returningDate: lastSearch?.returningDate
        ? dayjs(lastSearch?.returningDate).calendar('jalali').format('YYYY-MM-DD')
        : undefined,
      wantCompartment: lastSearch?.wantCompartment,
      gender: lastSearch?.genderCompartment,
    };
    localStorage.removeItem('reserve_expiry');
    const queryPath = queryId(
      lastSearch?.origin?.englishName,
      lastSearch?.destination?.englishName,
    );
    const pushPage = () =>
      void push(
        {
          pathname: WEB.TRAIN + queryPath,
          query: queryPath && localStorageQuery(queryObject),
        },
        undefined,
        { shallow: false },
      );
    if (uuidExpired) {
      removeCookie('uuid');
      checkExpiry({ type: 'uuid', expired: false });
      pushPage();
    } else {
      checkExpiry({ type: 'reserve', expired: false });
      pushPage();
    }
  };
  const resetBusAction = () => {
    const lastSearch = JSON.parse(localStorage?.getItem('bus_last_search') as string)?.[0];
    const queryObject: BusQueryObject = {
      sort: 'earliestTime',
      departureDate: dayjs(lastSearch?.departureDate).calendar('jalali').format('YYYY-MM-DD'),
    };
    localStorage.removeItem('reserve_expiry');
    const queryPath = queryId(lastSearch?.origin?.seoCode, lastSearch?.destination?.seoCode);
    const pushPage = () =>
      void push(
        {
          pathname: WEB.BUS + queryPath,
          query: queryPath && localStorageQuery(queryObject),
        },
        undefined,
        { shallow: false },
      );
    if (uuidExpired) {
      removeCookie('uuid');
      checkExpiry({ type: 'uuid', expired: false });
      pushPage();
    } else {
      checkExpiry({ type: 'reserve', expired: false });
      pushPage();
    }
  };
  const resetHotelAction = () => {
    const localStorageData = localStorage.getItem('hotel_last_search');

    const search: THotelSearch | null = localStorageData && JSON.parse(localStorageData)?.[0];

    let selectedRooms = '';
    search?.passenger.forEach((item) => {
      selectedRooms =
        selectedRooms +
        (selectedRooms ? '-' : '') +
        Array.from({ length: item.adult }, () => 'A').toString();
      if (item?.child.length > 0)
        selectedRooms = selectedRooms + '___' + item?.child?.map((x) => x.value).toString();
      return selectedRooms;
    });
    const queryObject: TQueryObject = {
      checkInDate: dayjs(search?.departureDate).calendar('jalali').format('YYYY-MM-DD'),
      checkOutDate: dayjs(search?.returningDate).calendar('jalali').format('YYYY-MM-DD'),
      rooms: selectedRooms,
      destinationType: search?.origin?.type?.id ? search?.origin?.type?.id : 'city',
      requestId: search?.origin?.value || '',
      cityEng: search?.origin.cityEng,
      cityName: search?.origin.city,
      cityId:
        search?.origin?.type?.id == 'city' ? search?.origin.value : search?.origin.data?.cityId,
      sort: 'offer',
    };
    localStorage.removeItem('reserve_expiry');
    if (uuidExpired) {
      removeCookie('uuid');
      checkExpiry({ type: 'uuid', expired: false });
      if (search?.origin?.type?.id == 'city') {
        void push(
          {
            pathname: WEB.HOTEL + search?.origin.cityEng,

            query: queryString.stringify(queryObject) + '&readCache=true',
          },
          undefined,
          { shallow: true },
        );
      } else {
        if (queryObject) {
          domesticHotelSearch(queryObject);
        }
      }
    } else {
      checkExpiry({ type: 'reserve', expired: false });
      void push(
        {
          pathname: WEB.HOTEL + search?.origin.value,
          query: queryString.stringify(queryObject),
        },
        undefined,
        { shallow: false },
      );
    }
  };

  return {
    resetFlightAction,
    resetTrainAction,
    resetBusAction,
    resetHotelAction,
    resetInternationalAction,
  };
};
