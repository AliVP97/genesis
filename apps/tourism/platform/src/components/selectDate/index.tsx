import cn from 'classnames';
import SelectItems from 'components/select/selectItems';
import {
  Control,
  Controller,
  FieldValues,
  Path,
  PathValue,
  UnpackNestedValue,
  UseFormSetValue,
} from 'react-hook-form';
import styles from 'module/flights/passengers/form/passengerForm.module.scss';
import { useEffect, useRef, useState } from 'react';
import useDeviceDetect from 'utils/hooks/useDeviceDetect';

interface Props<T extends FieldValues> {
  control: Control<T>;
  label: string;
  names: string[];
  hasErrors: boolean;
  defaultValue?: string;
  selectedMonth: string;
  selectedYear?: string;
  selectedDay?: string;
  jalali?: boolean;
  enMonthDaysFull?: boolean;
  required?: boolean;
  setValue?: UseFormSetValue<FieldValues>;
}

/**
 * The default year is 1999 because the this is non leap year and don't
 * have 29 days in February.
 */
const DEFAULT_GREGORIAN_YEAR = 1999;

/**
 * This function returns the number of days in a month based on the month number.
 * @param month - month number
 * @returns days in month
 */
const daysInJalaliMonth = (month: number) => (month > 6 ? 30 : 31);

/**
 * This function returns the number of days in a month based on the month number.
 * @param selectedYear selected year from user
 * @param month selected month with defined value
 * @returns days in month
 */
function daysInGregorianMonth(selectedYear: string | undefined, month: number) {
  const year = Number(selectedYear ?? DEFAULT_GREGORIAN_YEAR);
  const date = new Date(year, month, 0);

  return date.getDate();
}

const Index = <T extends FieldValues>({
  control,
  label,
  names,
  hasErrors,
  defaultValue,
  selectedMonth,
  selectedYear,
  selectedDay,
  jalali = true,
  enMonthDaysFull,
  required = true,
}: Props<T>) => {
  const lastDayInMonth = useRef<string>();
  const [daysInMonth, setDaysInMonth] = useState<number>(NaN);

  useEffect(() => {
    if (!selectedMonth || !selectedYear) {
      return;
    }

    const month = parseInt(selectedMonth);

    /**
     * The day is correct here because selectedYear is not year is a day.
     */
    const day = parseInt(selectedYear);

    /**
     * The year is correct here because selectedDay is not year is a day.
     */
    const year = selectedDay ? parseInt(selectedDay) : DEFAULT_GREGORIAN_YEAR;
    const date = new Date(year, month - 1, day);

    if (date.getMonth() + 1 !== month) {
      const newDate = new Date(year, month, 0);
      lastDayInMonth.current = newDate.getDate().toString();
    }
  }, [selectedDay, selectedYear, selectedMonth]);

  useEffect(() => {
    /**
     * The default month is 1 because the month number starts from 1 which is
     * for both Jalali and Gregorian has 31 days.
     */
    const defaultMonth = 1;
    const month = parseInt(selectedMonth) ?? defaultMonth;

    if (jalali) {
      setDaysInMonth(daysInJalaliMonth(month));
    } else {
      setDaysInMonth(daysInGregorianMonth(selectedDay, month));
    }
  }, [selectedMonth, selectedDay, jalali]);

  const { isMobile } = useDeviceDetect();
  return (
    <div className="mb-3">
      <div className={styles['passengerForm__selectDate']}>
        {isMobile && <div className={'pt-2 pe-3 color-on-surface-var'}>{label}</div>}
        <div
          className={cn(
            styles['passengerForm__selectDate--wrapper'],
            hasErrors
              ? styles['passengerForm__selectDate--wrapper--error']
              : selectedMonth && selectedDay && selectedYear
                ? styles['passengerForm__selectDate--wrapper--fill']
                : '',
          )}
        >
          {!isMobile && <div className="pt-1 pe-2 col-12 color-on-surface-var">{label}</div>}
          <div className={styles['passengerForm__selectDate--day']}>
            <Controller
              name={names[0] as Path<T>}
              rules={{ required }}
              control={control}
              defaultValue={defaultValue?.split('-')[2] as UnpackNestedValue<PathValue<T, Path<T>>>}
              render={({ field }) => {
                /**
                 * Update the day value when the user selects a month from last
                 * day of a month to another month. For example, when user
                 * select 31th of January and select February, the day value
                 * should be 28th of February.
                 */
                if (lastDayInMonth.current) {
                  field.onChange(lastDayInMonth.current);
                  lastDayInMonth.current = undefined;
                }

                return (
                  <>
                    <select
                      {...{
                        ...field,
                        value: field.value
                          ? field.value
                          : defaultValue
                            ? defaultValue?.split('-')[2]
                            : '',
                      }}
                      style={!isMobile ? { backgroundImage: 'none' } : {}}
                    >
                      <SelectItems
                        daysInMonth={daysInMonth}
                        name={names[0]}
                        label="روز"
                        jalali={jalali}
                      />
                    </select>
                  </>
                );
              }}
            />
          </div>
          <div className={styles['passengerForm__selectDate--month']}>
            <Controller
              name={names[1] as Path<T>}
              rules={{ required }}
              control={control}
              defaultValue={defaultValue?.split('-')[1] as UnpackNestedValue<PathValue<T, Path<T>>>}
              render={({ field }) => {
                return (
                  <>
                    <select
                      {...{
                        ...field,
                        value: field.value
                          ? field.value
                          : defaultValue
                            ? defaultValue?.split('-')[1]
                            : '',
                      }}
                      style={!isMobile ? { backgroundImage: 'none' } : {}}
                    >
                      <SelectItems
                        name={names[1]}
                        label="ماه"
                        jalali={jalali}
                        enMonthDaysFull={enMonthDaysFull}
                      />
                    </select>
                  </>
                );
              }}
            />
          </div>
          <div className={styles['passengerForm__selectDate--year']}>
            <Controller
              name={names[2] as Path<T>}
              rules={{ required }}
              control={control}
              defaultValue={defaultValue?.split('-')[0] as UnpackNestedValue<PathValue<T, Path<T>>>}
              render={({ field }) => {
                return (
                  <>
                    <select
                      {...{
                        ...field,
                        value: field.value
                          ? field.value
                          : defaultValue
                            ? defaultValue?.split('-')[0]
                            : '',
                      }}
                      style={!isMobile ? { backgroundImage: 'none' } : {}}
                    >
                      <SelectItems name={names[2]} label="سال" jalali={jalali} />
                    </select>
                  </>
                );
              }}
            />
          </div>
        </div>
      </div>
      {hasErrors && (
        <span className="color-error pe-3 pt-1 text-2 text-weight-500 d-block text-end">
          تاریخ الزامی می باشد
        </span>
      )}
    </div>
  );
};

export default Index;
