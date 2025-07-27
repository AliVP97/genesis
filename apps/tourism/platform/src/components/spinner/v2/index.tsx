import React, { FC } from 'react';

import cn from 'classnames';

import styles from './style.module.scss';

type TSpinnerProps = {
  variant?: 'on-primary' | 'primary' | 'on-secondary-container';
} & React.HTMLAttributes<HTMLDivElement>;

export const Spinner: FC<TSpinnerProps> = ({ variant = 'primary', ...props }) => (
  <div {...props} className={cn(styles.spinner, styles[`spinner--${variant}`], props.className)} />
);
