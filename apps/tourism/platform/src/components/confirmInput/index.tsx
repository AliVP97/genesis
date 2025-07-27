import React, { ChangeEvent, FC, useEffect, useRef, useState } from 'react';
import { toLatin } from 'utils/helpers/numbers';
import cn from 'classnames';
import styles from './confirmInput.module.scss';

interface Props {
  count?: number;
  onSubmit: (val: string) => void;
  error?: boolean;
}

const ConfirmInput: FC<Props> = ({ count = 4, onSubmit, error }) => {
  const [values, setValues] = useState<string[]>(Array(count).fill(''));
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const numericCheck = (value: string) => {
    return /^\d*$/.test(value); // Only allow numeric values
  };

  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, [inputRefs.current]);

  const handleChange = (event: ChangeEvent<HTMLInputElement>, index: number) => {
    const value = toLatin(event.target.value);
    if (!numericCheck(value)) return;

    const newValues = [...values];
    newValues[index] = value;
    setValues(newValues);

    if (value && index < count - 1) {
      inputRefs.current[index + 1]?.focus();
    }

    if (newValues.every(Boolean)) {
      onSubmit(newValues.join(''));
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasteData = toLatin(e.clipboardData.getData('text')).split('');
    if (pasteData.every((item) => !numericCheck(item))) return;

    const newValues = Array(count).fill('');

    pasteData.forEach((char, index) => {
      if (index < count) newValues[index] = char;
    });

    setValues(newValues);
    inputRefs.current[count - 1]?.focus();

    if (newValues.every(Boolean)) {
      onSubmit(values.join(''));
    }
  };

  const handleKeyUp = (event: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (event.code === 'Backspace' && !values[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  return (
    <span
      className={cn(
        styles['confirm-input'],
        'd-flex flex-nowrap justify-content-center',
        `${error && styles['confirm-input--error']}`,
      )}
    >
      {Array.from({ length: count }, (_, index) => (
        <input
          key={index.toString() + 'confirmInput'}
          ref={(el) => (inputRefs.current[index] = el)}
          value={values[index]}
          onChange={(e) => handleChange(e, index)}
          onKeyUp={(e) => handleKeyUp(e, index)}
          onPaste={handlePaste}
          className="mx-2 text-5"
          inputMode="numeric"
          placeholder=" "
          maxLength={1}
          type="tel"
          autoComplete={index === 0 ? 'one-time-code' : 'off'}
        />
      ))}
    </span>
  );
};

export default ConfirmInput;
