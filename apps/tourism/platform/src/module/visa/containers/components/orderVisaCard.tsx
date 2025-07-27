import React, { useState } from 'react';
import cn from 'classnames';
import { useRouter } from 'next/router';
import { Controller, FieldValues, SubmitHandler, useForm } from 'react-hook-form';
import Button from 'components/button';
import CustomSelect from 'components/select';
import SwitchButton from 'components/switchButton';
import PassengerInput from 'components/passengerInput';
import { Passengers } from 'module/flights/tickets/ticket/searchTicket/interface';
import useDeviceDetect from 'utils/hooks/useDeviceDetect';
import { ArrowDownIcon } from 'assets/icons';
import styles from '../dubaiVisa.module.scss';
import { TVisaAddToCartEvent } from 'utils/ecommerce/application/mappers/visa/types';
import { VisaTracking } from 'utils/ecommerce/application/mappers/visa/events';
import { content } from 'module/visa/content';

type TPropsForm = {
  visaTypeDubai?: string;
  visaTypeRussia?: string;
  visaType?: string;
  visaRenewal: boolean;
};

const OrderVisaCard = () => {
  const { push, query } = useRouter();
  const { isMobile } = useDeviceDetect();
  const [passengers, setPassengers] = useState<Passengers>({
    adult: 1,
    child: 0,
    infant: 0,
  });
  const [showPassenger, setShowPassenger] = useState(false);
  const { handleSubmit, control, watch } = useForm<TPropsForm>({
    mode: 'all',
    defaultValues: { visaType: '', visaRenewal: false },
  });

  const visaType = watch('visaType');
  const visaTrackingModelCreator = (data: FieldValues): TVisaAddToCartEvent => {
    const adult = Number(passengers.adult);
    const child = Number(passengers.child);
    const infant = Number(passengers.infant);
    const checkoutEvent: TVisaAddToCartEvent = {
      quantity: adult + child + infant,
      item_varient: `${visaType}`,
      item_category2: data.visaRenewal,
      item_brand: query.name == 'dubai' ? content.dubai.title : content.russia.title,
    };
    return checkoutEvent;
  };
  const onSubmit: SubmitHandler<FieldValues> = (data) => {
    const visaTracking = new VisaTracking();
    data.numberAdults = passengers.adult;
    data.numberMinors = passengers.child;
    data.numberBabies = passengers.infant;
    data.visaName = query.name == 'dubai' ? 'dubai' : 'russia';
    data.visaRenewal = data.visaRenewal ? 1 : 0;
    visaTracking.addToCart(visaTrackingModelCreator(data));
    push({ pathname: '/visa/order', query: data });
  };

  return (
    <div className={styles['visa-detail-container__order-card']}>
      <p className="fw-bold color-on-surface">درخواست صدور ویزا</p>
      <div className={styles['visa-detail-container__divider']} />
      <div className="pt-3">
        <PassengerInput
          defaultStyle
          passengers={passengers}
          setPassengers={setPassengers}
          showPassenger={showPassenger}
          setShowPassenger={(value) => setShowPassenger(value)}
        />
      </div>
      <form className="mt-3" onSubmit={handleSubmit(onSubmit)}>
        <Controller
          control={control}
          name={'visaType'}
          render={({ field }) => (
            <CustomSelect
              field={{ ...field, value: field.value || '' }}
              isError={false}
              errorText={''}
              label="نوع ویزا"
              suffix={<ArrowDownIcon />}
              className={cn(isMobile && 'fs-2')}
            />
          )}
        />

        {query.name !== 'russia' && (
          <Controller
            control={control}
            name="visaRenewal"
            render={({ field }) => (
              <div className="d-flex align-items-center mb-3">
                <label className="fs-2 ps-2">درخواست تمدید ویزا دارم</label>
                <SwitchButton
                  defaultChecked={false}
                  onChange={(e) => field.onChange(e)}
                  className={styles['visa-detail-container__order-card__switch']}
                />
              </div>
            )}
          />
        )}
        <Button
          className={styles['visa-detail-container__order-card__button']}
          btnType="submit"
          loading={false}
          disabled={!visaType}
        >
          درخواست ویزا
        </Button>
      </form>
    </div>
  );
};
export default OrderVisaCard;
