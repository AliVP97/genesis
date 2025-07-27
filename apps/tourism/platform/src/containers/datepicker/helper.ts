import jmoment from 'moment-jalaali';
import { DATE_UTILS } from 'utils/helpers/dateUtils';

const getDayIndex = (day: string, locale: 'fa' | 'en'): number => {
  const dayOrder =
    locale === 'fa'
      ? ['Sat', 'Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri']
      : ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  return dayOrder.indexOf(day);
};

const getFirstDay = (year: number, month: number, locale: 'fa' | 'en'): number => {
  const dayName =
    locale === 'en'
      ? // ? jmoment(`${year}, ${month}, 1`).format('ddd')
        jmoment(`${year}/${month}/1`).format('ddd')
      : jmoment(`${year}, ${month}, 1`, 'jYYYY-jMM-jDD').format('ddd');
  return getDayIndex(dayName, locale);
};

const getNumberOfDay = (year: number, month: number, locale: 'fa' | 'en') => {
  if (locale === 'en') {
    return 40 - new Date(year, month - 1, 40).getDate();
  } else {
    let numberOfDays = month < 7 ? 31 : 30;
    if (month === 12 && !jmoment.jIsLeapYear(year)) {
      numberOfDays = 29;
    }
    return numberOfDays;
  }
};

const getNumberOfDays = (year: number, month: number): number => {
  return 40 - new Date(year, month, 40).getDate();
};

const getDayDetails = (args: {
  firstDay: number;
  index: number;
  month: number;
  numberOfDays: number;
  year: number;
  locale: 'fa' | 'en';
}) => {
  const date = args.index - args.firstDay;
  const day = args.index % 7;
  let prevMonth = args.month - 1;
  let prevYear = args.year;
  if (prevMonth < 0) {
    prevMonth = 11;
    prevYear--;
  }
  const prevMonthNumberOfDays = getNumberOfDays(prevYear, prevMonth);
  const _date = (date < 0 ? prevMonthNumberOfDays + date : date % args.numberOfDays) + 1;
  const month = date < 0 ? -1 : date >= args.numberOfDays ? 1 : 0;
  const timestamp =
    args.locale === 'en'
      ? new Date(
          `${args.year}-${args.month + 1 <= 9 ? '0' : ''}${args.month + 1}-${
            _date <= 9 ? '0' : ''
          }${_date}`,
        )
      : new Date(
          jmoment(args.year + '-' + (args.month + 1) + '-' + _date, 'jYYYY-jMM-jDD')
            .format('YYYY-MM-DD')
            .toString(),
        );

  return {
    month,
    timestamp: timestamp.setHours(0, 0, 0, 0),
    dayString: DATE_UTILS.weekdays.gregorian[day],
  };
};

/**
 * Warning: inputs must be Jalali!
 *
 */
export const getMonthDetails = (year: number, month: number, locale: 'fa' | 'en') => {
  const firstDay = getFirstDay(year, month + 1, locale);
  const numberOfDays = getNumberOfDay(year, month + 1, locale);

  const monthArray = [];
  const rows = 6;
  let currentDay = null;
  let index = 0;
  const cols = 7;

  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      currentDay = getDayDetails({
        index,
        numberOfDays,
        firstDay,
        year,
        month,
        locale,
      });
      monthArray.push(currentDay);
      index++;
    }
  }
  return monthArray;
};
