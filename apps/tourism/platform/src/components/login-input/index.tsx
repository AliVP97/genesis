import { FC, HTMLAttributes, HTMLInputTypeAttribute } from 'react';
import cn from 'classnames';
import styles from './login-input.module.scss';
import { Direction } from './interface';
import { ClearIcon } from 'assets/icons';
import { ControllerRenderProps } from 'react-hook-form';
import { MobileFormProps } from 'containers/login/interface';

interface Props {
  label: string;
  dir?: Direction;
  inputMode?: HTMLAttributes<HTMLInputElement>['inputMode'];
  className?: string;
  type?: HTMLInputTypeAttribute;
  errorText?: string;
  onChange?: (value: string) => void;
  isError?: boolean;
  autoFocus?: boolean;
  onClear: () => void;
  maxLength?: number;
  field: ControllerRenderProps<MobileFormProps>;
}

const LoginInput: FC<Props> = ({
  label,
  className,
  inputMode = 'text',
  type = 'text',
  dir = Direction.RTL,
  errorText = 'تست میکنیم',
  onClear,
  isError,
  field,
  maxLength,
}) => {
  return (
    <div className="input-container">
      <div className={styles['input']}>
        <input
          {...field}
          maxLength={maxLength}
          inputMode={inputMode}
          className={cn(
            styles['input__element'],
            isError && styles['input__element--error'],
            className,
            `text-${dir}`,
          )}
          type={type}
        />
        <label
          className={cn(
            styles['input__label'],
            `${field.value?.length && styles['input__label--active']}`,
          )}
        >
          {label}
        </label>
        {field.value.length > 0 && (
          <ClearIcon onClick={onClear} className={styles['input__clearIcon']} />
        )}
        {isError && <span className={cn(styles['input__error'])}>{errorText}</span>}
      </div>
    </div>
  );
};

export default LoginInput;
