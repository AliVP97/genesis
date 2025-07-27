import { ButtonHTMLAttributes, ReactNode, ComponentPropsWithoutRef, forwardRef } from 'react';
import cn from 'classnames';
import styles from './button.module.scss';
import Spinner from '../spinner';

type Props = {
  children: string | ReactNode;
  className?: string;
  btnType?: 'submit' | 'reset' | 'button';
  disabled?: boolean;
  type?: ButtonHTMLAttributes<'type'>;
  loading?: boolean;
  radius?: boolean;
  onClick?: () => void;
  form?: string;
} & ComponentPropsWithoutRef<'button'>;

const Button = forwardRef<HTMLButtonElement, Props>(function Button(
  {
    children,
    className = '',
    disabled,
    btnType = 'button',
    loading,
    radius,
    onClick,
    form,
    ...otherProps
  },
  ref,
) {
  return (
    <button
      ref={ref}
      type={btnType}
      form={form}
      disabled={disabled || loading}
      onClick={onClick}
      className={cn(styles.button, `${className} ${radius ? styles['button--radius'] : ''}`)}
      {...otherProps}
    >
      {loading ? <Spinner /> : children}
    </button>
  );
});

export default Button;
