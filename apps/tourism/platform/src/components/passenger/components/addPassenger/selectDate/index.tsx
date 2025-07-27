import cn from 'classnames';
import dayjs from 'dayjs';
import { Controller, useFormContext } from 'react-hook-form';
import { useEffect, useState } from 'react';
import useDeviceDetect from 'utils/hooks/useDeviceDetect';
import { getErrorMessage } from 'components/passenger/utils/errorMessage';
import jalaliday from 'jalali-plugin-dayjs';
import styles from './passengerForm.module.scss';
dayjs.extend(jalaliday);
const getMonths = (jalali: boolean) => {
  const jalaliMonths = [
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

  const gregorianMonths = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];

  const months = jalali ? jalaliMonths : gregorianMonths;

  return months.map((month) => `${month}`);
};

type SelectDateProps = {
  label: string;
  name: string;
  defaultValue?: string;
  jalali?: boolean;
  startYear: number;
  endYear: number;
  isReadOnly: boolean;
};

const daysInJalaliMonth = (month: number) => (month <= 6 ? 31 : 30);
const daysInGregorianMonth = (year: number, month: number) =>
  dayjs(`${year}-${month}-01`).daysInMonth();

const SelectDate = ({
  label,
  name,
  jalali = true,
  startYear,
  endYear,
  isReadOnly,
}: SelectDateProps) => {
  const [daysInMonth, setDaysInMonth] = useState<number>(31);
  const {
    control,
    watch,
    formState: { errors },
  } = useFormContext();
  const { isMobile } = useDeviceDetect();

  const formatWithLeadingZero = (value: string | number) => value.toString().padStart(2, '0');
  const selected = watch(name);
  const yearOptions =
    startYear < endYear
      ? Array.from({ length: endYear - startYear + 1 }, (_, i) => startYear + i)
      : Array.from({ length: startYear - endYear + 1 }, (_, i) => startYear - i);

  useEffect(() => {
    if (!selected) return;

    const [year, month] = selected.split('-').map(Number);
    if (jalali && !month) {
      return;
    } else if (!jalali && !month && !year) {
      return;
    }

    setDaysInMonth(jalali ? daysInJalaliMonth(month) : daysInGregorianMonth(year, month));
  }, [selected, jalali]);

  return (
    <div style={isReadOnly ? { pointerEvents: 'none' } : undefined} className={styles['container']}>
      <div className={styles['passengerForm__selectDate']}>
        {isMobile && <div className={styles['passengerForm__selectDate--label']}>{label}</div>}
        <div
          className={cn(
            styles['passengerForm__selectDate--wrapper'],
            Boolean(getErrorMessage(errors, name))
              ? styles['passengerForm__selectDate--wrapper--error']
              : selected && !isReadOnly
                ? styles['passengerForm__selectDate--wrapper--fill']
                : '',
          )}
        >
          {!isMobile && <div className="pt-1 pe-2 col-12">{label}</div>}
          <Controller
            name={name}
            control={control}
            defaultValue=""
            render={({ field }) => {
              const handleDateChange = (type: string, value: string) => {
                const [year, month, day] = field.value ? field.value.split('-') : ['', '', ''];
                if (type === 'year') {
                  field.onChange(`${value || ''}-${month || ''}-${day || ''}`);
                } else if (type === 'month') {
                  field.onChange(`${year || ''}-${value || ''}-${day || ''}`);
                } else if (type === 'day') {
                  field.onChange(`${year || ''}-${month || ''}-${value || ''}`);
                }
              };

              return (
                <>
                  <div className={styles['passengerForm__selectDate--day']}>
                    <select
                      value={field.value?.split('-')[2] || ''}
                      onChange={(e) => handleDateChange('day', e.target.value)}
                      style={!isMobile ? { backgroundImage: 'none' } : {}}
                    >
                      <option value="" disabled>
                        روز
                      </option>
                      {Array.from({ length: daysInMonth }, (_, i) => (
                        <option key={i + 1} value={formatWithLeadingZero(i + 1)}>
                          {formatWithLeadingZero(i + 1)}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className={styles['passengerForm__selectDate--month']}>
                    <select
                      value={field.value?.split('-')[1] || ''}
                      onChange={(e) => handleDateChange('month', e.target.value)}
                      style={!isMobile ? { backgroundImage: 'none' } : {}}
                    >
                      <option value="" disabled>
                        ماه
                      </option>
                      {getMonths(jalali).map((month, index) => (
                        <option key={index + 1} value={formatWithLeadingZero(index + 1)}>
                          {month}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className={styles['passengerForm__selectDate--year']}>
                    <select
                      value={field.value?.split('-')[0] || ''}
                      onChange={(e) => handleDateChange('year', e.target.value)}
                      style={!isMobile ? { backgroundImage: 'none' } : {}}
                    >
                      <option value="" disabled>
                        سال
                      </option>
                      {yearOptions.map((year) => (
                        <option key={year} value={year}>
                          {year}
                        </option>
                      ))}
                    </select>
                  </div>
                </>
              );
            }}
          />
        </div>
      </div>
      {Boolean(getErrorMessage(errors, name)) && (
        <span className="color-red pe-3 pt-1 text-2 text-weight-500 d-block text-end">
          {getErrorMessage(errors, name)}
        </span>
      )}
    </div>
  );
};

export default SelectDate;
