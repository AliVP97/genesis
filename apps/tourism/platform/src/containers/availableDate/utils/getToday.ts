import dayjs from 'dayjs';

const getToday = () => dayjs().calendar('jalali').format('YYYY-MM-DD');

export default getToday;
