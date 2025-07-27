import moment from 'moment-jalaali';
import { DATE_UTILS } from 'utils/helpers/dateUtils';

function getTimeStamp(date: string) {
  const gDate = moment(date, 'jYYYY-jMM-jDD').format('YYYY-MM-DD');
  return DATE_UTILS.toTehranTimeZone(gDate).toDate().getTime();
}

export default getTimeStamp;
