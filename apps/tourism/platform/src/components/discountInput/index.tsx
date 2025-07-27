import {
  ChangeEventHandler,
  FC,
  InputHTMLAttributes,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import classNames from 'classnames';

import Spinner from 'components/spinner';

import styles from './discountInput.module.scss';
import { CheckCircle, CloseCircleIcon } from 'assets/icons';
import { DiscountStatus } from 'components/discount/types/discountTypes';

export type TDiscountInputProps = {
  label?: string;
  message?: string;
  isLoading?: boolean;
  isError?: boolean;
  isSuccess?: boolean;
  shouldHandleSubmit?: boolean;
  isSubmitDisabled?: boolean;
  status?: DiscountStatus;
  onClear?: () => void;
} & InputHTMLAttributes<HTMLInputElement>;

export const DiscountInput: FC<TDiscountInputProps> = ({
  className,
  disabled = false,
  label = 'کد تخفیف',
  message,
  defaultValue,
  isLoading = false,
  onChange,
  onFocus,
  onBlur,
  onClear,
  isSubmitDisabled,
  status,
  shouldHandleSubmit = true,
  ...props
}) => {
  const [value, setValue] = useState('');
  const [focused, setFocused] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);

  const changeHandler: ChangeEventHandler<HTMLInputElement> = (e) => setValue(e.target.value);
  const clearHandler = () => {
    onClear?.();
    setValue('');
  };
  const focusHandler = () => setFocused(true);
  const blurHandler = () => setFocused(false);

  useEffect(() => {
    if (typeof defaultValue === 'string') {
      setValue(defaultValue);
    }
  }, [defaultValue]);

  const buttonText = useMemo(
    () => (status === 'applied' ? 'حذف کد تخفیف' : 'اعمال کد تخفیف'),
    [status],
  );

  useEffect(() => {
    if (status === 'removed') {
      setValue('');
    }
  }, [status]);

  return (
    <div className={classNames(styles.field, className, 'bg-red')}>
      <div
        className={classNames(
          styles['field__discount-input'],
          focused && styles['--focused'],
          status === 'error' && styles['--error'],
          status === 'applied' && styles['--success'],
          disabled && styles['--disabled'],
        )}
      >
        <label
          className={classNames(
            styles['field__discount-input__label'],
            (focused || !!value) && styles['--focused'],
            disabled && styles['--disabled'],
          )}
          onClick={() => inputRef.current?.focus()}
        >
          {label}
        </label>
        <label className={styles['field__discount-input__input-container']}>
          {value && (
            <div
              className={classNames(
                styles['field__discount-input__input-container__icon'],
                status === 'applied' && styles['--success'],
              )}
            >
              {status === 'applied' && <CheckCircle />}
            </div>
          )}
          <input
            disabled={disabled}
            ref={inputRef}
            spellCheck="false"
            autoComplete="off"
            maxLength={15}
            value={value}
            onChange={(e) => {
              onChange?.(e);
              changeHandler(e);
            }}
            onFocus={(e) => {
              onFocus?.(e);
              focusHandler();
            }}
            onBlur={(e) => {
              onBlur?.(e);
              blurHandler();
            }}
            readOnly={status === 'applied'}
            {...props}
          />
        </label>
        {value && status !== 'applied' && !isLoading && (
          <CloseCircleIcon
            className={classNames(
              styles['field__discount-input__x-icon'],
              status === 'error' && styles['--error'],
            )}
            onClick={clearHandler}
          >
            x
          </CloseCircleIcon>
        )}
        {shouldHandleSubmit && value && status !== 'error' && (
          <button type="submit" disabled={isLoading || isSubmitDisabled}>
            {isLoading ? <Spinner /> : buttonText}
          </button>
        )}
      </div>
      {message && (
        <div
          className={classNames(
            styles.field__message,
            status === 'error' && styles['--error'],
            status === 'applied' && styles['--success'],
          )}
        >
          {message}
        </div>
      )}
    </div>
  );
};
