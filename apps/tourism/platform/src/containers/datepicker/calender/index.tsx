import { useRouter } from 'next/router';
import React, { useRef } from 'react';
import CalendarHeader from '../calenderHeader';
import styles from './calendar.module.scss';
import classNames from 'classnames';
import { TCalendarOccasions, TDaysContents } from 'containers/datepicker/datepicker/types';
import moment from 'moment-jalaali';
import useCalendarObserver from './hook/useCalendarObserver';
import useMobileCalendarDateDispatcher from './hook/useMobileCalendarDateDispatcher';

interface CalendarProps {
  setMonth: (offset: 1 | -1) => void;
  year: number;
  month: number;
  getMonthStr: (month: number) => {
    monthName: string;
    between: string;
  };
  view: 'desktop' | 'mobile';
  renderCalendar: (
    year: number,
    month: number,
    occasions: TCalendarOccasions | undefined,
    daysContents: TDaysContents,
    showOccasions: boolean,
  ) => React.ReactNode;
  locale: 'fa' | 'en';
  onLocaleChange: () => void;
  doubleMonth: boolean;
  application: string;
  occasions?: TCalendarOccasions;
  daysContents: TDaysContents;
  showOccasions: boolean;
}

const getSecondaryYear = (locale: string, inputYear: number, inputMonth: number) => {
  const month = inputMonth + 1;
  const date =
    locale === 'en'
      ? moment(`${inputYear}-${month}`, 'YYYY-MM').format('jYYYY-jMM')
      : moment(`${inputYear}-${month}`, 'jYYYY-jMM').format('YYYY-MM');
  const year = Number(date.split('-')[0]);
  const isLastMonth = date.split('-')[1] === '12';

  return isLastMonth ? year + 1 : year;
};

const Calender: React.FC<CalendarProps> = ({
  setMonth,
  year,
  month,
  getMonthStr,
  renderCalendar,
  locale,
  doubleMonth,
  view,
  application,
  occasions,
  daysContents,
  showOccasions,
}) => {
  const listRef = useRef<(HTMLDivElement | null)[]>([]);
  const todayDate = useRef({ month: 0, year: 0 });
  useCalendarObserver(listRef, todayDate);
  useMobileCalendarDateDispatcher(listRef);

  const location = useRouter().pathname.substr(1);
  const activeTab = location.length ? location : 'domesticFlight';

  const renderMobileView = (
    occasions: TCalendarOccasions | undefined,
    daysContents: TDaysContents,
  ) => {
    const content = [];
    if (application === 'myTravels') {
      for (let index = month; index >= 0; index--) {
        const thisMonth = month - index > 11 ? month - index : index;
        const thisYear = month - index > 11 ? year - 1 : year;
        content.push(
          <div className={styles['calendar__mobile']} key={index.toString() + 'myTravels'}>
            <div className={styles['calendar__mobile--header']}>
              <span>
                {getMonthStr(thisMonth).monthName} {thisYear}
              </span>
              {activeTab !== 'bus' && <span>{getMonthStr(thisMonth).between}</span>}
            </div>
            {renderCalendar(thisYear, thisMonth, occasions, daysContents, showOccasions)}
          </div>,
        );
      }
    } else
      for (let index = 0; index < 11; index++) {
        const thisMonth = month + index > 11 ? index + month - 12 : month + index;
        const thisYear = month + index > 11 ? year + 1 : year;
        todayDate.current = { month: month, year: year };
        content.push(
          <div
            className={styles['calendar__mobile']}
            key={index.toString() + 'calendar'}
            ref={(el) => (listRef.current[index] = el)}
            data-index={index}
          >
            <div className={styles['calendar__mobile--header']}>
              <span className={styles['date']}>
                {getMonthStr(thisMonth).monthName} {thisYear}
              </span>
              <span
                style={locale === 'fa' ? { fontFamily: 'Roboto' } : {}}
                className={styles['sub-date']}
              >
                {getMonthStr(thisMonth).between} {getSecondaryYear(locale, thisYear, thisMonth)}
              </span>
            </div>
            {renderCalendar(thisYear, thisMonth, occasions, daysContents, showOccasions)}
          </div>,
        );
      }
    return content;
  };

  return (
    <div className={styles['calendar']}>
      {view === 'desktop' && (
        <CalendarHeader
          year={year}
          month={month}
          setMonth={setMonth}
          getMonthStr={getMonthStr}
          doubleMonth={doubleMonth}
          locale={locale}
          getSecondaryYear={getSecondaryYear}
        />
      )}
      <div
        style={
          view === 'desktop'
            ? {
                display: 'flex',
                width: '100%',
                flexDirection: locale === 'fa' ? 'row-reverse' : 'row',
              }
            : { display: 'flex', flexDirection: 'column' }
        }
      >
        {view === 'desktop' ? (
          <div
            className={styles['calendar__desktop']}
            style={!doubleMonth ? { marginRight: 0 } : {}}
          >
            {renderCalendar(year, month, occasions, daysContents, showOccasions)}
          </div>
        ) : (
          renderMobileView(occasions, daysContents)
        )}
        {doubleMonth && view === 'desktop' && (
          <div className={classNames(styles['calendar__desktop'], 'ms-auto')}>
            {renderCalendar(
              month === 11 ? year + 1 : year,
              month === 11 ? 0 : month + 1,
              occasions,
              daysContents,
              showOccasions,
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Calender;
