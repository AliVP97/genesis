import cn from 'classnames';
import { ControllerRenderProps, FieldValues } from 'react-hook-form';
import styles from './reSelect.module.scss';
import Select, { OptionProps, components } from 'react-select';
import { CloseCircleIcon } from 'assets/icons';
import { CountriesList } from 'services/general/passenger/interface';
import { useEffect, useState } from 'react';
import { PassportFormProps } from 'module/flights/passengers/tabSelect/interface';
import { FilterOptionOption } from 'react-select/dist/declarations/src/filters';

interface Props {
  label: string;
  isError: boolean;
  errorText: string | undefined;
  field:
    | ControllerRenderProps<FieldValues, string>
    | ControllerRenderProps<PassportFormProps, 'countryId'>;
  clearInput: (name: string) => void;
  options: CountriesList[];
  setValue: (data: object) => void;
  className?: string;
}

const createCountryOptions = (options: CountriesList[]) => {
  const filteredArr = Array.from(new Set(options?.map((item) => item.countryNameFa))).map(
    (name) => {
      return options.find((a) => a.countryNameFa === name);
    },
  );
  return filteredArr.map((item) => {
    return {
      label: item?.countryNameFa,
      value: item?.id,
      enLabel: item?.countryNameEn,
      countryAlpha2: item?.countryAlpha2,
      countryAlpha3: item?.countryAlpha3,
    };
  });
};

const Option = (
  props: OptionProps<{
    value: string;
    label: string;
    enLabel: string;
    countryAlpha2: string;
    countryAlpha3: string;
  }>,
) => {
  return (
    <div className="d-flex justify-content-between">
      <components.Option {...props}>
        <div className="d-flex justify-content-between">
          <span className="text-break text-end">{props.data.label}</span>
          <span className="text-break text-start">{props.data.enLabel}</span>
        </div>
      </components.Option>
    </div>
  );
};

const ReSelect = ({
  label,
  isError,
  errorText,
  field,
  clearInput,
  options,
  setValue,
  className,
}: Props) => {
  const [opt, setOpt] = useState<
    {
      value: string;
      label: string;
      enLabel: string;
      countryAlpha2: string;
      countryAlpha3: string;
    }[]
  >([{ value: '', label: '', enLabel: '', countryAlpha2: '', countryAlpha3: '' }]);
  useEffect(() => {
    setOpt(
      createCountryOptions(options) as {
        value: string;
        label: string;
        enLabel: string;
        countryAlpha2: string;
        countryAlpha3: string;
      }[],
    );
  }, []);

  const filterOptions = (
    candidate: FilterOptionOption<{
      value: string;
      label: string;
      enLabel: string;
      countryAlpha2: string;
      countryAlpha3: string;
    }>,
    input: string,
  ) => {
    if (input) {
      return (
        candidate.label.startsWith(input) ||
        candidate?.data?.enLabel?.toLowerCase().startsWith(input.toLowerCase()) ||
        candidate?.data?.countryAlpha3?.toLowerCase().startsWith(input.toLowerCase())
      );
    }
    return true;
  };

  return (
    <>
      <div className={`mb-3 ${className}`}>
        <div
          className={cn(
            styles['reSelect'],
            field.value ? styles['reSelect--selected'] : isError ? styles['reSelect--error'] : '',
          )}
        >
          <Select
            {...field}
            components={{ Option }}
            value={opt.find((a) => a.countryAlpha2 === field?.value?.countryAlpha2) || null}
            onChange={(option) =>
              setValue(
                option as {
                  value: string;
                  countryAlpha2: string;
                  countryAlpha3: string;
                  enLabel: string;
                },
              )
            }
            className={styles['reSelect__search']}
            classNamePrefix={field.value ? 'rc-select--active' : 'rc-select'}
            options={opt}
            placeholder={label}
            noOptionsMessage={() => 'موردی یافت نشد'}
            filterOption={filterOptions}
          />
          <label
            className={cn(
              styles['reSelect__label'],
              field.value ? styles['reSelect__label--active'] : '',
            )}
          >
            {field.value && label}
          </label>
          {field.value && (
            <CloseCircleIcon
              onClick={() => clearInput(field.name)}
              className={styles['reSelect__closeIcon']}
            />
          )}
        </div>
        {!field.value && isError && (
          <span className="color-error pe-3 pt-1 text-2 text-weight-500 d-block text-end">
            {errorText}
          </span>
        )}
      </div>{' '}
    </>
  );
};

export default ReSelect;
