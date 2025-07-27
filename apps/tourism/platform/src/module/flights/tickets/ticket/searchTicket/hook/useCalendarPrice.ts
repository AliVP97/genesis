import { TDaysPrices } from 'services/domestic/flight/interface';
import { useRef, useState, useEffect, useCallback } from 'react';
import useDeviceDetect from 'utils/hooks/useDeviceDetect';
import { useQuery } from 'react-query';
import { State as TMonthAndYear } from 'containers/datepicker/datepicker';
import moment from 'moment-jalaali';
import uniqueObjectsArray from 'utils/helpers/uniqueObjectArray';
import { useAppDispatch, useAppSelector } from 'store/hook/storeHook';
import { getDaysPrices } from 'services/domestic/flight';
import { FlightType } from '../index';
import { DateState } from 'containers/datepicker/selectDate';
import { selectMobileCalendarObservedDate } from 'store/slices/app/selectors/calendars';
import {
  desktopCalendarAllowedToNavigateChanged,
  mobileCalendarObservedDateChanged,
} from 'store/slices/app/app';

const currentTime = new Date().getTime();
let day = new Date().getDate();
let jalaliDateMonthEnd = 0;
let daysPricesInfo: TDaysPrices | undefined = [];
let jalaliDateMonthStart = 0;
let calendarYear = 0;
let calendarMonth = 0;
type MobileRequestQueue = { year: number; month: number };
const mobileRequestQueue: MobileRequestQueue[] = [];

type ExistingMonthsType = {
  [year: number]: {
    [month: number]: boolean;
  };
};

type CalenderPriceDates = {
  origin?: { data: TDaysPrices };
  destination?: { data: TDaysPrices };
  existingMonths?: ExistingMonthsType;
};

interface Location {
  origin: { value: string; city: string };
  destination: { value: string; city: string };
}

