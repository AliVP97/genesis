import cn from 'classnames';
import { ReactNode } from 'react';
import styles from './select.module.scss';
import SelectItems from './selectItems';
import { FieldValues } from 'react-hook-form';

interface Props<T> {
  label: string;
  suffix?: ReactNode;
  isError: boolean;
  errorText: string | undefined;
  field: T;
  className?: string;
  hotelClassName?: boolean;
  options?: Array<{ value: string; label: string }>;
  onChange?: (selectedOption: { value: string; label: string }) => void;
}

const CustomSelect = <T extends FieldValues>({
  label,
  suffix,
  isError,
  errorText,
  field,
  className,
  options,
  hotelClassName,
  onChange,
}: Props<T>) => {
  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedValue = event.target.value;
    const selectedOption = options?.find((option) => option.value === selectedValue);
    if (onChange && selectedOption) {
      onChange(selectedOption);
    }
  };
  return (
    <div className={`mb-3 ${className}`}>
      <div
        className={cn(
          styles['select'],
          isError ? styles['select--error'] : field.value ? styles['select--selected'] : '',
        )}
      >
        {onChange ? (
          <select
            className={cn(
              styles['select__selectTag'],
              hotelClassName ? styles['select__selectTag--hotel'] : '',
            )}
            {...field}
            onChange={handleChange}
          >
            <SelectItems name={field.name} label={label} options={options} selected={field.value} />
          </select>
        ) : (
          <select
            className={cn(
              styles['select__selectTag'],
              hotelClassName ? styles['select__selectTag--hotel'] : '',
            )}
            {...field}
          >
            <SelectItems name={field.name} label={label} options={options} selected={field.value} />
          </select>
        )}

        <label
          className={cn(
            styles['select__label'],
            field.value ? styles['select__label--active'] : '',
          )}
        >
          {field.value && label}
        </label>
        {suffix && <div className={styles['select__suffix']}>{suffix}</div>}
      </div>
      {isError && (
        <span className="color-error pe-3 pt-1 text-2 text-weight-500 d-block text-end">
          {errorText}
        </span>
      )}
    </div>
  );
};

export default CustomSelect;
