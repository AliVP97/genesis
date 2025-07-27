import { Dispatch, FC, SetStateAction, useEffect, useRef, useState } from 'react';
import styles from './selectDate.module.scss';
import { DateIcon, DownArrowIcon } from 'assets/icons';
import classNames from 'classnames';
import Modal from 'components/modal';
import useDeviceDetect from 'utils/hooks/useDeviceDetect';
import { DATE_UTILS } from 'utils/helpers/dateUtils';
import { useRouter } from 'next/router';
import cn from 'classnames';
import { TDaysContents, TCalendarSystem, TCalendarOccasions } from '../datepicker/types';
import { getServiceName } from 'utils/helpers/serviceDetector';
import { State as TMonthAndYear } from 'containers/datepicker/datepicker';
import { getMonthDetails } from '../helper';
import jmoment from 'moment-jalaali';
import { DatePickerBody } from './componenst/datePickerBody';

export type event = {
  date: string;
  event: string;
  isHoliday: string;
};

export const dayMap = {
  Sunday: 'یکشنبه',
  Monday: 'دوشنبه',
  Tuesday: 'سه شنبه',
  Wednesday: 'چهارشنبه',
  Thursday: 'پنجشنبه',
  Friday: 'جمعه',
  Saturday: 'شنبه',
};
export const PmonthMap = [
  'فروردین',
  'اردیبهشت',
  'خرداد',
  'تیر',
  'مرداد',
  'شهریور',
  'مهر',
  'آبان',
  'آذر',
  'دی',
  'بهمن',
  'اسفند',
];

export type DateState = {
  to: null | number;
  from: null | number;
  application?: string;
};

type TCurrentOccasions = {
  monthTitle: string;
  occasions: {
    dayNumber: number;
    type: string | undefined;
    description: string;
  }[];
}[];

interface Props {
  setDatePickerRef?: Dispatch<HTMLElement | null>;
  range: boolean;
  title?: string;
  open: boolean;
  onClose?: () => void;
  value: { to: null | number; from: null | number };
  setValue: Dispatch<SetStateAction<DateState>>;
  view: 'mobile' | 'desktop';
  application?: string;
  calendarSystem?: TCalendarSystem;
  onCalendarSystemChange?: (props: 'gregorian' | 'jalali') => void;
  placeHolder?: {
    from: string;
    to: string;
  };
  onOpen?: () => void;
  daysContents?: TDaysContents;
  allowSimilarDates?: boolean;
  occasions?: TCalendarOccasions;
  onConfirm?: () => void;
  onMonthChange?: (e: TMonthAndYear) => void;
}

const leadingZero = DATE_UTILS.leadingZero;

