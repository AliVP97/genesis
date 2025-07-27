import { useEffect, useRef } from 'react';
import moment from 'moment-jalaali';
import { DESKTOP_SLIDE_SIZE, MOBILE_SLIDE_SIZE } from '../utils/resources';
import DateType from '../types/DateType';
import useDeviceDetect from 'utils/hooks/useDeviceDetect';
import { useRouter } from 'next/router';

function getToday(returning: undefined | boolean, departureDate: string) {
  if (returning) {
    return moment(departureDate, 'jYYYY-jMM-jDD').startOf('day');
  }

  return moment().startOf('day');
}

function getSlideDetails(isMobile: boolean | undefined, wrapper: HTMLDivElement) {
  let slideWidth: number;
  let moduleWidth: number;

  if (isMobile) {
    slideWidth = -MOBILE_SLIDE_SIZE;
    moduleWidth = window.innerWidth / 2;
  } else {
    slideWidth = -DESKTOP_SLIDE_SIZE;
    moduleWidth = wrapper?.clientWidth ? wrapper.clientWidth / 2 : 600;
  }

  const extraMovement = moduleWidth + slideWidth * 2 + slideWidth / 2;
  const leftScroll = slideWidth * 7 + extraMovement;
  return { slideWidth, extraMovement, leftScroll };
}

function getLeftScroll(isMobile: undefined | boolean, wrapper: HTMLDivElement, diffDays: number) {
  const { slideWidth, extraMovement, leftScroll } = getSlideDetails(isMobile, wrapper);

  if (diffDays < 9) {
    if (diffDays <= 1) {
      return 0;
    }

    if (diffDays === 2) {
      return extraMovement;
    }

    return slideWidth * (diffDays - 2) + extraMovement;
  }

  return leftScroll;
}

function getDayDiff(returning: undefined | boolean, departureDate: string, activeDate: DateType) {
  const today = getToday(returning, departureDate);
  const activeDay = moment(activeDate.date, 'jYYYY-jMM-jDD').format('YYYY-MM-DD');
  return -today.diff(activeDay, 'days');
}

export default function useFocusOnCenter(
  wrapper: HTMLDivElement | null,
  dates: DateType[],
  returning: undefined | boolean,
  activeDate: DateType,
) {
  const { isMobile } = useDeviceDetect();
  const isChanged = useRef(false);
  const { query } = useRouter();
  const { departureDate } = query as {
    returningDate: string;
    departureDate: string;
  };

  useEffect(() => {
    isChanged.current = true;
  }, [activeDate.date, returning]);

  useEffect(() => {
    if (!wrapper || !(dates.length && isChanged.current)) {
      return;
    }

    isChanged.current = false;
    const dayDiff = getDayDiff(returning, departureDate, activeDate);
    const leftScroll = getLeftScroll(isMobile, wrapper, dayDiff);
    // this setTimeout is set to make the calendar items stable before going on the right position
    setTimeout(() => {
      wrapper.scrollTo({ top: 0, left: leftScroll, behavior: 'smooth' });
    }, 100);
  }, [dates, wrapper]);
}
