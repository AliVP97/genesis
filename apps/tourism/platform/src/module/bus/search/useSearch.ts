import { useEffect } from 'react';

import { TCalendarSystem } from 'containers/datepicker/datepicker/types';
import { DateState } from 'containers/datepicker/selectDate';
import { useIsSuperApp } from 'utils/hooks/useIsSuperApp';
import { useRouteChange } from 'utils/hooks/useRouteChange';
import { useForm, useLocation, useSearchComponentProps, useSearchHistory } from './hooks';
import { useHandleSearch } from './hooks/useHandleSearch';

type TUseSearchProps = { date: DateState; calendarSystem: TCalendarSystem };

export const useSearch = ({ date, calendarSystem }: TUseSearchProps) => {
  const { activeInput, nextInput } = useForm();

  const { location, submitLocation } = useLocation({
    onSubmit: (value) => {
      if (value.origin.stationCode && value.destination.stationCode && !date.from) {
        nextInput('datepicker');
      }
    },
  });

  const { locationHistory, setLocationHistory, onClearLocationHistory } = useSearchHistory();

  const { submitSearch, searchButtonClicked, setSearchButtonClicked } = useHandleSearch({
    location,
    date,
    setLocationHistory,
    calendarSystem,
  });

  const componentProps = useSearchComponentProps({
    location,
    submitLocation,
    locationHistory,
    onClearLocationHistory,
  });

  const isSuperApp = useIsSuperApp();

  const { routeChangeStarted, routeChangeCompleted } = useRouteChange();

  useEffect(() => {
    if (routeChangeCompleted && searchButtonClicked) {
      setSearchButtonClicked(false);
    }
  }, [routeChangeCompleted]);

  return {
    isSuperApp,
    componentProps,
    location,
    activeInput,
    calendarSystem,
    submitSearch,
    searchButtonClicked,
    routeChangeStarted,
  };
};
