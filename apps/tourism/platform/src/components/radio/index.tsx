import classNames from 'classnames';
import React, { FC } from 'react';
import styles from './radio-element.module.scss';

interface Props {
  checked: boolean;
  value: string | Record<string, unknown>;
  label: string;
  className?: string;
  onChange(value: string | Record<string, unknown>): void;
  disabled?: boolean;
}

const RadioElement: FC<Props> = ({
  label,
  className,
  value,
  onChange,
  checked,
  disabled = false,
}) => {
  const handleClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (disabled) return;
    event.stopPropagation();
    onChange(value);
  };
  return (
    <div
      className={classNames(styles.radio, className, disabled && styles['radio--disabled'])}
      onClick={handleClick}
    >
      <div
        className={classNames(
          styles.circle__outer,
          checked && styles['circle__outer--active'],
          disabled && styles['circle__outer--disabled'],
        )}
      >
        <div
          className={classNames(
            styles.circle__inner,
            checked && styles['circle__inner--active'],
            checked && disabled && styles['circle__inner--disabled'],
          )}
        />
      </div>
      {label && (
        <span className={classNames(className, disabled && styles['label--disabled'])}>
          {label}
        </span>
      )}
    </div>
  );
};

export default RadioElement;
