import React from 'react';
import { DatePickerLeftArrow, DatePickerRightArrow } from 'assets/icons';
import styles from './calendar-header.module.scss';
import classNames from 'classnames';
import { useAppSelector } from 'store/hook/storeHook';
import { selectDesktopCalendarAllowedToNavigate } from 'store/slices/app/selectors/calendars';

interface CalendarHeaderProps {
  setMonth: (offset: 1 | -1) => void;
  getMonthStr: (month: number) => {
    monthName: string;
    between: string;
  };
  year: number;
  month: number;
  doubleMonth: boolean;
  locale: 'en' | 'fa';
  getSecondaryYear: (locale: string, inputYear: number, inputMonth: number) => number;
}

const CalendarHeader: React.FC<CalendarHeaderProps> = ({
  setMonth,
  getMonthStr,
  year,
  month,
  doubleMonth,
  locale,
  getSecondaryYear,
}) => {
  const allowedToNavigated = useAppSelector(selectDesktopCalendarAllowedToNavigate);

  const currentMonth = getMonthStr(month);
  const nextMonth = getMonthStr(month === 11 ? 0 : month + 1);

  return (
    <div className={`mdpc-head d-flex ${styles['main']} ${locale === 'en' ? styles['ltr'] : ''}`}>
      <div className={styles['section']}>
        <div
          className={classNames(
            locale === 'en'
              ? styles['calendar-header__navigation-previous']
              : styles['calendar-header__navigation-next'],
          )}
          onClick={() => setMonth(-1)}
        >
          {locale === 'en' ? (
            <DatePickerLeftArrow className={styles['navigation-icon']} />
          ) : (
            <DatePickerRightArrow className={styles['navigation-icon']} />
          )}
        </div>
        <div className={styles['title']}>
          <div className={styles['date']}>
            <span>{year}</span>
            <span> {currentMonth.monthName} </span>
          </div>
          <div className={styles['sub-date']}>
            {currentMonth.between}{' '}
            <span style={locale === 'fa' ? { fontFamily: 'Roboto' } : {}}>
              {getSecondaryYear(locale, year, month)}
            </span>
          </div>
        </div>
        {!doubleMonth && (
          <div className="mdpch-button" onClick={() => setMonth(+1)}>
            {locale === 'en' ? (
              <DatePickerRightArrow className={styles['navigation-icon']} />
            ) : (
              <DatePickerLeftArrow className={styles['navigation-icon']} />
            )}
          </div>
        )}
      </div>
      {doubleMonth && (
        <div className={styles['section']}>
          <div className={styles['title']}>
            <div className={styles['date']}>
              <span>{month === 11 ? year + 1 : year}</span>
              <span> {nextMonth.monthName} </span>
            </div>
            <div className={styles['sub-date']}>
              {nextMonth.between}{' '}
              <span style={locale === 'fa' ? { fontFamily: 'Roboto' } : {}}>
                {getSecondaryYear(
                  locale,
                  month === 11 ? year + 1 : year,
                  month === 11 ? 0 : month + 1,
                )}
              </span>
            </div>
          </div>
          <div
            className={classNames(
              locale === 'en'
                ? styles['calendar-header__navigation-next']
                : styles['calendar-header__navigation-previous'],
            )}
            onClick={() => allowedToNavigated && setMonth(+1)}
          >
            {locale === 'en' ? (
              <DatePickerRightArrow className={styles['navigation-icon']} />
            ) : (
              <DatePickerLeftArrow className={styles['navigation-icon']} />
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default CalendarHeader;
