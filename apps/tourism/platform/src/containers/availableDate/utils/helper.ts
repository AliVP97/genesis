export const monthNames = (month: number, locale = 'fa', abbreviate = true) => {
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
    'Janaury',
    'Feburary',
    'March',
    'April',
    'May',
    'June',
    'July',
    'Auguest',
    'September',
    'October',
    'November',
    'December',
  ];
  if (locale === 'fa') return faMonths[month];
  else return abbreviate ? enMonthsAbbr[month] : enMonths[month];
};

export const weekNames = (week: string, locale = 'fa') => {
  const faWeeks = ['یکشنبه', 'دوشنبه', 'سه شنبه', 'چهارشنبه', 'پنج شنبه', 'جمعه', 'شنبه'];
  const enWeeks = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  if (locale === 'fa') return faWeeks[parseInt(week)];
  else return enWeeks[parseInt(week)];
};
