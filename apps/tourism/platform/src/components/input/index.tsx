import styles from './input.module.scss';
import cn from 'classnames';
import { CloseCircleIcon } from 'assets/icons';
import { ChangeEvent, ReactNode, HTMLAttributes } from 'react';
import { FieldValues, UseFormRegister, UseFormSetValue } from 'react-hook-form';

interface Props<T> {
  label: string | JSX.Element;
  clearInput: (name: string) => void;
  suffix?: ReactNode;
  field: T;
  isError: boolean;
  errorText?: string;
  type?: 'text' | 'number';
  className?: string;
  inputMode?: HTMLAttributes<HTMLInputElement>['inputMode'];
  suffixClassName?: string;
  isFocused?: boolean;
  handleChange?: (e: ChangeEvent<HTMLInputElement>) => void;
  closeIcon?: () => void;
  showCloseIcon?: boolean;
  register?: UseFormRegister<FieldValues>;
  validation?: object;
  upperCase?: boolean;
  setValue?: UseFormSetValue<FieldValues>;
  readOnly?: boolean;
  maxLength?: number;
}

const Input = <T extends FieldValues>({
  label,
  clearInput,
  maxLength,
  suffix,
  field,
  isError,
  errorText,
  inputMode = 'text',
  type = 'text',
  className,
  suffixClassName,
  isFocused,
  handleChange,
  closeIcon,
  showCloseIcon = true,
  readOnly = false,
  register,
  validation,
  upperCase,
  setValue,
}: Props<T>) => {
  return (
    <div className={cn('mb-3', className)}>
      <div
        className={cn(
          styles['input'],
          isError
            ? styles['input--error']
            : field.value || isFocused
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
        {suffix && <div className={styles['input__suffix']}>{suffix}</div>}
        {field.value && showCloseIcon && (
          <CloseCircleIcon
            onClick={() => {
              clearInput(field.name);
              closeIcon && closeIcon();
            }}
            className={cn(
              styles['input__closeIcon'],
              suffix ? styles['input__closeIcon--suffix'] : '',
              suffixClassName,
            )}
          />
        )}
        {inputMode == 'numeric' ? (
          <input
            {...field}
            id={field.name}
            pattern="[0-9]*"
            maxLength={maxLength}
            className={cn(styles['input__placeHolder'], field.value ? 'pt-3' : '')}
            onChange={(e) => (handleChange ? handleChange(e) : {})}
            inputMode={inputMode}
          />
        ) : (
          <input
            readOnly={readOnly}
            {...field}
            id={field.name}
            type={type}
            className={cn(styles['input__placeHolder'], field.value ? 'pt-3' : '')}
            onChange={(e) => (handleChange ? handleChange(e) : {})}
            inputMode={inputMode}
            {...register?.(field.name, validation)}
            onInput={(e) => {
              upperCase && setValue?.(field.name, e.currentTarget.value.toUpperCase());
            }}
          />
        )}
      </div>
      {isError && (
        <span className="color-error pe-3 pt-1 text-2 text-weight-500 d-block text-end">
          {errorText}
        </span>
      )}
    </div>
  );
};

Input.defaultProps = {
  type: 'text',
};

export default Input;
