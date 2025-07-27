import { AddPassenger, UserIcon } from 'assets/icons';
import AddPassengerForm from 'containers/passengers/form';
import UseAddMultiPassengers from 'module/internationalFlight/passenger/hooks/useAddMultiPassengers';
import React, { useEffect, useState } from 'react';

import { IPassenger } from 'services/general/passenger/interface';
import styles from './emptyPassengersAddForm.module.scss';
import Divider from 'components/divider';
import SelectedPassengerNumberWarning from '../../list/selectedPassengerNumberWarning';
import Spinner from 'components/spinner';
import SelectedInternationalTicket from 'module/internationalFlight/tickets/selectedTicket';
import cn from 'classnames';
import { getPassengersNumbers } from 'module/internationalFlight/passenger/utilities/checkPassengerNumbersValidity';
import { addPassengerMapper } from 'module/internationalFlight/passenger/utilities/helper';
import { FromSchema, ISelectedCountry } from 'containers/passengers/utilities/types';
import { validations } from '../../../../../train/passengers/form/validations';
import GetOrderResponseV2 from 'module/internationalFlight/checkout/types/GetOrderResponseV2';

type TEmptyPassengersAddFormProps = {
  getPassengers: () => void;
  orderData: GetOrderResponseV2;
  isLoading: boolean;
};

const EmptyPassengersAddForm = ({
  getPassengers,
  orderData,
  isLoading: isOrderLoading,
}: TEmptyPassengersAddFormProps) => {
  const [passengers, setPassengers] = useState<Array<IPassenger>>([]);
  const [isJalaliBirthdate] = useState<boolean>(true);
  // TODO : this array is duplicated it should be one
  const dynamicForms: Array<Array<FromSchema>> = [
    [
      {
        name: 'englishName',
        label: 'نام لاتین (مطابق با پاسپورت)',
        type: 'text',
        placeholder: '',
        rules: validations.LatinFirstName,
        visible: true,
        upperCase: true,
      },
      {
        name: 'englishFamily',
        label: 'نام خانوادگی لاتین (مطابق با پاسپورت)',
        type: 'text',
        placeholder: '',
        rules: validations.LatinLastName,
        visible: true,
        upperCase: true,
      },
      {
        name: ['BirthDay', 'BirthMonth', 'BirthYear'],
        label: 'تاریخ تولد',
        type: 'timeSelector',

        rules: {
          required: { value: true, message: 'تاریخ تولد الزامی می باشد' },
        },
        visible: true,
      },
      {
        name: 'gender',
        label: 'جنسیت',
        type: 'genderSelector',
        rules: validations.Gender,
        visible: true,
      },

      {
        name: 'passportId',
        label: 'شماره پاسپورت',
        type: 'text',
        placeholder: '',
        rules: validations.PassportNumber,
        visible: true,
      },
      {
        name: ['ExpireDay', 'ExpireMonth', 'ExpireYear'],
        label: 'تاریخ انقضای پاسپورت',
        type: 'timeSelector',
        rules: {
          required: {
            value: true,
            message: 'تاریخ انقضای پاسپورت الزامی می باشد',
          },
        },
        visible: true,
      },
      {
        name: 'passportCountry',
        label: 'کشور صادر کننده پاسپورت',
        type: 'countrySelector',
        placeholder: '',
        rules: validations.PassportCountry,
        visible: true,
      },

      {
        name: 'nationalId',
        label: 'کد ملی',
        type: 'text',
        inputMode: 'numeric',
        placeholder: '',
        rules: validations.NationalCode,
        visible: false,
      },
    ],
  ];
  const { addMultiPassengers, isLoading } = UseAddMultiPassengers(getPassengers);
  const { adult, child, infant, total } = getPassengersNumbers(orderData);
  const onSubmit = (data: Record<string, string | number | ISelectedCountry | undefined>) => {
    setPassengers((prev) => [...prev, addPassengerMapper(data, isJalaliBirthdate)]);
  };

  useEffect(() => {
    if (passengers.length === total) {
      addMultiPassengers(passengers);
    }
  }, [passengers]);

  const formRef = React.useRef<HTMLFormElement>(null);
  const [elRefs, setElRefs] = React.useState<Array<React.RefObject<HTMLFormElement>>>([]);
  React.useEffect(() => {
    for (let i = 0; i < (total || 0); i++) {
      setElRefs((prev) => [...prev, React.createRef<HTMLFormElement>()]);
    }
  }, []);

  const handelClick = () => {
    setPassengers([]);
    formRef.current?.requestSubmit();
    elRefs.forEach((item) => item.current?.requestSubmit());
  };
  // const handleJalaliChange = (e: boolean) => {
  //   setIsJalaliBirthdate(!e);
  // };
  return (
    <>
      <div className="d-none d-md-block">
        <div>
          {orderData && (
            <SelectedInternationalTicket orderData={orderData} isLoading={isOrderLoading} />
          )}
        </div>
      </div>
      <div className={cn(styles['add-multi-passengers'], 'mt-4')}>
        <div className="d-flex justify-content-end p-2 px-4">
          <span>انتخاب مسافران</span>
          <UserIcon />
        </div>

        <Divider type="horizontal" />
        <SelectedPassengerNumberWarning adult={adult} child={child} infant={infant} />
        <div className="px-4">
          {Array.from(Array(total).keys()).map((_, index) => (
            <div
              key={index.toString() + 'emptyPassengersAddForm'}
              className="rtl my-3 border-bottom"
            >
              <div className="color-grey-1 mb-3">
                <AddPassenger />
                <span className="pe-2">مسافر جدید</span>
              </div>
              {/*<div className=" d-flex ps-4 pt-3 justify-content-end">*/}
              {/*  <span className="ms-2 text-3"> تاریخ میلادی</span>*/}
              {/*  <SwitchButton*/}
              {/*    defaultChecked={!isJalaliBirthdate}*/}
              {/*    onChange={handleJalaliChange}*/}
              {/*  />*/}
              {/*</div>*/}
              <AddPassengerForm
                index={index}
                forms={dynamicForms}
                onSubmit={onSubmit}
                ref={elRefs[index]}
                showSubmit={false}
                loading={isLoading}
              />
            </div>
          ))}

          {isLoading ? (
            <Spinner />
          ) : (
            <button type="button" className="btn color-primary" onClick={handelClick}>
              تایید و ادامه
            </button>
          )}
        </div>
      </div>
    </>
  );
};

export default EmptyPassengersAddForm;
