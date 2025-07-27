import moment from 'moment-jalaali';
import getToday from './getToday';

export default function isValidDate(
  date: string | undefined,
  startDate: string | string[] | undefined,
): boolean {
  const today = getToday();
  const timeStampItem = new Date(moment(date, 'jYYYY-jMM-jDD').format('YYYY-MM-DD'));
  const timeStampToday = new Date(moment(today, 'jYYYY-jMM-jDD').format('YYYY-MM-DD'));
  const unixStartDate = new Date(moment(startDate, 'jYYYY-jMM-jDD').format('YYYY-MM-DD')).getTime();

  return !(
    timeStampToday.getTime() > timeStampItem.getTime() || unixStartDate > timeStampItem.getTime()
  );
}
