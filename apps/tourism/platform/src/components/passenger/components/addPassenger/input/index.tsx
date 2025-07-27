import styles from './input.module.scss';
import cn from 'classnames';
import { CloseCircleIcon } from 'assets/icons';
import { ReactNode, HTMLAttributes, ChangeEvent } from 'react';
import { FieldValues, UseFormRegister, UseFormSetValue, useFormContext } from 'react-hook-form';
import { fixNumbers } from 'utils/helpers/numbers';
import { getErrorMessage } from 'components/passenger/utils/errorMessage';

type Input = {
  label: string | JSX.Element;

  suffix?: ReactNode;
  field: FieldValues;

  errorText?: string;
  type?: 'text' | 'number';
  className?: string;
  inputMode?: HTMLAttributes<HTMLInputElement>['inputMode'];
  suffixClassName?: string;
  isFocused?: boolean;
  handleChange: (e: ChangeEvent<HTMLInputElement> | string) => void;
  closeIcon?: () => void;
  showCloseIcon?: boolean;
  register?: UseFormRegister<FieldValues>;
  validation?: object;
  upperCase?: boolean;
  setValue?: UseFormSetValue<FieldValues>;
  readOnly?: boolean;
  maxLength?: number;
  value?: string;
};

const Input = ({
  label,

  field,
  inputMode = 'text',
  type = 'text',

  isFocused,
  handleChange,

  readOnly = false,
}: Input) => {
  const {
    formState: { errors },
    resetField,
  } = useFormContext();
  const isError = Boolean(getErrorMessage(errors, field.name));
  return (
    <div style={readOnly ? { pointerEvents: 'none' } : undefined} className={'mb-3'}>
      <div
        className={cn(
          styles['input'],
          isError
            ? styles['input--error']
            : (field.value || isFocused) && !readOnly
              ? styles['input--active']
              : '',
        )}
      >
        <label
          className={cn(
            styles['input__label'],
            field.value || isFocused ? styles['input__label--active'] : '',
          )}
          htmlFor={field.name}
        >
          {label}
        </label>
        {field.value && !readOnly && (
          <CloseCircleIcon
            onClick={() => {
              if (!readOnly) {
                resetField(field.name);
                handleChange('');
              }
            }}
            className={cn(styles['input__closeIcon'])}
          />
        )}
        {inputMode == 'numeric' ? (
          <input
            {...field}
            id={field.name}
            pattern="[0-9]*"
            className={cn(styles['input__placeHolder'], field.value ? 'pt-3' : '')}
            onChange={(e) => handleChange(fixNumbers(e.target.value))}
            inputMode={inputMode}
          />
        ) : (
          <input
            readOnly={readOnly}
            {...field}
            id={field.name}
            type={type}
            className={cn(styles['input__placeHolder'], field.value ? 'pt-3' : '')}
            onChange={(e) => handleChange(e)}
            inputMode={inputMode}
          />
        )}
      </div>
      {isError && (
        <span className="color-red pe-3 pt-1 text-2 text-weight-500 d-block text-end">
          {getErrorMessage(errors, field.name)}
        </span>
      )}
    </div>
  );
};

export default Input;
