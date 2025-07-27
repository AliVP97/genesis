import { Dispatch, SetStateAction, useState } from 'react';

import { useRouter } from 'next/router';
import dayjs from 'dayjs';
import queryString from 'query-string';

import { TCalendarSystem } from 'containers/datepicker/datepicker/types';
import { DateState } from 'containers/datepicker/selectDate';
import { removeCookie } from 'utils/helpers/coockieHelper';
import { busUpdateLastSearchStorage } from 'utils/helpers/localstorageHelper';
import { notify } from 'utils/notification';
import WEB from 'utils/routes/web';
import { TLocation, TLocationHistory } from '../types';
import { searchBusValidate } from '../utils';

type TUseHandleSearch = {
  location: TLocation;
  date: DateState;
  setLocationHistory: Dispatch<SetStateAction<TLocationHistory | undefined>>;
  calendarSystem: TCalendarSystem;
};

export const useHandleSearch = ({
  location,
  date,
  setLocationHistory,
  calendarSystem,
}: TUseHandleSearch) => {
  const { push } = useRouter();
  const [searchButtonClicked, setSearchButtonClicked] = useState(false);

  const pushSearch = async () => {
    const queryObject: {
      departureDate: string;
      sort: string;
    } = {
      departureDate: dayjs(date.from).calendar('jalali').format('YYYY-MM-DD'),
      sort: 'earliestTime',
    };

    if (location?.origin?.seoCode && location?.destination?.seoCode) {
      void push({
        pathname: WEB.BUS + location.origin.seoCode + '-' + location.destination.seoCode,
        query: queryString.stringify(queryObject),
      });
    }
  };

  const submitSearch = () => {
    try {
      setSearchButtonClicked(true);
      searchBusValidate(location, date.from);
      busUpdateLastSearchStorage({
        origin: location.origin,
        destination: location.destination,
        departureDate: dayjs(date.from).format('YYYY-MM-DD'),
        calendarSystem: calendarSystem,
      });
      removeCookie('uuid');
      pushSearch();

      setLocationHistory(JSON.parse(localStorage.bus_last_search || '[]'));
    } catch (error) {
      notify({
        config: {
          position: 'bottom-right',
          autoClose: false,
          hideProgressBar: true,
        },
        message: (error as Error).message,
        type: 'warning',
      });
    }
  };

  return {
    submitSearch,
    pushSearch,
    searchButtonClicked,
    setSearchButtonClicked,
  };
};
