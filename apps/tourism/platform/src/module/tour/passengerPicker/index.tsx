import React, { FC, useState } from 'react';
import { ToastContainer } from 'react-toastify';
import Button from 'components/button';

import styles from './passengerPicker.module.scss';
import {
  ArrowDownIcon,
  DecreasePrimaryIcon,
  IncreseCirclePrimary,
  MinusCircleGrayIcon,
} from 'assets/icons';
import CustomSelect from 'components/select';
import { PersianIndexNumber } from 'utils/helpers/persianIndexNumber';
import { childAgeTypesOptions, validateRules } from './utils';
import { notify } from 'utils/notification';
import { TTourPassenger } from './types';

type TPassengerPicker = {
  passengers?: TTourPassenger;
  setPassengers: (passengers: TTourPassenger) => void;
  onSubmit: () => void;
};

export const TourPassengerPicker: FC<TPassengerPicker> = ({
  passengers,
  setPassengers,
  onSubmit,
}) => {
  const [adultCount, setAdultCount] = useState(passengers?.adult || 1);
  const [childCount, setChildCount] = useState(passengers?.child || 0);
  const [childAges, setChildAges] = useState<(number | null)[]>(passengers?.childAges as number[]);

  const increase = (type: 'adult' | 'child') => {
    if (type === 'adult') {
      setAdultCount((prev) => prev + 1);
    } else if (type === 'child') {
      setChildCount((prev) => prev + 1);
      setChildAges((prev) => [...(prev ?? []), null]);
    }
  };

  const decrease = (type: 'adult' | 'child') => {
    if (type === 'adult' && adultCount > 0) {
      setAdultCount((prev) => prev - 1);
    } else if (type === 'child' && childCount > 0) {
      setChildCount((prev) => prev - 1);
      setChildAges((prev) => prev.slice(0, -1));
    }
  };

  const handleChildAgeChange = (
    index: number,
    selectedOption: { value: string; label: string },
  ) => {
    const newChildAges = [...childAges];
    newChildAges[index] = Number(selectedOption.value);
    setChildAges(newChildAges);
  };

  const submitHandler = () => {
    const passengerData: TTourPassenger = {
      adult: adultCount,
      child: Number(childCount),
      ...(childCount > 0 && { childAges }),
    };

    const validationResult = validateRules(passengerData);

    if (typeof validationResult === 'string') {
      notify({
        type: 'error',
        message: validationResult,
        config: {
          position: 'bottom-center',
        },
      });
      return;
    }

    setPassengers(passengerData);
    onSubmit();
  };
  const isFormValid = () => {
    const passengerData: TTourPassenger = {
      adult: adultCount,
      child: childCount,
      ...(childCount > 0 && { childAges }),
    };

    const validationResult = validateRules(passengerData);
    notify({
      type: 'error',
      message: validationResult as string,
      config: {
        position: 'top-center',
      },
    });
    return validationResult === true && !childAges?.some((age) => !age);
  };

  return (
    <>
      <div className={styles['passenger-picker']}>
        <div className="d-flex flex-column rtl border-top m-3 pt-3">
          <div className="d-flex flex-column">
            <div className="d-flex justify-content-between pt-3 pb-2 px-0 mw-100">
              <span>
                بزرگسال
                <small> (12 سال به بالا) </small>
              </span>
              <div className="d-flex justify-content-between align-items-center">
                <IncreseCirclePrimary onClick={() => increase('adult')} />
                <div className={'px-4'}>{adultCount}</div>
                {adultCount > 0 ? (
                  <DecreasePrimaryIcon onClick={() => decrease('adult')} />
                ) : (
                  <MinusCircleGrayIcon />
                )}
              </div>
            </div>
            <div className="d-flex justify-content-between pt-3 pb-2 px-0 mw-100">
              <span>
                کودک
                <small> (0 تا 12 سال) </small>
              </span>
              <div className="d-flex justify-content-between align-items-center">
                <IncreseCirclePrimary onClick={() => increase('child')} />
                <div className={'px-4'}>{childCount}</div>
                {childCount > 0 ? (
                  <DecreasePrimaryIcon onClick={() => decrease('child')} />
                ) : (
                  <MinusCircleGrayIcon />
                )}
              </div>
            </div>
          </div>
          <div className="row">
            {childAges &&
              childAges?.map((age, index) => (
                <div className="col-md-6 px-2 mt-2" key={index.toString()}>
                  <CustomSelect
                    field={{ name: `select`, value: age || '' }}
                    label={`بازه سنی کودک ${PersianIndexNumber[index]}`}
                    options={childAgeTypesOptions}
                    suffix={<ArrowDownIcon />}
                    isError={!age}
                    errorText={!age ? 'سن کودک الزامی است.' : undefined}
                    hotelClassName
                    onChange={(selectedOption) => handleChildAgeChange(index, selectedOption)}
                  />
                </div>
              ))}
          </div>
        </div>

        <div className={styles['submit-button-wrap']}>
          <Button
            btnType={'button'}
            className="d-block mt-3 w-100 btn btn-primary mb-2"
            radius
            disabled={!isFormValid()}
            onClick={submitHandler}
          >
            تایید
          </Button>
        </div>
      </div>
      <ToastContainer limit={1} containerId="passenger-picker" />
    </>
  );
};
