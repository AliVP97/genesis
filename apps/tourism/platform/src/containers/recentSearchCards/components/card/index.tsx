import { DATE_UTILS } from 'utils/helpers/dateUtils';
import { TRecentSearchCard as TProps } from '../../types';
import style from './style.module.scss';
import { ArrowLeftIcon2, ArrowLeftRightIcon, CalendarSmallIcon } from 'assets/icons';
import classNames from 'classnames';

export const Card = ({ data, onClick }: TProps) => {
  const handleClick = () => {
    onClick(data);
  };

  return (
    <div className={style['main']} onClick={handleClick}>
      <div className={style['origin-destination']}>
        {data.origin && (
          <>
            <div className={style['title']}>{data.origin?.title}</div>
            <div className={style['icon']}>
              {data.returnDate ? <ArrowLeftRightIcon /> : <ArrowLeftIcon2 />}
            </div>
          </>
        )}
        <div className={style['title']}>{data.destination?.title}</div>
      </div>
      <div className={style['date']}>
        <div className={style['icon']}>
          <CalendarSmallIcon />
        </div>
        <div
          className={classNames(
            data.calendarSystem !== 'JALALI' && style['latin'],
            data.returnDate && style['ltr'],
          )}
        >
          {data.returnDate ? (
            <>{`${
              data.departureDate &&
              DATE_UTILS.formatDate(data.departureDate, {
                lang: data.calendarSystem === 'JALALI' ? 'fa' : 'en',
                showWeekDay: false,
                showMonth: !DATE_UTILS.monthsAreEqual(
                  data.departureDate,
                  data.returnDate,
                  data.calendarSystem,
                ),
                showYear: false,
              })
            }- ${DATE_UTILS.formatDate(data.returnDate, {
              lang: data.calendarSystem === 'JALALI' ? 'fa' : 'en',
              showWeekDay: false,
              showYear: false,
            })}`}</>
          ) : (
            <>
              {data.departureDate &&
                DATE_UTILS.formatDate(data.departureDate, {
                  lang: data.calendarSystem === 'JALALI' ? 'fa' : 'en',
                  showWeekDay: true,
                  showYear: false,
                })}
            </>
          )}
        </div>
      </div>
    </div>
  );
};
