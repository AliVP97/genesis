import React, { useEffect, useState, useRef } from 'react';
import styles from './switch.module.scss';
import cn from 'classnames';

interface Props {
  checked?: boolean;
  onChange?: (e: boolean) => void;
  className?: string;
  title?: string;
  defaultChecked?: boolean;
  disabled?: boolean;
}
const SwitchButton = ({
  checked: controlledChecked,
  onChange,
  className,
  title,
  defaultChecked,
  disabled,
}: Props) => {
  const didMount = useRef(false);

  const [checked, setChecked] = useState(!!defaultChecked);

  useEffect(() => {
    if (didMount.current)
      if (onChange) {
        onChange(checked);
      }
    didMount.current = true;
  }, [checked]);

  useEffect(() => {
    controlledChecked === undefined && setChecked(!!defaultChecked);
  }, [defaultChecked]);

  return (
    <div
      onClick={() => {
        controlledChecked === undefined && setChecked(!checked);
      }}
      className="d-flex"
    >
      <div className="col-6">
        <button
          disabled={disabled}
          type="button"
          role="switch"
          aria-checked={checked ? 'true' : 'false'}
          className={cn(
            styles['switch'],
            (checked || controlledChecked) && !disabled && styles['switch--checked'],
            className,
          )}
        >
          <div className={cn(styles['switch--handle'], className)} />
          <span className={styles['switch--inner']} />
        </button>
      </div>

      <span className="col-6 rtl">{title}</span>
    </div>
  );
};

export default SwitchButton;
