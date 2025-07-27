import { TRangeDatePickerCalendarSystem, TRangeDatePickerDate } from '../types';
import { weekNames, monthNames } from 'utils/hooks/useTimeConvertor';
import dayjs from 'dayjs';
import style from '../style.module.scss';
import { ReactNode } from 'react';

export const timestampToDate = (
  timestamp: TRangeDatePickerDate,
  calendarSystem: TRangeDatePickerCalendarSystem,
) => {
  let date: ReactNode;

  if (calendarSystem === 'gregorian') {
    const dateObject = dayjs(timestamp);
    date = (
      <>
        {weekNames(Number(dateObject.format('d')), 'en') || ''}
        {', '}
        {monthNames(dateObject.get('month'), 'en') || ''}
        <span className={style['latin-text']}> {dateObject.date() || ''} </span>
      </>
    );
  } else {
    const dateObject = dayjs(timestamp, { locale: 'fa' }).calendar('jalali');
    date = (
      <>
        {weekNames(Number(dateObject.format('d'))) || ''}
        <span> {dateObject.date() || ''} </span>
        {monthNames(dateObject.get('month')) || ''}
      </>
    );
  }

  return date;
};
