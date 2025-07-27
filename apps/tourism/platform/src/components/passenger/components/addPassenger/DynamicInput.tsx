import { Controller, useFormContext } from 'react-hook-form';

import useGetOptions from 'components/passenger/hooks/useGetOptions';
import ReSelect from './reselect/index';
import Input from './input/index';

import SelectDate from './selectDate';

import SelectGender from './selectGender';
import dayjs from 'dayjs';
import { toast } from 'react-toastify';
type DynamicInput = {
  id?: string;
  type?: string;
  label?: string;

  options?: { id?: string; title?: string }[];
  isReadOnly?: boolean;
  calendarType?: 'CALENDAR_TYPE_UNDEFINED' | 'CALENDAR_TYPE_GREGORIAN' | 'CALENDAR_TYPE_Hijri';
};

const DynamicInput = ({ id, type, label, isReadOnly = false, calendarType }: DynamicInput) => {
  const { control, watch } = useFormContext();
  //TO DO get service type from parent
  const optionaApi = useGetOptions('passenger');
  const nationality = watch('nationality');
  const readOnlyToast = (label: string, isReadOnly: boolean) => {
    isReadOnly && toast.error(`امکان ویرایش ${label} وجود ندارد`);
  };
  if (type === 'FIELD_TYPE_COUNTRY') {
    return (
      <Controller
        control={control}
        name={id as string}
        render={({ field }) => {
          return (
            <div
              onClick={() => {
                readOnlyToast(label as string, isReadOnly);
              }}
            >
              <ReSelect
                isReadOnly={isReadOnly}
                label={label || ''}
                options={optionaApi?.countries || []}
                field={field}
                setValue={(val) => {
                  field.onChange(val.value);
                }}
              />
            </div>
          );
        }}
      />
    );
  }
  if (type === 'FIELD_TYPE_OPTIONS') {
    const options = optionaApi?.options?.[id as string];
    return (
      <Controller
        name={id as string}
        control={control}
        render={({ field }) => {
          return (
            <div
              onClick={() => {
                readOnlyToast(label as string, isReadOnly);
              }}
            >
              {' '}
              <SelectGender
                options={options}
                label={label || ''}
                field={field}
                isReadOnly={isReadOnly}
              />
            </div>
          );
        }}
      />
    );
  }
  if (type === 'FIELD_TYPE_DATE') {
    let jalali = false;
    const names = ['year', 'month', 'day'];
    names[0] = `${id}-${names[0]}`;
    names[1] = `${id}-${names[1]}`;
    names[2] = `${id}-${names[2]}`;
    const currentYear = new Date().getFullYear();
    const currentPersianYear = dayjs().calendar('jalali').year();
    let startYear;
    let endYear;
    if (id === 'passportExpireDate') {
      startYear = currentYear;
      endYear = 2090;
    } else {
      if (nationality === 'IRN' && calendarType !== 'CALENDAR_TYPE_GREGORIAN') {
        jalali = true;
        startYear = currentPersianYear;
        endYear = 1300;
      } else {
        startYear = currentYear;
        endYear = 1930;
      }
    }
    // if (id === 'birthday') {
    //   jalali = true;
    // }
    return (
      <div
        onClick={() => {
          readOnlyToast(label as string, isReadOnly);
        }}
      >
        <SelectDate
          name={id as string}
          label={label || ''}
          jalali={jalali}
          startYear={startYear}
          endYear={endYear}
          isReadOnly={isReadOnly}
        />
      </div>
    );
  }

  if (
    type === 'FIELD_TYPE_NUMBER' ||
    type === 'FIELD_TYPE_TEXT' ||
    type === 'FIELD_TYPE_TEL' ||
    type === 'FIELD_TYPE_EMAIL'
  ) {
    return (
      <div
        onClick={() => {
          readOnlyToast(label as string, isReadOnly);
        }}
      >
        <Controller
          control={control}
          name={id as string}
          render={({ field }) => {
            return (
              <Input
                readOnly={isReadOnly}
                label={label || ''}
                inputMode={type === 'FIELD_TYPE_NUMBER' ? 'numeric' : 'text'}
                field={field}
                handleChange={(val) => field.onChange(val)}
              />
            );
          }}
        />
      </div>
    );
  }
  return <></>;
};

export default DynamicInput;
