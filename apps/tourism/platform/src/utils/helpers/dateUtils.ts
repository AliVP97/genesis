import LocalizedFormat from 'dayjs/plugin/localizedFormat';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import dayjs from 'dayjs';

// Extend dayjs with the required plugins
dayjs.extend(LocalizedFormat);
dayjs.extend(utc);
dayjs.extend(timezone);

export const DATE_UTILS = {
  today: (template = 'YYYY/MM/DD') => dayjs(undefined).calendar('jalali').format(template),

  /**
   * Get start of a date such as day or other units.
   * @param date
   * @param unit
   */
  startOf: (date: string | undefined, unit: dayjs.OpUnitType): dayjs.Dayjs =>
    dayjs(date).startOf(unit),

  formatJalali: (jalaliDate: string | undefined, template: string, locale: 'fa' | 'en') => {
    if (locale === 'fa') {
      return dayjs(jalaliDate).format(template);
    }

    return (
      dayjs(jalaliDate)
        // It returns different calendar system due to extends incorrect plugin to dayjs.
        // This conflict is resulted in this problem.
        .calendar('jalali')
        .format(template)
    );
  },

  /**
   * Converts the given date to Tehran timezone.
   *
   * @param {Date | string | number} date - The date to be converted.
   * @returns {dayjs.Dayjs} - The converted date in Tehran timezone.
   */
  toTehranTimeZone: (date: dayjs.ConfigType): dayjs.Dayjs => dayjs(date).tz('Asia/Tehran'),

  weekdays: {
    gregorian: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
    jalali: ['یکشنبه', 'دوشنبه', 'سه شنبه', 'چهارشنبه', 'پنجشنبه', 'جمعه', 'شنبه'],
    gregorianToJalali: {
      Sunday: 'یکشنبه',
      Monday: 'دوشنبه',
      Tuesday: 'سه شنبه',
      Wednesday: 'چهارشنبه',
      Thursday: 'پنجشنبه',
      Friday: 'جمعه',
      Saturday: 'شنبه',
    },
  },
  months: {
    gregorian: [
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
    ],
    jalali: [
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
    ],
    persianMonthToGeorgian: [
      'March - April',
      'April - May',
      'May - June',
      'June - July',
      'July - August',
      'August - September',
      'September - October',
      'October - November',
      'November - December',
      'December - January',
      'January - February',
      'February - March',
    ],
    georgianMonthToPersian: [
      'دی-بهمن',
      'بهمن-اسفند',
      'اسفند-فروردین',
      'فروردین-اردیبهشت',
      'اردیبهشت-خرداد',
      'خرداد-تیر',
      'تیر-مرداد',
      'مرداد-شهریور',
      'شهریور-مهر',
      'مهر-آبان',
      'آبان-آذر',
      'آذر-دی',
    ],
  },

  formatDate: (
    timestamp: number,
    {
      lang = 'fa',
      showDay = true,
      showWeekDay = true,
      showMonth = true,
      showYear = true,
    }: {
      lang: 'fa' | 'en';
      showDay?: boolean;
      showWeekDay?: boolean;
      showMonth?: boolean;
      showYear?: boolean;
    },
  ): string => {
    const dayjsDate = dayjs(timestamp);
    let date = dayjsDate
      .calendar('jalali')
      .locale('fa')
      .format(
        `${showWeekDay ? 'dddd ' : ''}${showDay ? 'D' : ''} ${
          showMonth ? 'MMMM' : ''
        } ${showYear ? 'YYYY' : ''}`,
      );
    lang === 'en' &&
      (date = dayjsDate.format(
        `${showWeekDay ? 'dddd, ' : ''}${showDay ? 'D' : ''} ${
          showMonth ? 'MMM' : ''
        } ${showYear ? 'YYYY' : ''}`,
      ));
    return date;
  },

  /** converts one digit number to leading zero number */
  leadingZero: (input: number | undefined | null) => {
    let result = '--';
    if (input) {
      result = input + '';
      if (0 <= input && input < 10) result = '0' + input;
    }
    return result;
  },

  monthsAreEqual: (
    date1: number,
    date2: number,
    calendarSystem: string | 'JALALI' | 'GREGORIAN' | undefined,
  ) =>
    calendarSystem === 'JALALI'
      ? new Intl.DateTimeFormat('fa-IR', { month: 'numeric' }).format(date1) ===
        new Intl.DateTimeFormat('fa-IR', { month: 'numeric' }).format(date2)
      : new Date(date1).getMonth() === new Date(date2).getMonth(),
};
