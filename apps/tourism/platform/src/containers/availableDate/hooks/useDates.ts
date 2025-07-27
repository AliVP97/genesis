import { useEffect, useState } from 'react';
import DateType from '../types/DateType';
import getTimeStamp from '../utils/getTimeStamp';
import dayjs from 'dayjs';
import { monthNames, weekNames } from '../utils/helper';
import { TDayContent, TDaysContents } from '../../datepicker/datepicker/types';
import isValidDate from '../utils/isValidDate';
import { useRouter } from 'next/router';

const createActiveDate = (date: dayjs.Dayjs): DateType => ({
  day: date.date(),
  week: date.get('day'),
  month: monthNames(date.get('month')),
  date: date.format('YYYY-MM-DD'),
});

const createDate = (
  date: dayjs.Dayjs,
  dayOffset: number,
  contents: { [p: string]: TDayContent | undefined } | undefined,
): DateType => {
  const dayNum = Math.abs(dayOffset);
  const day = dayOffset < 0 ? date.subtract(dayNum, 'day') : date.add(dayNum, 'day');

  return {
    day: day.date(),
    week: weekNames(day.format('d')),
    month: monthNames(day.get('month')),
    date: day.format('YYYY-MM-DD'),
    content: contents?.[day.format('YYYYMMDD')],
  };
};

const THRESHOLD_DAY_COUNT = 10;

export default function useDates(
  returning: boolean,
  daysContents: TDaysContents | undefined,
  startDate: string | string[] | undefined,
) {
  const { query } = useRouter();
  const [activeDate, setActiveDate] = useState<DateType>({});
  const [dates, setDates] = useState<DateType[]>([]);
  const selectedDate = returning
    ? (query.returningDate as string)
    : (query.departureDate as string);

  useEffect(() => {
    const unix = getTimeStamp(selectedDate);
    const data = dayjs(unix, {
      locale: 'fa',
    }).calendar('jalali');
    const newDates: DateType[] = [];
    const todayTime = dayjs().locale('fa').calendar('jalali').startOf('day');

    const diffDate = data.diff(todayTime, 'd');

    for (let i = 0; i < data.date() + 60; i++) {
      const dayOffset = i;
      const date = createDate(data, dayOffset, daysContents);

      if (isValidDate(date.date, startDate)) {
        newDates.push(date);
      }

      if (diffDate && dayOffset < THRESHOLD_DAY_COUNT && dayOffset !== 0) {
        const date = createDate(data, -dayOffset, daysContents);

        if (isValidDate(date.date, startDate)) {
          newDates.unshift(date);
        }
      }
    }

    setActiveDate(createActiveDate(data));
    setDates(newDates);
  }, [daysContents, selectedDate, startDate]);

  return { dates, activeDate, setActiveDate };
}
