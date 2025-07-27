import { TCalendarOccasionsResponse, TCalendarOccasions, TCalendarOccasion } from '../types';
import { monthNames } from 'utils/hooks/useTimeConvertor';
import style from '../datepicker.module.scss';
import cn from 'classnames';
import jmoment from 'moment-jalaali';
import { DATE_UTILS } from 'utils/helpers/dateUtils';

const leadingZero = DATE_UTILS.leadingZero;

export const toCalendarOccasions: (
  input: TCalendarOccasionsResponse | undefined,
) => TCalendarOccasions = (calendarEventsResponse) => {
  const finalCalendarEvents: TCalendarOccasions = {};

  calendarEventsResponse?.data?.forEach((event) => {
    const id = event.year + leadingZero(event.month) + leadingZero(event.day);
    const monthTitleJalali = event.month ? monthNames(event.month - 1) : undefined;
    // gregorian
    const gregorianDate = new Date(
      jmoment(event.year + '-' + event.month + '-' + event.day, 'jYYYY-jMM-jDD')
        .format('YYYY-MM-DD')
        .toString(),
    );
    const gregorianDay = gregorianDate.getDate();
    const gregorianMonthTitle = monthNames(gregorianDate.getMonth() || 999, 'en');

    finalCalendarEvents[id] = {
      ...event,
      monthTitle: monthTitleJalali,
      gregorian: {
        day: gregorianDay,
        monthTitle: gregorianMonthTitle,
      },
    };
  });

  return finalCalendarEvents;
};

export const renderMonthEvents = (
  events: TCalendarOccasion[],
  calendarSystem: 'jalali' | 'gregorian' = 'jalali',
) => (
  <ul className={style['events-list']}>
    {events.map((eventItem) => {
      const dayTitle = calendarSystem === 'gregorian' ? eventItem.gregorian?.day : eventItem.day;
      const monthTitle =
        calendarSystem === 'gregorian' ? eventItem.gregorian?.monthTitle : eventItem.monthTitle;
      const gregorianStyle =
        calendarSystem === 'gregorian' ? style['events-list-item-day-gregorian'] : '';
      const holidayStyle = eventItem.type === 'holiday' ? style['events-list-item-holiday'] : '';
      return (
        <li
          key={eventItem.day + '' + eventItem.month + '' + eventItem.year + ''}
          className={cn(style['events-list-item'], holidayStyle)}
        >
          <span className={cn(style['events-list-item-day'], gregorianStyle)}>{dayTitle}</span>
          <span className={style['events-list-item-month']}>{monthTitle}</span>
          <span className={style['events-list-item-landingDetails']}>{eventItem?.description}</span>
        </li>
      );
    })}
  </ul>
);
