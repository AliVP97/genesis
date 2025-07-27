import React, { useState, useEffect, memo, useCallback } from 'react';
import Calendar from '../calender';
import jmoment from 'moment-jalaali';
import { useRouter } from 'next/router';
import classNames from 'classnames';
import styles from './datepicker.module.scss';
import { DATE_UTILS } from 'utils/helpers/dateUtils';
import { TCalendarOccasion, TCalendarOccasions, TDayContent, TDaysContents } from './types';
import { renderMonthEvents } from './helper';
import cn from 'classnames';
import { getMonthDetails } from '../helper';

const todayTimestamp = new Date().setHours(0, 0, 0, 0);
const today = jmoment();
const leadingZero = DATE_UTILS.leadingZero;

export interface State {
  year: number;
  month: number;
  hoveredDay: null | number;
}

interface Props {
  locale: 'en' | 'fa';
  onChange: (timestamp: number | null, endDate: number | null) => void;
  onLocaleChange: () => void;
  type?: 'range' | 'single';
  doubleMonth: boolean;
  showDatePicker: boolean;
  startDate?: null | number;
  endDate?: null | number;
  view: 'desktop' | 'mobile';
  application?: string;
  daysContents?: TDaysContents;
  allowSimilarDates?: boolean;
  onMonthChange?: (e: State) => void;
  occasions?: TCalendarOccasions;
  showOccasions: boolean;
}

