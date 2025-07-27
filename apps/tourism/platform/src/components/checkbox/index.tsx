import cn from 'classnames';
import styles from './checkbox.module.scss';
import React from 'react';
import { ControllerRenderProps, FieldValues } from 'react-hook-form';

interface Props {
  id?: string;
  checked: boolean | undefined;
  disabled?: boolean;
  handleClick?: (e: React.MouseEvent<HTMLSpanElement>) => void;
  field?: ControllerRenderProps<FieldValues, string>;
  style?: React.CSSProperties;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const Checkbox = ({ id, disabled, checked, handleClick, field, style, onChange }: Props) => {
  return (
    <span
      className={cn(
        styles.checkbox,
        checked ? styles['checkbox--checked'] : '',
        disabled ? styles['checkbox--disabled'] : '',
      )}
      onClick={(e) => (handleClick ? handleClick(e) : null)}
    >
      <input
        id={id}
        checked={checked}
        type="checkbox"
        disabled={disabled}
        onChange={onChange ? onChange : () => null}
        {...field}
      />
      <span style={style} />
    </span>
  );
};

export default Checkbox;
