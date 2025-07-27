import dayjs from 'dayjs';
import { twoDigit } from 'module/flights/passengers/tabSelect/helper';

export const yearsList = (locale = 'fa', isExpire = false) => {
  const date = dayjs();
  const jalaliDate = date.calendar('jalali');
  const yearsArr = Array.from(Array(100).keys());
  const currentYear = locale === 'fa' ? jalaliDate.get('year') : dayjs().get('year');
  let result = [];
  if (isExpire) result = yearsArr.map((item) => currentYear + item);
  else result = yearsArr.map((item) => currentYear - item);
  return result;
};

export const monthsList = () => {
  const monthArr = Array.from(Array(12).keys());
  return monthArr;
};

export const daysList = (days: number | undefined) => {
  const dayArr = Array.from(Array(days ? days : 31).keys()).map((item) => twoDigit(item + 1));
  return dayArr;
};
