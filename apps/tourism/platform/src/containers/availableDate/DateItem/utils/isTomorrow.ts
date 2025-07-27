import moment from 'moment-jalaali';
import dayjs from 'dayjs';

export default function isTomorrow(date: string | undefined) {
  if (!date) {
    return false;
  }

  const today = dayjs().calendar('jalali').format('YYYY-MM-DD');
  const formattedDate = moment(date?.split('-').join('/'), 'jYYYY/jMM/jDD').format('YYYY-MM-DD');
  const isDayAfter = dayjs().calendar('jalali').isAfter(formattedDate, 'day');

  return isDayAfter && date !== today;
}
