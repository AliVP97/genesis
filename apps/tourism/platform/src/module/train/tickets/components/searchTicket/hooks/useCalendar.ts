import { useEffect, useState } from 'react';
import { useQuery } from 'react-query';

import { DateState } from 'containers/datepicker/selectDate';
import { TrainType } from 'module/train/tickets/interface';
import { getDaysPrices } from 'services/train/tickets';
import { useLastSearchCalendarSystem } from 'utils/hooks/useLastSearchCalendarSystem';
import { TInitialState } from '..';

type TUseCalendarProps = {
  date: DateState;
  trainType: TrainType;
  location: TInitialState;
};

export const useCalendar = ({ date, trainType, location }: TUseCalendarProps) => {
  const [isReturnCalendar, setIsReturnCalendar] = useState(false);

  const { calendarSystem, handleCalendarSystemChange } =
    useLastSearchCalendarSystem('train_last_search');

  const [getDaysPricesEnabled, setGetDaysPricesEnabled] = useState(false);

  const {
    data: daysPrices,
    refetch,
    isStale,
  } = useQuery(
    ['trainDaysPrice', location.origin.code, location.destination.code, isReturnCalendar],
    () =>
      isReturnCalendar
        ? getDaysPrices(location.destination.code, location.origin.code)
        : getDaysPrices(location.origin.code, location.destination.code),
    {
      enabled: getDaysPricesEnabled,
    },
  );

  const originDestinationNames = [location.origin.farsiName, location.destination.farsiName];
  const datepickerTitle = isReturnCalendar
    ? originDestinationNames.reverse().join(' - ')
    : originDestinationNames.join(' - ');

  const datePickerOpenHandler = () => {
    isStale && refetch();
  };

  useEffect(() => {
    location.origin.code && location.destination.code && setGetDaysPricesEnabled(true);
  }, [location]);

  const hasDepartureDate = Boolean(date.from);
  const hasReturningDate = Boolean(date.to);

  useEffect(() => {
    const isReturnCalendarVisible =
      trainType === 'roundTrip' && hasDepartureDate && !hasReturningDate;

    setIsReturnCalendar(isReturnCalendarVisible);
  }, [hasDepartureDate, hasReturningDate, trainType]);

  return {
    calendarSystem,
    handleCalendarSystemChange,
    daysPrices,
    datepickerTitle,
    datePickerOpenHandler,
  };
};
