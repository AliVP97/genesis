import { ArrowDownIcon } from 'assets/icons';
import Input from 'components/input';
import ReSelect from 'components/reselect';
import CustomSelect from 'components/select';
import Index from 'components/selectDate';
import Spinner from 'components/spinner';
import moment from 'moment-jalaali';
import {
  Control,
  Controller,
  FieldValues,
  UseFormRegister,
  UseFormSetValue,
  UseFormWatch,
} from 'react-hook-form';
import style from './style.module.scss';

import { CountriesList } from 'services/general/passenger/interface';
import { AutoCompleteInput } from 'components/autoCompleteInput';
import { Device } from 'utils/interface';
import classNames from 'classnames';
import { FromSchema } from '../utilities/types';
import { PassengerPayload } from 'services/general/passenger/interface';
import { TAutoCompleteListItem } from 'components/autoCompleteInput';
import Checkbox from 'components/checkbox';
import { HTMLAttributes, useState } from 'react';
import { SetCountrySort } from '../utilities/sortCountry';
import { fixNumbers } from 'utils/helpers/numbers';
import cn from 'classnames';
type TFormGeneratorProps = {
  label: string;
  name: string | string[];
  timestampFieldName?: string;
  type: string;
  rules?: object;
  control: Control;
  error: string | undefined;
  watch?: UseFormWatch<FieldValues>;
  setValue: UseFormSetValue<FieldValues>;
  resetInput: (name: string, value?: FromSchema['defaultValue']) => void;
  isError: boolean;
  isJalali?: boolean;
  isEnMonthDaysFull?: boolean;
  defaultValue?: string | number | object | undefined | boolean;
  countries?: CountriesList[];
  device?: Device;
  autoCompleteSource?: FromSchema['autoCompleteSource'];
  autoCompleteCondition?: FromSchema['autoCompleteCondition'];
  onChange?: (e: TAutoCompleteListItem) => void; // type of "e" can be updated to support more types if necessary.
  className?: string | undefined;
  options?: Array<{ value: string; label: string }>;
  inputMode?: HTMLAttributes<HTMLInputElement>['inputMode'];
  hotelAddLeader?: boolean;
  register?: UseFormRegister<FieldValues>;
  validation?: object;
  upperCase?: boolean;
  disabled?: boolean;
};
const InputGenerator = ({
  type,
  name,
  timestampFieldName,
  rules,
  label,
  error,
  resetInput,
  watch,
  setValue,
  isError,
  control,
  defaultValue,
  countries,
  isJalali = false,
  isEnMonthDaysFull = false,
  device,
  autoCompleteSource,
  autoCompleteCondition,
  onChange,
  className,
  options,
  inputMode = 'text',
  hotelAddLeader,
  register,
  validation,
  upperCase,
  disabled = false,
}: TFormGeneratorProps) => {
  const handleAutoCompleteOnSelect = (selectedItem: TAutoCompleteListItem) => {
    onChange?.(selectedItem);
  };

  // checkbox:
  // change "defautValue" type to boolean.
  const [checked, setChecked] = useState(!!defaultValue);
  switch (type) {
    case 'text':
      return (
        <>
          <Controller
            name={name as string}
            rules={rules}
            control={control}
            defaultValue={defaultValue}
            render={({ field }) => {
              if (field.name === 'phoneNumber' || field.name === 'nationalId') {
                field.value = fixNumbers(field.value);
              }
              return (
                <>
                  <Input
                    field={field}
                    clearInput={() => resetInput(name as string)}
                    label={label}
                    errorText={error}
                    isError={isError}
                    suffixClassName=""
                    handleChange={(e) => field.onChange(e.target.value)}
                    className={className}
                    inputMode={inputMode}
                    register={register}
                    validation={validation}
                    upperCase={upperCase}
                    setValue={setValue}
                  />
                </>
              );
            }}
          />
        </>
      );
    case 'countrySelector':
      return (
        <>
          {countries && countries.length > 0 ? (
            <Controller
              name={name as string}
              control={control}
              rules={rules}
              defaultValue={defaultValue}
              render={({ field }) => (
                <ReSelect
                  isError={isError}
                  errorText={error}
                  label={label}
                  clearInput={() => resetInput(name as string)}
                  options={SetCountrySort(countries)}
                  field={field}
                  setValue={(value) => setValue(field.name, value)}
                />
              )}
            />
          ) : (
            <>
              <div className="mt-3">
                <Spinner />
              </div>
            </>
          )}
        </>
      );
    case 'genderSelector':
      return (
        <Controller
          name="gender"
          rules={rules}
          control={control}
          defaultValue={defaultValue}
          render={({ field }) => (
            <CustomSelect
              field={{ ...field, value: field.value || '' }}
              isError={isError}
              errorText={error}
              label={label}
              suffix={<ArrowDownIcon />}
            />
          )}
        />
      );
    case 'timeSelector':
      let timeDefaultValue =
        defaultValue?.toString() ||
        (timestampFieldName && control['_defaultValues'][timestampFieldName]);
      if (timeDefaultValue) {
        timeDefaultValue = isJalali
          ? moment.unix(Number(timeDefaultValue)).locale('fa-IR').format('jYYYY-jMM-jDD')
          : moment.unix(Number(timeDefaultValue)).format('YYYY-MM-DD');
      }

      return (
        <>
          {watch ? (
            <Index
              control={control}
              names={name as string[]}
              label={label}
              selectedMonth={watch(name[1])}
              selectedYear={watch(name[0])}
              selectedDay={watch(name[2])}
              jalali={isJalali}
              enMonthDaysFull={isEnMonthDaysFull}
              setValue={setValue}
              defaultValue={timeDefaultValue}
              hasErrors={isError}
            />
          ) : null}
        </>
      );
    case 'autoComplete':
      return (
        <Controller
          name={typeof name === 'string' ? name : ''}
          rules={rules}
          control={control}
          render={({ field }) => (
            <AutoCompleteInput
              device={device}
              field={field}
              hotelAddLeader={hotelAddLeader}
              filterCondition={(iteratedItem: PassengerPayload['body']) =>
                autoCompleteCondition?.(iteratedItem, field.value)
              }
              setValue={setValue}
              resultList={autoCompleteSource}
              resetInput={() => resetInput(name as string)}
              errorText={error}
              label={label}
              isError={isError}
              className={classNames('text-3 color-surface')}
              listLabel={['persianName', 'persianFamily', 'nationalId']} // review later
              value={['persianName', 'persianFamily', 'id']} // review later
              onSelect={handleAutoCompleteOnSelect}
              autoCompleteValues={['persianName', 'persianFamily', 'nationalId', 'phoneNumber']}
            />
          )}
        />
      );
    case 'checkbox':
      return (
        <>
          <Controller
            name={name as string}
            rules={rules}
            control={control}
            defaultValue={!!defaultValue}
            render={({ field }) => (
              <div className={cn(style['checkbox'], disabled && 'pe-none')}>
                <span>{label}</span>
                <Checkbox
                  field={field}
                  checked={checked}
                  handleClick={() => {
                    setChecked((checked) => !checked);
                  }}
                />
              </div>
            )}
          />
        </>
      );
    case 'stayingTime':
      return (
        <Controller
          name="stayingTime"
          rules={rules}
          control={control}
          defaultValue={defaultValue}
          render={({ field }) => (
            <CustomSelect
              field={{ ...field, value: field.value || '' }}
              isError={isError}
              errorText={error}
              label={label}
              suffix={<ArrowDownIcon />}
            />
          )}
        />
      );
    case 'select':
      return (
        <Controller
          name={(name as string) || 'select'}
          rules={rules}
          control={control}
          defaultValue={defaultValue}
          render={({ field }) => (
            <CustomSelect
              field={{ ...field, value: field.value || '' }}
              isError={isError}
              errorText={error}
              label={label}
              suffix={<ArrowDownIcon />}
              options={options}
            />
          )}
        />
      );
    default:
      return null;
  }
};

export default InputGenerator;
