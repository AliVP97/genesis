import React, { useRef } from 'react';

import { ToastContainer } from 'react-toastify';
import cn from 'classnames';

import { DecreasePrimaryIcon, IncreasePrimaryIcon } from 'assets/icons';
import { ItemProps, passengerCountItems } from 'module/train/passenger/passengerCountItems';
import useDeviceDetect from 'utils/hooks/useDeviceDetect';
import { internationalFlightPassengerValidation } from 'utils/helpers/validations';
import { notify } from 'utils/notification';
import Button from 'components/button';
import { Passengers } from 'module/internationalFlight/tickets/interface';
import { TCoupeType } from 'components/passengerInput/types';

import styles from './style.module.scss';

// import {CompartmentGenderType} from 'services/train/tickets/interface';

interface Props {
  submitForm: () => void;
  passengers: Passengers;
  setPassengers: (
    passengers: (prevState: Passengers) => {
      adult: number;
      infant: number;
      child: number;
    },
  ) => void;
  onClose?: () => void;
  setType?: (type: string) => void;
  type?: TCoupeType;
}

const InternationalFlightPassengerPicker = ({
  submitForm,
  passengers,
  setPassengers,
  onClose,
  setType,
  type,
}: Props) => {
  const device = useDeviceDetect();

  const errorNotificationIsVisible = useRef(false);

  const handleChange = (key: keyof Passengers, newType: 'increment' | 'decrement') => {
    const newValue = { ...passengers };
    if (newType === 'increment') {
      newValue[key] = newValue[key]! + 1;
    } else {
      newValue[key] = newValue[key]! - 1;
    }

    try {
      internationalFlightPassengerValidation(newValue);
      setPassengers((prevState: Passengers) => ({ ...prevState, ...newValue }));
    } catch (error) {
      if (!errorNotificationIsVisible.current)
        notify({
          config: {
            containerId: 'passenger-picker',
            autoClose: false,
            position: 'bottom-right',
            onOpen: () => (errorNotificationIsVisible.current = true),
            onClose: () => (errorNotificationIsVisible.current = false),
          },
          message: <span className="text-weight-500 fa">{(error as Error).message}</span>,
          type: 'warning',
        });
    }
  };

  return (
    <div
      className={cn(
        styles['passenger-picker'],
        device.isMobile ? styles['passenger-picker__mobile'] : '',
      )}
    >
      <div className={styles['passenger-picker__container']}>
        {passengerCountItems.map((item: ItemProps) => {
          return (
            <div key={item.type} className={styles['passenger-picker--item']}>
              <div className={styles['passenger-picker--item-counter']}>
                <div className={styles['passenger-picker__counts--icon']}>
                  <button onClick={() => handleChange(item.type, 'increment')}>
                    <IncreasePrimaryIcon />
                  </button>
                </div>
                <div className={styles['passenger-picker__counts']}>
                  <span className="d-inline-block text-weight-bold" dir="rtl">
                    {passengers[item.type]}
                  </span>
                </div>
                <div className={styles['passenger-picker__counts--icon']}>
                  <button
                    disabled={
                      item.type === 'adult' ? passengers[item.type] === 1 : !passengers[item.type]
                    }
                    onClick={() => handleChange(item.type, 'decrement')}
                  >
                    <DecreasePrimaryIcon />
                  </button>
                </div>
              </div>
              <div dir="rtl">{item.title}</div>
            </div>
          );
        })}
        <div className={styles['passenger-picker__divider']} />
        <div className="d-flex justify-content-around pt-3">
          {/* <button
            className={cn(
              styles['passenger-picker__button'],
              type == 'CABIN_TYPE_PREMIUM'
                ? styles['passenger-picker__button--checked']
                : '',
            )}
            onClick={() => setType?.('CABIN_TYPE_PREMIUM')}
          >
            <span>پرمیوم</span>
          </button> */}
          <button
            className={cn(
              styles['passenger-picker__button'],
              type == 'CABIN_TYPE_FIRST' ? styles['passenger-picker__button--checked'] : '',
            )}
            onClick={() => setType?.('CABIN_TYPE_FIRST')}
          >
            <span>فرست</span>
          </button>
          <button
            className={cn(
              styles['passenger-picker__button'],
              type == 'CABIN_TYPE_BUSINESS' ? styles['passenger-picker__button--checked'] : '',
            )}
            onClick={() => setType?.('CABIN_TYPE_BUSINESS')}
          >
            <span>بیزینس</span>
          </button>
          <button
            className={cn(
              styles['passenger-picker__button'],
              type == 'CABIN_TYPE_ECONOMY' ? styles['passenger-picker__button--checked'] : '',
            )}
            onClick={() => setType?.('CABIN_TYPE_ECONOMY')}
          >
            <span>اکونومی</span>
          </button>
        </div>

        {device.isMobile && (
          <Button
            onClick={() => {
              submitForm();
              if (onClose) {
                onClose();
              }
            }}
            className="d-block mt-3 w-100 btn btn-primary mb-2"
            radius
          >
            تایید
          </Button>
        )}
        <ToastContainer limit={1} containerId="passenger-picker" />
      </div>
    </div>
  );
};
export { InternationalFlightPassengerPicker };
