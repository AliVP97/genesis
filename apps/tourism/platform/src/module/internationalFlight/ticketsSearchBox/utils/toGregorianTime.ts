import dayjs from 'dayjs';

const toGregorianTime = (date?: string) => dayjs(date, { jalali: true }).toDate().getTime();

export default toGregorianTime;
