import dayjs from 'dayjs';

export const monthNames = (
  month: number,
  locale = 'fa',
  abbreviate = true,
  enMonthDaysFull = false,
) => {
  const faMonths = [
    'فروردین',
    'اردیبهشت',
    'خرداد',
    'تیر',
    'مرداد',
    'شهریور',
    'مهر',
    'آبان',
    'آذر',
    'دی',
    'بهمن',
    'اسفند',
  ];
  const enMonthsAbbr = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ];
  const enMonths = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];
  const enMonthsFull = [
    'Jan - 01',
    'Feb - 02',
    'Mar - 03',
    'Apr - 04',
    'May - 05',
    'Jun - 06',
    'Jul - 07',
    'Aug - 08',
    'Sep - 09',
    'Oct - 10',
    'Nov - 11',
    'Dec - 12',
  ];
  if (locale === 'fa') return faMonths[month];
  else
    return abbreviate
      ? enMonthsAbbr[month]
      : enMonthDaysFull
        ? enMonthsFull[month]
        : enMonths[month];
};

export const weekNames = (week: number, locale = 'fa') => {
  const faWeeks = ['یکشنبه', 'دوشنبه', 'سه شنبه', 'چهارشنبه', 'پنج شنبه', 'جمعه', 'شنبه'];
  const enWeeks = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  if (locale === 'fa') return faWeeks[week];
  else return enWeeks[week];
};

const useTimeConvertor = (timeStamp: string | undefined) => {
  const obj = {
    date: 0,
    dayName: '',
    time: '',
    month: '',
    year: 0,
    clock: '',
    monthIndex: 0,
  };
  if (timeStamp) {
    const ts = new Date(parseInt(timeStamp) * 1000);
    const jalaliDate = dayjs(ts).calendar('jalali');
    obj.clock = jalaliDate.format('HH:mm');
    obj.date = jalaliDate.get('date');
    obj.dayName = weekNames(jalaliDate.get('day'));
    obj.time = `${('0' + jalaliDate.get('hour')).slice(-2)}:${(
      '0' + jalaliDate.get('minute')
    ).slice(-2)}`;
    obj.month = monthNames(jalaliDate.get('month'));
    obj.monthIndex = jalaliDate.get('month') + 1;
    obj.year = jalaliDate.get('year');
  }
  return obj;
};

export type UseTimer = {
  date: number;
  dayName: string;
  time: string;
  month: string;
  year: number;
  clock: string;
};

export default useTimeConvertor;
