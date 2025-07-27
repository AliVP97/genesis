import dayjs from 'dayjs';

const formatJalaliDate = (date: number) => {
  const jalaliDate = dayjs(date, { jalali: true }).calendar('jalali');
  return jalaliDate.format('YYYY-MM-DD');
};

export default formatJalaliDate;
