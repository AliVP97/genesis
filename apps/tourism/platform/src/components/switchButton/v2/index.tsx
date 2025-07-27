import { FC, HTMLAttributes, useState } from 'react';

import cn from 'classnames';

import { Thumb } from './Thumb';

import styles from './switch.module.scss';

export type TThumbProps = {
  hasIcon?: boolean;
  checked?: boolean;
  disabled?: boolean;
  loading?: boolean;
  state: { hover?: boolean; focus?: boolean; active?: boolean };
};

type TSwitchProps = {
  disabled?: boolean;
  loading?: boolean;
  small?: boolean;
  hasIcon?: boolean;
  checked?: boolean; // Controlled prop
  defaultChecked?: boolean; // Uncontrolled prop
  onChange: (checked: boolean) => void;
  ThumbComponent?: FC<TThumbProps>;
} & Omit<HTMLAttributes<HTMLLabelElement>, 'onChange'>;

export const Switch: FC<TSwitchProps> = ({
  disabled: disabledProp,
  loading,
  small = false,
  hasIcon = false,
  checked: controlledChecked, // Controlled prop
  defaultChecked = false, // Uncontrolled prop (default value)
  onChange,
  ThumbComponent = Thumb,
  ...props
}) => {
  const [uncontrolledChecked, setUncontrolledChecked] = useState(defaultChecked);

  const isControlled = controlledChecked !== undefined;

  const checked = isControlled ? controlledChecked : uncontrolledChecked;

  const [elementState, setElementState] = useState({
    hover: false,
    focus: false,
    active: false,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newChecked = e.target.checked;

    if (!isControlled) {
      setUncontrolledChecked(newChecked);
    }

    onChange?.(newChecked);
  };

  const disabled = disabledProp || loading;

  return (
    <label
      {...props}
      className={cn(
        styles.switch,
        small && styles.small,
        checked && styles['switch--checked'],
        disabled && styles['switch--disabled'],
        props.className,
      )}
      onMouseEnter={() => !disabled && setElementState((prev) => ({ ...prev, hover: true }))}
      onMouseLeave={() =>
        !disabled && setElementState((prev) => ({ ...prev, active: false, hover: false }))
      }
      onFocus={() => !disabled && setElementState((prev) => ({ ...prev, focus: !prev.hover }))}
      onBlur={() => !disabled && setElementState((prev) => ({ ...prev, focus: false }))}
      onMouseDown={() => !disabled && setElementState((prev) => ({ ...prev, active: true }))}
      onMouseUp={() => !disabled && setElementState((prev) => ({ ...prev, active: false }))}
    >
      <input type="checkbox" checked={checked} disabled={disabled} onChange={handleChange} />
      <ThumbComponent
        hasIcon={hasIcon}
        checked={checked}
        disabled={disabled}
        loading={loading}
        state={elementState}
      />
    </label>
  );
};
