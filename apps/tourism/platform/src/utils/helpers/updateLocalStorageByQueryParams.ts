import moment from 'moment-jalaali';
import { iataToFarsi } from '../static/flightStatics';
import { updateLastSearchStorage } from './localstorageHelper';
import { toast } from 'react-toastify';
import { NextRouter } from 'next/router';
import { TCalendarSystem } from 'containers/datepicker/datepicker/types';

let toastTimeout: ReturnType<typeof setTimeout> | null = null;
const ONE_DAY_IN_MS = 24 * 60 * 60 * 1000;

export default function updateLocalStorageByQueryParams(
  router: NextRouter,
  calendarSystem: TCalendarSystem,
) {
  function updateLocalStorage() {
    updateLastSearchStorage(flightInfo);
    //when departure date is sooner than today
    if (wrongDepartureDate) {
      router
        .push(
          {
            pathname: router.pathname,
            query: {
              ...router.query,
              departureDate: todayDepartureDatePersian,
            },
          },
          undefined,
          { scroll: false },
        )
        .catch(() => {
          throw new Error('try it again');
        });
    }
  }

  const flightPath: string[] = (router.query?.id as string).split('-') || [];

  // Convert Persian dates to Gregorian using moment
  let departureDateGregorian = router.query?.departureDate
    ? moment(router.query.departureDate, 'jYYYY-jMM-jDD').format('YYYY-MM-DD')
    : '';
  const returningDateGregorian = router.query?.returningDate
    ? moment(router.query.returningDate, 'jYYYY-jMM-jDD').format('YYYY-MM-DD')
    : '';

  let wrongDepartureDate = false;
  let NewDepartureDate = {};
  const todayDepartureDatePersian = moment(new Date().getTime()).format('jYYYY-jMM-jDD');

  let flightInfo = {
    departureDate: departureDateGregorian,
    returningDate: router.query?.returningDate ? returningDateGregorian : undefined,
    passenger: {
      adult: Number(router.query?.adult as string) || 1,
      child: Number(router.query?.child as string) || 0,
      infant: Number(router.query?.infant as string) || 0,
    },
    origin: {
      city: iataToFarsi?.[flightPath[0]] || '',
      value: flightPath[0] || '',
      airport: '',
    },
    destination: {
      city: iataToFarsi?.[flightPath[1]] || '',
      value: flightPath[1] || '',
      airport: '',
    },
    calendarSystem: calendarSystem,
  };

  let departureTime = new Date(departureDateGregorian);
  const returningTime = new Date(returningDateGregorian);
  if (
    new Date().getTime() > departureTime.getTime() + ONE_DAY_IN_MS - 1 ||
    departureDateGregorian === 'Invalid date'
  ) {
    departureDateGregorian = moment(new Date().getTime()).format('YYYY-MM-DD');
    flightInfo = {
      ...flightInfo,
      departureDate: departureDateGregorian,
    };
    departureTime = new Date();
    wrongDepartureDate = true;
  }

  if (router.query?.returningDate) {
    if (
      departureTime.getTime() > returningTime.getTime() ||
      returningDateGregorian === 'Invalid date'
    ) {
      //Update the local storage returningDate
      updateLastSearchStorage({
        ...flightInfo,
        returningDate: departureDateGregorian,
      });

      if (toastTimeout) {
        clearTimeout(toastTimeout);
      }

      toastTimeout = setTimeout(() => {
        toast.error('با توجه به تغییر تاریخ رفت انتخابی شما، تاریخ برگشت بروزرسانی شد');
      }, 1000);

      if (wrongDepartureDate) {
        //When The departure date is sooner than today and today is later than returning date
        NewDepartureDate = {
          departureDate: todayDepartureDatePersian,
          returningDate: todayDepartureDatePersian,
        };
      } else {
        //When the returning date is sooner than departure date
        NewDepartureDate = {
          returningDate: router.query.departureDate,
        };
      }
      router
        .push(
          {
            pathname: router.pathname,
            query: {
              ...router.query,
              ...NewDepartureDate,
            },
          },
          undefined,
          { scroll: false },
        )
        .catch(() => {
          throw new Error('try it again');
        });
    } else {
      updateLocalStorage();
    }
  } else {
    updateLocalStorage();
  }
}
