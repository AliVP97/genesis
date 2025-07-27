import cn from 'classnames';
import { ControllerRenderProps, FieldValues, useFormContext } from 'react-hook-form';
import styles from './reSelect.module.scss';
import Select, { OptionProps, components } from 'react-select';
import { useMemo } from 'react';
import { getErrorMessage } from 'components/passenger/utils/errorMessage';
import useDeviceDetect from 'utils/hooks/useDeviceDetect';
import { FilterOptionOption } from 'react-select/dist/declarations/src/filters';

type Country = {
  id?: string;
  englishCountryName?: string;
  persianCountryName?: string;
  countryAlpha3?: string;
  countryAlpha2?: string;
};

type NationalityDropDown = {
  label: string;
  isReadOnly: boolean;
  field: ControllerRenderProps<FieldValues, any>;
  options: Country[];
  setValue: (data: Record<string, string>) => void;
  className?: string;
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
const customStyles = {
  menu: (provided: any) => ({
    ...provided,
    maxHeight: 90,
    overflowY: 'auto',
  }),
};

const ReSelect = ({
  label,
  field,
  options,
  setValue,
  className,
  isReadOnly,
}: NationalityDropDown) => {
  const {
    formState: { errors },
  } = useFormContext();
  const { isMobile } = useDeviceDetect();
  const opt = useMemo(() => {
    return options.map((item) => {
      return {
        label: item?.persianCountryName as string,
        value: item?.id as string,
        enLabel: item?.englishCountryName as string,
        countryAlpha2: item?.countryAlpha2 as string,
        countryAlpha3: item?.countryAlpha3 as string,
      };
    });
  }, [options]);

  // Custom DropdownIndicator to hide when readonly
  const DropdownIndicator = (props: any) => {
    if (isReadOnly) {
      return null; // Hide dropdown icon when readonly
    }
    return <components.DropdownIndicator {...props} />;
  };
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
      <div
        style={isReadOnly ? { pointerEvents: 'none' } : undefined}
        className={`mb-3 ${className}`}
      >
        <div
          className={cn(
            styles['reSelect'],
            field.value && !isReadOnly
              ? styles['reSelect--selected']
              : Boolean(getErrorMessage(errors, field.name))
                ? styles['reSelect--error']
                : '',
          )}
        >
          <Select
            styles={isMobile ? undefined : customStyles}
            {...field}
            components={{ Option, DropdownIndicator }} // Add DropdownIndicator here
            value={opt.find((a) => a.value === field?.value) || null}
            onChange={(selected) => {
              setValue(selected as Country);
            }}
            className={styles['reSelect__search']}
            classNamePrefix={field.value ? 'rc-select--active' : 'rc-select'}
            options={opt}
            placeholder={label}
            noOptionsMessage={() => 'موردی یافت نشد'}
            filterOption={filterOptions}
            // filterOption={filterOptions}
          />
          <label
            className={cn(
              styles['reSelect__label'],
              field.value ? styles['reSelect__label--active'] : '',
            )}
          >
            {field.value && label}
          </label>
        </div>
        {!field.value && Boolean(getErrorMessage(errors, field.name)) && (
          <span className="color-red pe-3 pt-1 text-2 text-weight-500 d-block text-end">
            {getErrorMessage(errors, field.name)}
          </span>
        )}
      </div>
    </>
  );
};

export default ReSelect;
