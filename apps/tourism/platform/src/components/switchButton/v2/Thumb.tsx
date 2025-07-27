import { FC } from 'react';

import cn from 'classnames';

import { Spinner } from 'components/spinner/v2';
import { TThumbProps } from '.';
import { SelectedIcon, UnselectedIcon } from 'assets/icons';

import styles from './switch.module.scss';

export const Thumb: FC<TThumbProps> = ({ checked, disabled, loading, state, hasIcon }) => (
  <div
    className={cn(
      styles.thumb,
      checked && styles['thumb--checked'],
      disabled && styles['thumb--disabled'],
      loading && styles['thumb--loading'],
      state.hover && styles['thumb--hover'],
      state.focus && styles['thumb--focus'],
      state.active && styles['thumb--active'],
    )}
  >
    <div className={styles.thumb__handle} />
    <div className={cn(styles.thumb__overlay)} />
    <div className={styles.thumb__spinner}>
      <Spinner variant={checked ? 'primary' : 'on-primary'} />
    </div>
    {hasIcon && !loading && (
      <div className={styles.thumb__icon}>{checked ? <SelectedIcon /> : <UnselectedIcon />}</div>
    )}
  </div>
);
