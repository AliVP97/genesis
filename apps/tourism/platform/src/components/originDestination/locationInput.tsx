import classNames from 'classnames';
import styles from './locationInput.module.scss';
import { PlaceIcon, ClearIcon as CloseIcon } from 'assets/icons';
import { ChangeEvent, FC, ReactNode, Ref, useEffect, useState } from 'react';
import { LocationType } from './interface';
import useDeviceDetect from 'utils/hooks/useDeviceDetect';

interface Props {
  name: string | LocationType;
  mode?: 'origin' | 'destination' | 'default';
  placeholder?: string;
  icon?: boolean;
  onChange?: (value: string, name: string) => void;
  handleClick?: (v: LocationType) => void;
  children?: ReactNode;
  inputRef?: Ref<HTMLInputElement> | null;
  readOnly?: boolean;
  customIcon?: ReactNode;
  maskClass?: string;
  className?: string;
  style?: string;
  desktopValue?: string;
  clearButton?: boolean;
  onClearInput?: () => void;
}

const LocationInput: FC<Props> = ({
  name,
  mode = 'default',
  placeholder,
  icon = false,
  onChange,
  handleClick,
  children,
  inputRef,
  readOnly,
  customIcon,
  maskClass = '',
  className = '',
  style = '',
  desktopValue,
  clearButton = false,
  onClearInput,
}) => {
  const { isMobile } = useDeviceDetect();
  const [value, setValue] = useState<string | null>(null);
  const handleChange = ({ target }: ChangeEvent<HTMLInputElement>) => {
    if (!onChange) return;
    onChange(target.value, target.name);
  };

  const onClick = () => {
    if (!handleClick) return;
    handleClick(name as LocationType);
  };
  useEffect(() => {
    if (desktopValue !== '' && desktopValue) setValue(desktopValue);
    else {
      setValue(placeholder!);
    }
  }, [placeholder, desktopValue]);

  const handleClearInput = () => {
    onClearInput?.();
  };

  return (
    <div
      className={classNames(styles.location, styles[`location--${mode}`], className)}
      onClick={onClick}
    >
      {icon && (
        <span className={classNames(styles.location__icon)}>
          {customIcon ? customIcon : <PlaceIcon />}
        </span>
      )}
      {
        <span
          className={classNames(styles['location__clear-button'], 'fill-on-surface')}
          onClick={handleClearInput}
        >
          {clearButton && <CloseIcon />}
        </span>
      }
      {isMobile && (
        <input
          maxLength={40}
          autoComplete="off"
          ref={inputRef}
          onChange={handleChange}
          name={name}
          className={classNames(styles.location__input)}
          id="somethingverygood"
          style={
            icon
              ? { minHeight: '64px', padding: '20px', paddingRight: '54px' }
              : { padding: '20px', paddingRight: '54px' }
          }
          type="text"
          placeholder={placeholder}
          readOnly={isMobile && readOnly}
        />
      )}
      {isMobile ? (
        children && <div className={classNames(styles.location__mask, maskClass)}>{children}</div>
      ) : (
        <div className={classNames(styles.location__mask, maskClass)}>
          {!isMobile && (name == 'origin' || name == 'destination') && (
            <input
              ref={inputRef}
              onChange={handleChange}
              name={name}
              className={classNames(styles[`${style}`])}
              type="text"
              readOnly={value !== '' && readOnly}
              autoComplete="off"
              id="origin_destination"
              onClick={() => setValue(null)}
            />
          )}
          {value && name != 'passenger' && (
            <span
              style={
                desktopValue
                  ? { display: 'none' }
                  : name == 'origin'
                    ? {
                        position: 'absolute',
                        right: '2.9rem',
                        background: 'inherit',
                      }
                    : name == 'destination'
                      ? {
                          position: 'absolute',
                          right: '2.9rem',
                          background: 'inherit',
                        }
                      : {}
              }
            >
              {value}
            </span>
          )}
          {name == 'passenger' && <div> {children}</div>}
        </div>
      )}
    </div>
  );
};

export default LocationInput;