const MyDatePicker: React.FC<Props> = ({
  locale,
  onChange,
  onLocaleChange,
  type,
  doubleMonth,
  showDatePicker,
  startDate,
  endDate,
  view,
  application,
  daysContents = {},
  allowSimilarDates = true,
  onMonthChange,
  occasions,
  showOccasions,
}) => {
  const [state, setState] = useState<State>({
    year: locale === 'en' ? today.year() : today.jYear(),
    month: locale === 'en' ? today.month() : today.jMonth(),
    hoveredDay: null,
  });

  const location = useRouter().pathname.substr(1);

  const activeTab = location.length ? location : 'domesticFlight';

  // useEffect(() => {
  //   return onChange(state);
  // }, [state]);

  useEffect(() => {
    onMonthChange?.(state);
  }, [state.month]);

  useEffect(() => {
    if (!startDate && !endDate) {
      setState((prev) => {
        return {
          ...prev,
          hoveredDay: null,
        };
      });
    }
  }, [startDate, endDate]);

  useEffect(() => {
    setState((prev) => {
      return {
        ...prev,
        year: locale === 'en' ? today.year() : today.jYear(),
        month: locale === 'en' ? today.month() : today.jMonth(),
      };
    });
  }, [locale]);

  useEffect(() => {
    if (type === 'single') {
      setState((prev) => ({ ...prev, hoveredDay: null }));
    }
  }, [type]);
  /**
   *  Core
   */

  const isCurrentDay = (timestamp: number): boolean => {
    return timestamp === new Date(todayTimestamp).setHours(0, 0, 0, 0);
  };

  const isSelectedDay = (timestamp: number): boolean => {
    return timestamp === startDate;
  };

  const getMonthStr = (month: number) => {
    return {
      monthName:
        locale === 'en'
          ? DATE_UTILS.months.gregorian[Math.max(Math.min(11, month), 0)] || 'Month'
          : DATE_UTILS.months.jalali[month],
      between:
        locale === 'en'
          ? DATE_UTILS.months.georgianMonthToPersian[month]
          : DATE_UTILS.months.persianMonthToGeorgian[month],
    };
  };

  const setRange = (selectedDay: number): void => {
    if (startDate && endDate) {
      setState((prev) => {
        return {
          ...prev,
          hoveredDay: selectedDay,
        };
      });
      onChange(selectedDay, null);
      return;
    }
    if (startDate && endDate && startDate === endDate && startDate === selectedDay) {
      // reset selected dates:
      setState((prev) => {
        return {
          ...prev,
          hoveredDay: null,
        };
      });
      onChange(null, null);
      return;
    }
    if (!startDate) {
      setState((prev) => {
        return {
          ...prev,
          hoveredDay: selectedDay,
        };
      });
      onChange(selectedDay, null);
    } else {
      if (selectedDay > startDate) {
        if (endDate && Math.abs(selectedDay - startDate) < Math.abs(endDate - selectedDay)) {
          setState((prev) => {
            return {
              ...prev,
              selectedDay,
              hoveredDay: selectedDay,
            };
          });
          onChange(selectedDay, endDate);
        } else if (startDate === selectedDay) {
          setState((prev) => {
            return {
              ...prev,
              selectedDay,
              hoveredDay: selectedDay,
            };
          });
          onChange(selectedDay, selectedDay);
        } else {
          setState((prev) => {
            return {
              ...prev,
              hoveredDay: selectedDay,
            };
          });
          onChange(startDate, selectedDay);
        }
      } else if (startDate > selectedDay) {
        setState((prev) => {
          return {
            ...prev,
            selectedDay,
            hoveredDay: selectedDay,
          };
        });
        onChange(selectedDay, null);
      } else if (startDate === selectedDay) {
        if (!endDate && !allowSimilarDates) return;

        setState((prev) => {
          return {
            ...prev,
            selectedDay,
            from: selectedDay,
            to: selectedDay,
            hoveredDay: selectedDay,
          };
        });
        onChange(selectedDay, selectedDay);
      }
    }
  };
  // const updateDateFromInput = () => {
  // 	let dateValue = inputRef.current.value;
  // 	let dateData = getDateFromDateString(dateValue);
  // 	if (dateData !== null) {
  // 		setDate(dateData);
  // 		setState((prev) => {
  // 			return {
  // 				...prev,
  // 				year: dateData.year,
  // 				month: dateData.month - 1,
  // 			};
  // 		});
  // 	}
  // };

  // const setDateToInput = (timestamp) => {
  // 	let dateString = getDateStringFromTimestamp(timestamp);
  // 	inputRef.current.value = dateString;
  // };

  const onDateClick = (timestamp: number): void => {
    if (type === 'range') {
      setRange(timestamp);
    } else {
      setState((prev) => {
        // setDateToInput(day.timestamp);
        return { ...prev, selectedDay: timestamp };
      });
      onChange(timestamp, null);
    }
  };

  // const setYear = (offset: 1 | -1): void => {
  //   let year = state.year + offset;
  //   setState(prev => {
  //     return {
  //       ...prev,
  //       year,
  //     };
  //   });
  // };

  const setMonth = (offset: 1 | -1): void => {
    let year = state.year;
    let month = state.month + offset;
    if (month === -1) {
      month = 11;
      year--;
    } else if (month === 12) {
      month = 0;
      year++;
    }
    setState((prev) => {
      return {
        ...prev,
        year,
        month,
      };
    });
  };

  /**
   *  Renderers
   */

  const isInRange = (timestamp: number) => {
    if (!endDate || type === 'single') return false;
    return startDate && timestamp > startDate && timestamp < endDate;
  };
  const isFromDate = (timestamp: number): boolean => {
    return timestamp === startDate;
  };
  const isToDate = (timestamp: number): boolean => {
    return timestamp === endDate;
  };
  const isDisabled = (timestamp: number): boolean => {
    if (application === 'myTravels')
      return timestamp > new Date(todayTimestamp).setHours(0, 0, 0, 0);
    return timestamp < new Date(todayTimestamp).setHours(0, 0, 0, 0);
  };
  const renderDay = useCallback(
    (
      day: { month: number; timestamp: number; dayString: string },
      index: number,
      dayEvent: TCalendarOccasion | undefined,
      content: TDayContent | undefined,
    ): React.ReactNode => {
      const currentDay = jmoment(day.timestamp);

      const holidayStyle = dayEvent?.type === 'holiday' ? styles['holiday'] : '';

      return (
        <div
          key={index}
          onMouseOver={
            view !== 'mobile'
              ? () => {
                  if (!endDate && state.hoveredDay) {
                    setState((prev) => {
                      return {
                        ...prev,
                        hoveredDay: day.timestamp,
                      };
                    });
                  } else if (endDate && state.hoveredDay) {
                    setState((prev) => {
                      return {
                        ...prev,
                        hoveredDay: day.timestamp,
                      };
                    });
                  }
                }
              : undefined
          }
          className={classNames(
            styles['day'],
            isDisabled(day.timestamp) && styles['day--disabled'],
            startDate &&
              !endDate &&
              (state.hoveredDay as number) >= day.timestamp &&
              day.timestamp > startDate &&
              styles['day--hovered'],
            isCurrentDay(day.timestamp) && styles['day--today'],
            isSelectedDay(day.timestamp) && type === 'single' && styles['day--selected'],
            isFromDate(day.timestamp) && type === 'range' && styles['day--selected-from'],
            type === 'range' && isToDate(day.timestamp) && styles['day--selected-to'],
            isInRange(day.timestamp) && styles['day--inRange'],
            styles[locale],
          )}
          style={day.month !== 0 ? { opacity: 0 } : {}}
          onClick={() => onDateClick(day.timestamp)}
        >
          <div className={cn(styles['day__content'], holidayStyle)}>
            {locale === 'en' ? (
              <>
                <span style={{ fontFamily: 'Roboto', fontSize: '20px' }}>
                  {jmoment(day.timestamp).date()}
                </span>
                <span>
                  {activeTab === 'internationalFlight'
                    ? currentDay.date()
                    : activeTab === 'bus'
                      ? ''
                      : // TODO: number should add here
                        ''}
                </span>
              </>
            ) : (
              <>
                <span style={{ fontSize: '20px' }}>{currentDay.jDate().toLocaleString('fa')}</span>
                <span>
                  {activeTab === 'internationalFlight'
                    ? currentDay.date().toLocaleString('en')
                    : activeTab === 'bus'
                      ? ''
                      : // TODO: number should add here
                        ''}
                </span>
              </>
            )}
            <div dangerouslySetInnerHTML={{ __html: content?.secondary || '' }} />
            {content?.secondaryData && (
              <span
                className={classNames(
                  styles['secondary'],
                  locale === 'en' && styles['latin-numeric'],
                )}
                style={content.secondaryData.style}
              >
                {content.secondaryData.textContent}
              </span>
            )}
          </div>
        </div>
      );
    },
    [state, endDate, startDate],
  );

  const renderCalendar = (
    year: number,
    month: number,
    calendarOccasions: TCalendarOccasions | undefined,
    daysContents: TDaysContents,
    showOccasions: boolean,
  ) => {
    const monthD = getMonthDetails(year, month, locale);
    const days: React.ReactNode[] = [];
    const monthEvents: TCalendarOccasion[] = [];

    monthD.forEach((day, index) => {
      const jDate = jmoment(day.timestamp);
      const yyyymmddJDate =
        jDate.jYear() + leadingZero(jDate.jMonth() + 1) + leadingZero(jDate.jDate());

      let dayEvent;
      if (day.month === 0) {
        dayEvent = calendarOccasions?.[yyyymmddJDate];
        if (!dayEvent && new Date(day.timestamp).getDay() === 5) {
          dayEvent = {
            type: 'holiday',
          };
        }
      }

      const content = day.month === 0 ? daysContents[yyyymmddJDate] : undefined;
      dayEvent && monthEvents.push(dayEvent);
      days.push(renderDay(day, index, dayEvent, content));
    });
    const weekNameList =
      locale === 'en'
        ? ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa']
        : ['شنبه', '۱شنبه', '۲شنبه', '۳شنبه', '۴شنبه', '۵شنبه', 'جمعه'];
    return (
      <div className={styles['month']} style={{ direction: locale === 'fa' ? 'rtl' : 'ltr' }}>
        {/* <div className="text-center">{monthNameList[month]}</div> */}
        <div className={styles['month__header']}>
          {weekNameList.map((dName, i) => (
            <div key={i} className={styles['month__header--item']}>
              {dName}
            </div>
          ))}
        </div>
        <div className={styles['month__body']}>{days}</div>
        {/* WIP */}
        {showOccasions && monthEvents.length ? (
          <div className={styles['month__events']}>
            {renderMonthEvents(
              monthEvents.filter((event) => event.description),
              'jalali',
            )}
          </div>
        ) : (
          ''
        )}
      </div>
    );
  };

  return (
    <>
      {showDatePicker ? (
        <Calendar
          view={view}
          setMonth={setMonth}
          // setYear={setYear}
          year={state.year}
          month={state.month}
          renderCalendar={renderCalendar}
          getMonthStr={getMonthStr}
          onLocaleChange={onLocaleChange}
          locale={locale}
          doubleMonth={doubleMonth}
          application={application!}
          occasions={occasions}
          daysContents={daysContents}
          showOccasions={showOccasions}
        />
      ) : (
        ''
      )}
    </>
  );
};
export default memo(MyDatePicker);
