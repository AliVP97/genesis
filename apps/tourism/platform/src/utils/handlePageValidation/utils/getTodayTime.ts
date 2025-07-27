import dayjs from 'dayjs';

const getTodayTime = () => {
  const today = dayjs(undefined, { jalali: true }).calendar('jalali').toDate();
  today.setHours(0, 0, 0, 0);

  return today.getTime();
};

export default getTodayTime;
