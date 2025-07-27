import { monthNames } from 'utils/hooks/useTimeConvertor';
import { daysList, monthsList, yearsList } from 'utils/helpers/dateStatics';
import { twoDigit } from 'module/flights/passengers/tabSelect/helper';
import styles from './select.module.scss';
import cn from 'classnames';
import { useRouter } from 'next/router';

interface Props {
  name: string | undefined;
  label: string;
  daysInMonth?: number;
  jalali?: boolean;
  options?: Array<{ value: string; label: string }>;
  selected?: string;
  enMonthDaysFull?: boolean;
}

const SelectItems = ({
  name,
  daysInMonth,
  jalali,
  options,
  selected,
  enMonthDaysFull,
  label,
}: Props) => {
  const { query } = useRouter();
  return (
    <>
      <option hidden selected className={cn(styles['select-items'])}>
        {label}
      </option>
      {name === 'gender' ? (
        <>
          <option value="GENDER_TYPE_MALE" className={cn(styles['select-items'])}>
            مرد
          </option>
          <option value="GENDER_TYPE_FEMALE" className={cn(styles['select-items'])}>
            زن
          </option>
        </>
      ) : name === 'BirthDay' || name === 'ExpireDay' ? (
        daysList(daysInMonth).map((item) => (
          <option key={item} value={item} className={cn(styles['select-items'])}>
            {parseInt(item)}
          </option>
        ))
      ) : name === 'BirthMonth' || name === 'ExpireMonth' ? (
        monthsList().map((item) => (
          <option key={item} value={twoDigit(item + 1)} className={cn(styles['select-items'])}>
            {monthNames(item, !jalali ? 'en' : 'fa', false, enMonthDaysFull)}
          </option>
        ))
      ) : name === 'BirthYear' ? (
        yearsList(!jalali ? 'en' : 'fa').map((item) => (
          <option key={item} value={item} className={cn(styles['select-items'])}>
            {item}
          </option>
        ))
      ) : name === 'ExpireYear' ? (
        yearsList(!jalali ? 'en' : 'fa', true).map((item) => (
          <option key={item} value={item} className={cn(styles['select-items'])}>
            {item}
          </option>
        ))
      ) : name === 'visaType' ? (
        query.name == 'dubai' ? (
          <>
            <option value="single-10" className={cn(styles['select-items'])}>
              ۱۰ روزه (یک بار ورود)
            </option>
            <option value="single-30" className={cn(styles['select-items'])}>
              ۳۰ روزه (یک بار ورود)
            </option>
            <option value="multi-30" className={cn(styles['select-items'])}>
              ۳۰ روزه (چند بار ورود)
            </option>
            <option value="single-60" className={cn(styles['select-items'])}>
              ۶۰ روزه (یک بار ورود)
            </option>
            <option value="multi-60" className={cn(styles['select-items'])}>
              ۶۰ روزه (چند بار ورود)
            </option>
          </>
        ) : (
          <>
            <option value="normal-14" className={cn(styles['select-items'])}>
              توریستی عادی (۱۴روزه) استیکر
            </option>
            <option value="instant-14" className={cn(styles['select-items'])}>
              توریستی فوری (۱۴روزه) استیکر
            </option>
            <option value="electronic-14" className={cn(styles['select-items'])}>
              توریستی الکترونیک (۱۴ روزه)
            </option>
          </>
        )
      ) : name === 'stayingTime' ? (
        daysList(daysInMonth).map((item) => (
          <option key={item} value={item} className={cn(styles['select-items'])}>
            {parseInt(item) + ' شب'}
          </option>
        ))
      ) : name === 'childAge' ? (
        <>
          <option
            value="CHILD_1"
            className={cn(styles['select-items'])}
            selected={selected === 'CHILD_1'}
          >
            کمتر از 1 سال
          </option>
          <option
            value="CHILD_2"
            className={cn(styles['select-items'])}
            selected={selected === 'CHILD_2'}
          >
            1 تا 2 سال
          </option>
          <option
            value="CHILD_3"
            className={cn(styles['select-items'])}
            selected={selected === 'CHILD_3'}
          >
            2 تا 3 سال
          </option>
          <option
            value="CHILD_4"
            className={cn(styles['select-items'])}
            selected={selected === 'CHILD_4'}
          >
            3 تا 4 سال
          </option>
          <option
            value="CHILD_5"
            className={cn(styles['select-items'])}
            selected={selected === 'CHILD_5'}
          >
            4 تا 5 سال
          </option>
          <option
            value="CHILD_6"
            className={cn(styles['select-items'])}
            selected={selected === 'CHILD_6'}
          >
            5 تا 6 سال
          </option>
          <option
            value="CHILD_7"
            className={cn(styles['select-items'])}
            selected={selected === 'CHILD_7'}
          >
            6 تا 7 سال
          </option>
          <option
            value="CHILD_8"
            className={cn(styles['select-items'])}
            selected={selected === 'CHILD_8'}
          >
            7 تا 8 سال
          </option>
          <option
            value="CHILD_9"
            className={cn(styles['select-items'])}
            selected={selected === 'CHILD_9'}
          >
            8 تا 9 سال
          </option>
          <option
            value="CHILD_10"
            className={cn(styles['select-items'])}
            selected={selected === 'CHILD_10'}
          >
            9 تا 10 سال
          </option>
          <option
            value="CHILD_11"
            className={cn(styles['select-items'])}
            selected={selected === 'CHILD_11'}
          >
            10 تا 11 سال
          </option>
          <option
            value="CHILD_12"
            className={cn(styles['select-items'])}
            selected={selected === 'CHILD_12'}
          >
            11 تا 12 سال
          </option>
        </>
      ) : name === 'childNumber' ? (
        <>
          <option value="0" className={cn(styles['select-items'])} selected={selected === '0'}>
            صفر
          </option>
          <option value="1" className={cn(styles['select-items'])} selected={selected === '1'}>
            یک
          </option>
          <option value="2" className={cn(styles['select-items'])} selected={selected === '2'}>
            دو
          </option>
          <option value="3" className={cn(styles['select-items'])} selected={selected === '3'}>
            سه
          </option>
        </>
      ) : name === 'childWithoutBedNumber' ? (
        <>
          <option value="0" className={cn(styles['select-items'])} selected={selected === '0'}>
            صفر
          </option>
          <option value="1" className={cn(styles['select-items'])} selected={selected === '1'}>
            یک
          </option>
          <option value="2" className={cn(styles['select-items'])} selected={selected === '2'}>
            دو
          </option>
          <option value="3" className={cn(styles['select-items'])} selected={selected === '3'}>
            سه
          </option>
        </>
      ) : name === 'childWithBedNumber' ? (
        <>
          <option value="0" className={cn(styles['select-items'])} selected={selected === '0'}>
            صفر
          </option>
          <option value="1" className={cn(styles['select-items'])} selected={selected === '1'}>
            یک
          </option>
          <option value="2" className={cn(styles['select-items'])} selected={selected === '2'}>
            دو
          </option>
          <option value="3" className={cn(styles['select-items'])} selected={selected === '3'}>
            سه
          </option>
        </>
      ) : name === 'infantNumber' ? (
        <>
          <option value="0" className={cn(styles['select-items'])} selected={selected === '0'}>
            صفر
          </option>
          <option value="1" className={cn(styles['select-items'])} selected={selected === '1'}>
            یک
          </option>
          <option value="2" className={cn(styles['select-items'])} selected={selected === '2'}>
            دو
          </option>
          <option value="3" className={cn(styles['select-items'])} selected={selected === '3'}>
            سه
          </option>
        </>
      ) : name === 'adultNumber' ? (
        <>
          <option value="1" className={cn(styles['select-items'])} selected={selected === '1'}>
            یک
          </option>
          <option value="2" className={cn(styles['select-items'])} selected={selected === '2'}>
            دو
          </option>
          <option value="3" className={cn(styles['select-items'])} selected={selected === '3'}>
            سه
          </option>
          <option value="4" className={cn(styles['select-items'])} selected={selected === '4'}>
            چهار
          </option>
          <option value="5" className={cn(styles['select-items'])} selected={selected === '5'}>
            پنج
          </option>
        </>
      ) : name === 'select' ? (
        options?.map((option) => (
          <option key={option.value} value={option.value} className={cn(styles['select-items'])}>
            {option.label}
          </option>
        ))
      ) : null}
    </>
  );
};

export default SelectItems;