const useCalendarPrice = (flightType: FlightType, location: Location, date: DateState) => {
  const { isMobile } = useDeviceDetect();
  const [calenderPriceDates, setCalenderPriceDates] = useState<CalenderPriceDates>({});
  const [daysPrices, setDaysPrices] = useState<TDaysPrices>([]);
  const dispatch = useAppDispatch();
  const selectMonthAndYear = useAppSelector(selectMobileCalendarObservedDate);
  const initialCalendarData = useRef({
    todayDate: {},
    origin: false,
    destination: false,
  });
  const [departureGetDaysPricesEnabled, setDepartureGetDaysPricesEnabled] = useState(false);
  const [returningGetDaysPricesEnabled, setReturningGetDaysPricesEnabled] = useState(false);

  //Call the Calendar api to get min prices of DEPARTURE, the below api calls when any click on calendar day or calendar navigation button happen
  useQuery(
    'domesticFlightDaysPriceDeparture',
    () =>
      getDaysPrices(
        location.origin.value,
        location.destination.value,
        Math.floor(jalaliDateMonthStart / 1000),
        Math.floor(jalaliDateMonthEnd / 1000),
      ),
    {
      enabled: departureGetDaysPricesEnabled,
      onSuccess: (departureDaysPrices) => {
        setCalenderPriceDates((prev) => {
          const newData = Array.isArray(departureDaysPrices?.calendarData)
            ? departureDaysPrices.calendarData
            : [];

          const mergedData = [...(prev.origin?.data || []), ...newData];
          const uniqueData = uniqueObjectsArray(mergedData, `gregorianDepartureDate`);
          return {
            ...prev,
            existingMonths: {
              ...prev?.existingMonths,
              [calendarYear]: {
                ...prev?.existingMonths?.[calendarYear],
                [calendarMonth]: true,
              },
            },
            origin: {
              ...prev.origin,
              data: uniqueData,
            },
          };
        });
        setDepartureGetDaysPricesEnabled(false);
        if (flightType === 'roundTrip') setReturningGetDaysPricesEnabled(true);
        if (isMobile) {
          setTimeout(() => {
            mobileRequestQueue.shift();
            if (mobileRequestQueue.length > 0) {
              updateCalenderPriceDates(mobileRequestQueue[0].year, mobileRequestQueue[0].month);
            }
          }, 200);
        }

        //call the calendar data price for the second time in the first initial render
        if (!initialCalendarData.current.origin && !isMobile && flightType === 'oneWay') {
          initialCalendarData.current.origin = true;
        }
      },
      onSettled: () => {
        if (flightType === 'oneWay') dispatch(desktopCalendarAllowedToNavigateChanged(true));
      },
    },
  );

  useEffect(() => {
    if (initialCalendarData.current.origin) {
      handleMonthChange(initialCalendarData.current.todayDate as TMonthAndYear);
    }
  }, [initialCalendarData.current.origin]);

  //Call the Calendar api to get min prices of RETURNING, the below api calls when any click on calendar day or calendar navigation button happen
  useQuery(
    'domesticFlightDaysPriceReturning',
    () =>
      getDaysPrices(
        location.destination.value,
        location.origin.value,
        Math.floor(jalaliDateMonthStart / 1000),
        Math.floor(jalaliDateMonthEnd / 1000),
      ),
    {
      enabled: returningGetDaysPricesEnabled,
      onSuccess: (returningDaysPrices) => {
        setCalenderPriceDates((prev) => {
          const newData = Array.isArray(returningDaysPrices?.calendarData)
            ? returningDaysPrices.calendarData
            : [];

          const mergedData = [...(prev.destination?.data || []), ...newData];
          const uniqueData = uniqueObjectsArray(mergedData, `gregorianDepartureDate`);
          return {
            ...prev,
            destination: {
              ...prev.destination,
              data: uniqueData,
            },
          };
        });
        setReturningGetDaysPricesEnabled(false);

        //call the calendar data price for the second time in the first initial render
        if (!initialCalendarData.current.destination && !isMobile) {
          initialCalendarData.current.destination = true;
        }
      },
      onSettled: () => {
        dispatch(desktopCalendarAllowedToNavigateChanged(true));
      },
    },
  );

  useEffect(() => {
    if (initialCalendarData.current.destination) {
      handleMonthChange(initialCalendarData.current.todayDate as TMonthAndYear);
    }
  }, [initialCalendarData.current.destination]);

  const gregorianDateConvert = (month: number, year: number) => {
    month = month + 1;
    if (month === 13) {
      month = 1;
      ++year;
    }
    let gregorianDate = moment(`${year}-${month}-${day}`, 'YYYY-MM-DD');
    if (!gregorianDate.isValid()) {
      day = moment([year, month - 1])
        .endOf('month')
        .date();
      gregorianDate = moment(`${year}-${month}-${day}`, 'YYYY-MM-DD');
    }
    const jalaliYear = gregorianDate.jYear();
    const jalaliMonth = gregorianDate.jMonth();
    return { jalaliYear, jalaliMonth };
  };

  //when the api of calendarDate gets called, the below useEffect runs to find the departure or returning prices should show
  useEffect(() => {
    if (location.origin?.value && location.destination?.value) {
      if (flightType === 'roundTrip') {
        if (date.from && !date.to) {
          daysPricesInfo = calenderPriceDates?.destination?.data;
        } else {
          daysPricesInfo = calenderPriceDates?.origin?.data;
        }
      } else {
        daysPricesInfo = calenderPriceDates?.origin?.data;
      }
    } else {
      daysPricesInfo = [];
    }
    setDaysPrices(daysPricesInfo || []);
  }, [calenderPriceDates, date.from, date.to]);

  useEffect(() => {
    initialCalendarData.current.origin = false;
    initialCalendarData.current.destination = false;
    dispatch(mobileCalendarObservedDateChanged({ month: -1, year: 0 }));
    setCalenderPriceDates({});
  }, [location.origin?.value, location.destination?.value]);

  useEffect(() => {
    if (flightType === 'roundTrip') {
      initialCalendarData.current.origin = false;
      initialCalendarData.current.destination = false;
      dispatch(mobileCalendarObservedDateChanged({ month: -1, year: 0 }));
      setCalenderPriceDates({});
    }
  }, [flightType]);

  const updateCalenderPriceDates = (year: number, month: number) => {
    if (!calenderPriceDates?.existingMonths?.[year]?.[month]) {
      calendarYear = year;
      calendarMonth = month;
      jalaliDateMonthStart = moment(`${year}-${month + 1}-1`, 'jYYYY-jM-jD')
        .parseZone()
        .valueOf();
      jalaliDateMonthEnd =
        moment(jalaliDateMonthStart).add(1, 'jMonth').startOf('day').parseZone().valueOf() - 1;
    } else {
      return;
    }
    dispatch(desktopCalendarAllowedToNavigateChanged(false));
    setDepartureGetDaysPricesEnabled(true);
  };

  //Only in mobile mode, when calendar scrolls,the following function gets called
  useEffect(() => {
    const passCondition =
      !location.origin?.value ||
      !location.destination?.value ||
      !isMobile ||
      selectMonthAndYear.month === -1;
    if (passCondition) {
      return;
    }
    if (!calenderPriceDates.existingMonths) {
      jalaliDateMonthStart = 0;
    }
    let { month, year } = selectMonthAndYear;

    //when the calendar changes to gregorian type
    if (year > 2000) {
      const { jalaliMonth, jalaliYear } = gregorianDateConvert(month, year);
      year = jalaliYear;
      month = jalaliMonth;
    }
    mobileRequestQueue.push({ year: year, month: month });
    year = mobileRequestQueue[0].year;
    month = mobileRequestQueue[0].month;
    updateCalenderPriceDates(year, month);
  }, [selectMonthAndYear.month]);

  //Only in desktop mode, when calendar gets open and goes next or back months by arrow icons, the following function gets called
  const handleMonthChange = useCallback(
    (e: TMonthAndYear) => {
      if (!location.origin?.value || !location.destination?.value || isMobile) {
        return;
      }
      if (!calenderPriceDates.existingMonths) {
        jalaliDateMonthStart = 0;
      }
      initialCalendarData.current.todayDate = e;
      //that's to display price 2 months on calendar
      let { year, month } = e as TMonthAndYear;

      //when the calendar changes to gregorian type
      if (year > 2000) {
        const { jalaliMonth, jalaliYear } = gregorianDateConvert(month, year);
        year = jalaliYear;
        month = jalaliMonth;
      }

      if (calenderPriceDates.existingMonths) {
        month = month + 1;
      }
      if (month === 12) {
        month = 0;
        year = year + 1;
      }

      const todayDate = moment(currentTime).format('jYYYY-jMM').replace('-', '');
      const calendarDateDisplay =
        year?.toString() +
        ((month + 1).toString().length === 1
          ? '0' + (month + 1).toString()
          : (month + 1).toString());
      if (calendarDateDisplay < todayDate) {
        return;
      }

      updateCalenderPriceDates(year, month);
    },
    [calenderPriceDates],
  );

  return {
    handleMonthChange,
    daysPrices,
  };
};
export default useCalendarPrice;
