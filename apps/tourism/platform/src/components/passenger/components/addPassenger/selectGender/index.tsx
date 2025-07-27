import cn from 'classnames';

import styles from './select.module.scss';
import SelectItems from './selectItems';
import { FieldValues, useFormContext } from 'react-hook-form';
import { getErrorMessage } from 'components/passenger/utils/errorMessage';
import { ArrowDownIcon } from 'assets/icons';

type SelectGender = {
  label: string;

  field: FieldValues;

  options?: { options?: { id?: string; title?: string }[] };
  isReadOnly: boolean;
};

const SelectGender = ({ label, field, options, isReadOnly }: SelectGender) => {
  const {
    formState: { errors },
  } = useFormContext();

  return (
    <div style={isReadOnly ? { pointerEvents: 'none' } : undefined} className={`mb-3`}>
      <div
        className={cn(
          styles['select'],
          Boolean(getErrorMessage(errors, field.name))
            ? styles['select--error']
            : field.value && !isReadOnly
              ? styles['select--selected']
              : '',
        )}
      >
        <select className={cn(styles['select__selectTag'])} {...field}>
          <SelectItems label={label} options={options} selected={field.value} />
        </select>
        <label
          className={cn(
            styles['select__label'],
            field.value ? styles['select__label--active'] : '',
          )}
        >
          {field.value && label}
        </label>
        <div className={styles['select__suffix']}>
          <ArrowDownIcon />
        </div>
      </div>
      {!field.value && Boolean(getErrorMessage(errors, field.name)) && (
        <span className="color-red pe-3 pt-1 text-2 text-weight-500 d-block text-end">
          {getErrorMessage(errors, field.name)}
        </span>
      )}
    </div>
  );
};

export default SelectGender;
