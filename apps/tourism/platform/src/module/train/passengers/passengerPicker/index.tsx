import React from 'react';

import { ToastContainer } from 'react-toastify';
import cn from 'classnames';

import { DecreasePrimaryIcon, IncreasePrimaryIcon } from 'assets/icons';
import { ItemProps, passengerCountItems } from 'module/train/passenger/passengerCountItems';
import useDeviceDetect from 'utils/hooks/useDeviceDetect';
import { trainPassengerValidation } from 'utils/helpers/validations';
import { notify } from 'utils/notification';
import Button from 'components/button';
import { Passengers } from 'module/train/tickets/interface';
import { TCoupeType } from 'components/passengerInput/types';

import styles from './passengerPicker.module.scss';

interface Props {
  submitForm: () => void;
  passengers: Passengers;
  setPassengers: (passengers: (prevState: Passengers) => Passengers) => void;
  onClose?: () => void;
  setType: (type: string) => void;
  type: TCoupeType;
}

const PassengerCount = ({
  submitForm,
  passengers,
  setPassengers,
  onClose,
  setType,
  type,
}: Props) => {
  const device = useDeviceDetect();
  const handleChange = (key: keyof Passengers, newType: 'increment' | 'decrement') => {
    const newValue = { ...passengers };
    if (newType === 'increment') {
      newValue[key] = newValue[key]! + 1;
    } else {
      newValue[key] = newValue[key]! - 1;
    }

    try {
      //@ts-ignore
      trainPassengerValidation(newValue);
      setPassengers((prevState: Passengers) => ({ ...prevState, ...newValue }));
    } catch (error) {
      notify({
        config: {
          containerId: 'passenger-picker',
          autoClose: false,
          position: 'bottom-right',
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
            <>
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
                      disabled={passengers[item.type] === item?.minPassenger}
                      onClick={() => handleChange(item.type, 'decrement')}
                    >
                      <DecreasePrimaryIcon />
                    </button>
                  </div>
                </div>
                <div className="d-flex flex-column">
                  <span className="me-1">{item.title}</span>
                </div>
              </div>
              {!!passengers[item.type] && !!item.description && (
                <div dir="rtl" className={styles.info}>
                  {item?.description}
                </div>
              )}
            </>
          );
        })}
        <div className={styles['passenger-picker__divider']} />
        <div className="d-flex justify-content-around pt-3">
          <button
            className={cn(
              styles['passenger-picker__button'],
              type == 'COMPARTMENT_GENDER_WOMEN_ONLY'
                ? styles['passenger-picker__button--checked']
                : '',
            )}
            onClick={() => setType('COMPARTMENT_GENDER_WOMEN_ONLY')}
          >
            <span>ویژه خواهران</span>
          </button>
          <button
            className={cn(
              styles['passenger-picker__button'],
              type == 'COMPARTMENT_GENDER_MEN_ONLY'
                ? styles['passenger-picker__button--checked']
                : '',
            )}
            onClick={() => setType('COMPARTMENT_GENDER_MEN_ONLY')}
          >
            <span>ویژه برادران</span>
          </button>
          <button
            className={cn(
              styles['passenger-picker__button'],
              type == 'COMPARTMENT_GENDER_FAMILY'
                ? styles['passenger-picker__button--checked']
                : '',
            )}
            onClick={() => setType('COMPARTMENT_GENDER_FAMILY')}
          >
            <span>مسافرین عادی</span>
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
export default PassengerCount;
