import React from 'react';

import { ToastContainer } from 'react-toastify';
import cn from 'classnames';

import { DecreasePrimaryIcon, IncreasePrimaryIcon } from 'assets/icons';
import { ItemProps, passengerCountItems } from 'module/flights/passenger/passengerCountItems';
import useDeviceDetect from 'utils/hooks/useDeviceDetect';
import { passengerCountValidate } from 'utils/helpers/validations';
import { Passengers } from 'module/flights/tickets/ticket/searchTicket/interface';
import { notify } from 'utils/notification';
import Button from 'components/button';

import styles from './passengerPicker.module.scss';

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
  type?: string;
}

const PassengerCount = ({ submitForm, passengers, setPassengers, onClose }: Props) => {
  const device = useDeviceDetect();
  const handleChange = (key: keyof Passengers, type: 'increment' | 'decrement') => {
    const newValue = { ...passengers };
    if (type === 'increment') {
      newValue[key] = newValue[key] + 1;
    } else {
      newValue[key] = newValue[key] - 1;
    }
    try {
      passengerCountValidate(newValue);
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
            <div key={item.type} className={styles['passenger-picker--item']}>
              <div className={styles['passenger-picker--item-counter']}>
                <div className={styles['passenger-picker__counts--icon']}>
                  <button onClick={() => handleChange(item.type, 'increment')}>
                    <IncreasePrimaryIcon
                      className={cn(
                        passengers?.adult + passengers?.child + passengers?.infant >= 9
                          ? styles['passenger-picker__counts--disabled']
                          : '',
                      )}
                    />
                  </button>
                </div>
                <div className={styles['passenger-picker__counts']}>
                  <span className="d-inline-block text-weight-bold" dir="rtl">
                    {passengers[item.type]}
                  </span>
                </div>
                <div className={styles['passenger-picker__counts--icon']}>
                  <button
                    disabled={!passengers[item.type]}
                    onClick={() => handleChange(item.type, 'decrement')}
                  >
                    <DecreasePrimaryIcon
                      className={cn(
                        !passengers[item.type] || (item.type === 'adult' && passengers?.adult === 1)
                          ? styles['passenger-picker__counts--disabled']
                          : '',
                      )}
                    />
                  </button>
                </div>
              </div>
              <div dir="rtl">{item.title}</div>
            </div>
          );
        })}

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