const DatePicker: FC<Props> = ({
  range,
  title,
  open,
  onClose,
  value,
  setValue,
  view,
  application = 'search',
  calendarSystem = 'JALALI',
  onCalendarSystemChange,
  placeHolder = {
    from: 'تاریخ رفت',
    to: 'تاریخ برگشت',
  },
  onOpen,
  daysContents = {},
  allowSimilarDates = true,
  occasions,
  onConfirm,
  onMonthChange,
}) => {
  const [locale, setLocale] = useState<'fa' | 'en'>(calendarSystem === 'JALALI' ? 'fa' : 'en');
  const [visible, setVisible] = useState(false);
  const [width, setWidth] = useState<number | null>(null);
  const divRef = useRef<HTMLDivElement>(null);
  const { isMobile } = useDeviceDetect();
  const query = useRouter();

  useEffect(() => {
    if (visible) {
      onOpen?.();
      const servicesElement = document?.getElementById('desktop__services');
      servicesElement?.scrollIntoView();
    } else onClose?.();
  }, [visible]);

  useEffect(() => {
    if (!range) {
      setValue((prev) => ({ ...prev, to: null }));
    }
  }, [range]);

  useEffect(() => {
    if (open) {
      setVisible(true);
    }
  }, [open]);

  useEffect(() => {
    setWidth(window.innerWidth);
  }, []);

  useEffect(() => {
    setLocale(calendarSystem === 'JALALI' ? 'fa' : 'en');
  }, [calendarSystem]);

  const changeLocalHandler = () => {
    setLocale(locale === 'en' ? 'fa' : 'en');
  };

  const onChange = (startDate: number | null, endDate: number | null) => {
    if (range) {
      setValue({ from: startDate, to: endDate });
      return;
    }
    setValue({ from: startDate, to: null });
  };

  const handleChangeLocale = (e: boolean) => {
    setLocale(!e ? 'fa' : 'en');
    onCalendarSystemChange?.(!e ? 'jalali' : 'gregorian');
  };

  const handleBlur = (event: MouseEvent) => {
    if (view === 'desktop' && divRef.current && !divRef.current.contains(event.target as Node)) {
      setVisible(false);
    }
  };

  useEffect(() => {
    if (view === 'mobile') return;
    document.addEventListener('mousedown', handleBlur);
    return () => {
      document.removeEventListener('mousedown', handleBlur);
    };
  }, []);

  const [currentOccasions, setCurrentOccasions] = useState<TCurrentOccasions>([]);

  const handleMonthChange = (e: TMonthAndYear) => {
    if (onMonthChange) {
      onMonthChange(e);
    }
    const currentMonthDays = getMonthDetails(e.year, e.month, locale).filter(
      (day) => day.month === 0,
    );

    const nextMonthDays = getMonthDetails(
      e.month === 11 ? e.year + 1 : e.year,
      e.month === 11 ? 0 : e.month + 1,
      locale,
    ).filter((day) => day.month === 0);

    const monthsDays = [...currentMonthDays, ...nextMonthDays];

    const currentOccasions = monthsDays.reduce((accu, day) => {
      const jDate = jmoment(day.timestamp);
      const yyyymmddJDate =
        jDate.jYear() + leadingZero(jDate.jMonth() + 1) + leadingZero(jDate.jDate());
      const occasion = occasions?.[yyyymmddJDate];

      const sameMonthOccasion = accu.find(
        (accuOccasion) => accuOccasion.monthTitle === occasion?.monthTitle,
      );
      if (occasion && occasion.monthTitle && occasion.day && occasion.description)
        sameMonthOccasion
          ? sameMonthOccasion.occasions?.push({
              dayNumber: occasion?.day,
              description: occasion?.description,
              type: occasion?.type,
            })
          : accu.push({
              monthTitle: occasion?.monthTitle,
              occasions: [
                {
                  dayNumber: occasion?.day,
                  description: occasion?.description,
                  type: occasion?.type,
                },
              ],
            });

      return accu;
    }, [] as TCurrentOccasions);

    setCurrentOccasions(currentOccasions);
  };

  function handleConfirm() {
    setVisible(false);
    onClose?.();
    onConfirm?.();
  }

  const content = (
    <>
      <div className={styles['datepicker__wraper']} ref={view === 'desktop' ? divRef : undefined}>
        {/* unxoun - TO DO - convert to component */}
        {isMobile ? (
          <>
            <div className={styles['datepicker__dismiss']}>
              <span>تاریخ سفر</span>
              <DownArrowIcon
                onClick={() => {
                  setVisible(false);
                  onClose?.();
                }}
                className={styles['datepicker__dismiss--icon']}
              />
            </div>
            <DatePickerBody
              title={title}
              locale={locale}
              handleChangeLocale={handleChangeLocale}
              view={view}
              onChange={onChange}
              changeLocalHandler={changeLocalHandler}
              range={range}
              value={value}
              application={application}
              daysContents={daysContents}
              allowSimilarDates={allowSimilarDates}
              occasions={occasions}
            />
          </>
        ) : (
          <div className={styles['desktop-layout']}>
            <div className={styles['right']}>
              <DatePickerBody
                title={title}
                locale={locale}
                handleChangeLocale={handleChangeLocale}
                view={view}
                onChange={onChange}
                changeLocalHandler={changeLocalHandler}
                range={range}
                value={value}
                application={application}
                daysContents={daysContents}
                allowSimilarDates={allowSimilarDates}
                handleMonthChange={handleMonthChange}
                occasions={occasions}
                showOccasions={false}
              />
            </div>
            <div className={styles['left']}>
              <div className={styles['occasions']}>
                <div className={styles['header']}>مناسبت ها</div>
                <div className={styles['months']}>
                  {currentOccasions.map((month, i) => (
                    <div key={i} className={styles['month']}>
                      <div className={styles['title']}>{month.monthTitle}</div>
                      <div className={styles['days']}>
                        {month.occasions.map((occasion, j) => (
                          <div key={j} className={styles['day']}>
                            <span
                              className={classNames(
                                styles['number'],
                                styles[`type-${occasion.type}`],
                              )}
                            >
                              {occasion.dayNumber}
                            </span>
                            <span className={styles['description']}>{occasion.description}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
        <div
          className={classNames(
            styles['datepicker__footer'],
            ((!range && value.from) || (range && value.from && value.to)) &&
              styles['datepicker__footer--active'],
          )}
        >
          {range && !value.to && (
            <div
              className={styles['datepicker__footer--pointer']}
              style={value.from ? { right: 'unset', left: '15%' } : {}}
            />
          )}
          <div
            className={classNames(
              'd-flex w-100',
              view === 'desktop' && 'justify-content-start',
              styles['datepicker__footer--info'],
            )}
          >
            <div
              className={classNames(
                view === 'mobile' ? (range ? 'w-50' : 'w-100') : '',
                styles['datepicker__footer--from'],
                !value.from && !value.to ? styles['active'] : '',
              )}
            >
              <span
                className={classNames(view === 'desktop' && 'd-inline-block mx-4', styles['title'])}
              >
                {query.pathname.includes('international') && !range
                  ? ''
                  : application === 'myTravels'
                    ? 'از تاریخ'
                    : getServiceName(query.pathname) === 'hotel'
                      ? 'ورود'
                      : getServiceName(query.pathname) === 'bus'
                        ? 'تاریخ حرکت'
                        : getServiceName(query.pathname) === 'flights' && !range
                          ? 'تاریخ حرکت'
                          : 'رفت'}
              </span>
              {value.from ? (
                // TODO add garegorian date here as well
                <div
                  className={classNames(
                    'text-center text-4 text-weight-500',
                    styles['date'],
                    styles[locale === 'en' ? 'gregorian' : 'jalali'],
                  )}
                >
                  <span className={cn(styles['main'], `${locale === 'en' && 'color-on-surface'}`)}>
                    {DATE_UTILS.formatDate(value.from, {
                      lang: query.pathname.includes('international') ? 'fa' : locale,
                    })}
                  </span>
                  <div
                    className={cn(
                      styles['secondary'],
                      `text-center ltr ${locale == 'fa' && 'color-on-surface'} `,
                    )}
                  >
                    {DATE_UTILS.formatDate(value.from, {
                      lang: query.pathname.includes('international')
                        ? 'en'
                        : locale === 'en'
                          ? 'fa'
                          : 'en',
                    })}
                  </div>
                </div>
              ) : (
                <span>
                  {query.pathname.includes('international') && !range
                    ? 'تاریخ پرواز را مشخص کنید'
                    : query.pathname.includes('hotel')
                      ? 'تاریخ ورود به هتل را مشخص کنید'
                      : query.pathname.includes('flights')
                        ? 'تاریخ پرواز را مشخص کنید'
                        : 'تاریخ حرکت را مشخص کنید'}
                </span>
              )}
            </div>
            {range && (
              <>
                <div className={styles['datepicker__footer--divider']} />
                <div
                  className={classNames(
                    styles['datepicker__footer--to'],
                    !value.to && value.from ? styles['active'] : '',
                  )}
                >
                  <span
                    className={classNames(
                      view === 'desktop' && 'd-inline-block mx-4',
                      styles['title'],
                    )}
                  >
                    {application === 'myTravels'
                      ? 'تا تاریخ'
                      : getServiceName(query.pathname) === 'hotel'
                        ? 'خروج'
                        : 'برگشت'}
                  </span>
                  {value.to ? (
                    <div
                      className={classNames(
                        'text-center text-4 text-weight-500',
                        styles['date'],
                        styles[locale === 'en' ? 'gregorian' : 'jalali'],
                      )}
                    >
                      <span
                        className={cn(styles['main'], `${locale === 'en' && 'color-on-surface'}`)}
                      >
                        {DATE_UTILS.formatDate(value.to, {
                          lang: query.pathname.includes('international') ? 'fa' : locale,
                        })}
                      </span>
                      <div
                        className={cn(
                          styles['secondary'],
                          `text-center ltr ${locale == 'fa' && 'color-on-surface'} `,
                        )}
                      >
                        {DATE_UTILS.formatDate(value.to, {
                          lang: query.pathname.includes('international')
                            ? 'en'
                            : locale === 'en'
                              ? 'fa'
                              : 'en',
                        })}
                      </div>
                    </div>
                  ) : (
                    <span>
                      {getServiceName(query.pathname) === 'hotel'
                        ? 'تاریخ خروج از هتل را مشخص کنید'
                        : query.pathname.includes('flights')
                          ? 'تاریخ پرواز را مشخص کنید'
                          : 'تاریخ حرکت را مشخص کنید'}
                    </span>
                  )}
                </div>
              </>
            )}
          </div>

          <button
            onClick={handleConfirm}
            disabled={value.from === null ? true : range && value.to === null}
            className={classNames(
              styles['datepicker__submit'],
              (!value.from || (range && !value.to)) && styles['datepicker__submit--disabled'],
            )}
          >
            تایید
          </button>
        </div>
      </div>
      <div className={styles['fix-page-height']} />
    </>
  );

  return (
    <>
      {
        <div className={styles.datepicker}>
          {/* <button onClick={clearDates}>X</button> */}
          {application !== 'myTravels' && (
            <div
              className={classNames(styles['datepicker__input'], 'color-on-surface-var')}
              style={
                query.pathname.includes('international')
                  ? {
                      height: '65px',
                    }
                  : {}
              }
              onClick={() => {
                setVisible(!visible);
              }}
            >
              <DateIcon className={styles['datepicker__icon']} />
              {value.from ? (
                <div
                  className="d-flex
                flex-lg-column
                align-items-lg-start
                flex-row
                justify-content-between
                w-100
                align-items-center"
                >
                  <span
                    className={classNames(
                      width! <= 992 && width! > 720 ? 'fs-2' : 'fs-4',
                      'color-on-surface',
                    )}
                    style={locale === 'en' ? { fontFamily: 'Roboto' } : undefined}
                  >
                    {!isMobile
                      ? DATE_UTILS.formatDate(value.from, { lang: locale }).slice(0, -4)
                      : DATE_UTILS.formatDate(value.from, { lang: locale })}
                  </span>
                  {query.pathname.includes('international') && (
                    <span
                      className={cn('text-2', locale === 'en' ? 'rtl' : 'ltr')}
                      style={locale === 'fa' ? { fontFamily: 'Roboto' } : undefined}
                    >
                      {DATE_UTILS.formatDate(value.from, {
                        lang: locale === 'en' ? 'fa' : 'en',
                        showWeekDay: false,
                      })}
                    </span>
                  )}
                </div>
              ) : range ? (
                placeHolder.from
              ) : (
                'تاریخ حرکت'
              )}
            </div>
          )}
          {range && (
            <>
              {application !== 'myTravels' && (
                <div className={styles['datepicker__divider']}>
                  <div />
                </div>
              )}
              {application !== 'myTravels' && (
                <div
                  onClick={() => {
                    setVisible(!visible);
                  }}
                  className={classNames(styles['datepicker__input'], 'color-on-surface-var')}
                  style={
                    query.pathname.includes('international')
                      ? {
                          height: '65px',
                        }
                      : {}
                  }
                >
                  <DateIcon className={styles['datepicker__icon']} />
                  {value.to ? (
                    <div
                      className="d-flex
                     align-items-lg-start
                     flex-lg-column
                     flex-row
                     justify-content-between
                      w-100 align-items-center"
                    >
                      <span
                        className={classNames(
                          width! <= 992 && width! > 720 ? 'fs-2' : 'fs-4',
                          'color-on-surface',
                        )}
                        style={locale === 'en' ? { fontFamily: 'Roboto' } : undefined}
                      >
                        {!isMobile
                          ? DATE_UTILS.formatDate(value.to, {
                              lang: locale,
                            }).slice(0, -4)
                          : DATE_UTILS.formatDate(value.to, { lang: locale })}
                      </span>
                      {query.pathname.includes('international') && (
                        <span
                          className={cn('text-2', locale === 'en' ? 'rtl' : 'ltr')}
                          style={locale === 'fa' ? { fontFamily: 'Roboto' } : undefined}
                        >
                          {DATE_UTILS.formatDate(value.to, {
                            lang: locale === 'en' ? 'fa' : 'en',
                            showWeekDay: false,
                          })}
                        </span>
                      )}
                    </div>
                  ) : (
                    placeHolder.to
                  )}
                </div>
              )}
            </>
          )}
          {view === 'mobile' ? (
            <>
              <Modal
                setVisible={setVisible}
                bottomSheet={true}
                onClose={() => setVisible(false)}
                visible={visible}
              >
                {content}
              </Modal>
            </>
          ) : (
            visible && content
          )}
        </div>
      }
    </>
  );
};

export default DatePicker;
