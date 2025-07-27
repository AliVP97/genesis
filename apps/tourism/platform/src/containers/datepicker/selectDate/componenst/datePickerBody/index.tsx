import styles from '../../selectDate.module.scss';
import MyDatePicker from '../../../datepicker';
import SwitchButton from 'components/switchButton';
import { TDaysContents, TCalendarOccasions } from '../../../datepicker/types';
import { State as TMonthAndYear } from 'containers/datepicker/datepicker';

type TProps = {
  title: string | undefined;
  locale: 'en' | 'fa';
  handleChangeLocale: (e: boolean) => void;
  view: 'desktop' | 'mobile';
  onChange: (startDate: number | null, endDate: number | null) => void;
  changeLocalHandler: () => void;
  range: boolean;
  value: { to: null | number; from: null | number };
  application: string;
  daysContents: TDaysContents;
  allowSimilarDates: boolean;
  handleMonthChange?: (e: TMonthAndYear) => void;
  occasions?: TCalendarOccasions;
  showOccasions?: boolean;
  passScrollToParent?: (e: number) => void;
};

export const DatePickerBody = ({
  title,
  locale,
  handleChangeLocale,
  view,
  onChange,
  changeLocalHandler,
  range,
  value,
  application,
  daysContents,
  allowSimilarDates,
  handleMonthChange,
  occasions,
  showOccasions = true,
}: TProps) => {
  return (
    <>
      <div className={styles['datepicker__header']}>
        <span className={styles['title']}>{title}</span>
        <div className={styles['calendar-type-switch']}>
          <SwitchButton defaultChecked={locale === 'en'} onChange={handleChangeLocale} />
          <span className="mx-2">تقویم میلادی</span>
        </div>
      </div>
      <div className={styles['datepicker__container']}>
        <MyDatePicker
          view={view}
          onChange={onChange}
          locale={locale}
          onLocaleChange={changeLocalHandler}
          type={range ? 'range' : 'single'}
          doubleMonth={view === 'desktop'}
          showDatePicker
          startDate={value.from}
          endDate={value.to}
          application={application}
          daysContents={daysContents}
          allowSimilarDates={allowSimilarDates}
          occasions={occasions}
          onMonthChange={handleMonthChange}
          showOccasions={showOccasions}
        />
      </div>
    </>
  );
};
