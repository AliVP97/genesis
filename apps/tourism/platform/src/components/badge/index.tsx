import { FC, HTMLAttributes } from 'react';

import cn from 'classnames';

import styles from './badge.style.module.scss';

type TBadgeProps = {
  type?: 'tonal' | 'filled' | 'outline';
  variant?:
    | 'error'
    | 'success'
    | 'warning'
    | 'info'
    | 'primary'
    | 'secondary'
    | 'tertiary'
    | 'neutral';
  disabled?: boolean;
  loading?: boolean;
  children: React.ReactNode;
} & HTMLAttributes<HTMLDivElement>;

export const Badge: FC<TBadgeProps> = ({
  type = 'tonal',
  variant = 'neutral',
  disabled = false,
  loading = false,
  className,
  children,
  ...props
}) => (
  <div
    className={cn(
      styles.badge,
      styles[`badge--${type}--${variant}`],
      disabled && styles[`badge--${type}--disabled`],
      loading && styles[`badge--${type}--loading`],
      className,
    )}
    {...props}
  >
    {children}
  </div>
);
