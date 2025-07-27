import React, { useEffect } from 'react';

import { useSelector } from 'react-redux';
import { FormProvider } from 'react-hook-form';

import { RootState } from 'store';
import Invoice from 'module/train/checkout/components/invoice';
import { PaymentBottomSheet } from 'components/PaymentBottomSheet';
import { TrainTrackingEvent } from 'utils/ecommerce/application/mappers/train/events';
import { trainViewListItemModel } from 'utils/ecommerce/application/mappers/train/types';
import { BackArrowIcon } from 'assets/icons';
import { useCheckout } from './useCheckout';
import { TripItem } from './components/trip';

import styles from './styles/checkout.module.scss';

const Checkout = () => {
  const {
    orderData,
    back,
    isLoading,
    isBottomSheetOpen,
    onSubmit,
    onDismiss,
    onCreate,
    onSuccess,
    onError,
    setGateway,
    isMobile,
    formHook,
  } = useCheckout();

  const { trainData, trainPassengersLength } = useSelector(
    (state: RootState) => state?.ecommerceReducer?.ecomerceSlice,
  );

  useEffect(() => {
    if (trainData) {
      const trainEvent = new TrainTrackingEvent();
      trainEvent.viewCart(trainData as trainViewListItemModel, trainPassengersLength as number);
    }
  }, []);

  return (
    <FormProvider {...formHook}>
      <div className={styles.checkout__wrapper}>
        {isMobile && (
          <div className={!orderData?.trips?.[1] ? styles.checkout : styles['checkout--roundTrip']}>
            <div className="p-3 text-end d-flex flex-row-reverse">
              <BackArrowIcon className="fill-white" onClick={() => back()} />
              <span className="color-white text-3 mx-auto">بررسی نهایی و پرداخت</span>
            </div>
            {!orderData?.trips?.[1] ? (
              <TripItem type="oneWay" data={orderData?.trips?.[0]} />
            ) : (
              <>
                <TripItem type="toward" data={orderData?.trips?.[0]} />
                <div className={styles.checkout__divider} />
                <TripItem type="backward" data={orderData?.trips?.[1]} />
              </>
            )}
          </div>
        )}
        {orderData && (
          <>
            <Invoice
              serviceId={128}
              setGateway={setGateway}
              order={orderData}
              isLoading={isLoading}
              allowSubmit={formHook.formState.isValid}
              handlePaymentButton={formHook.handleSubmit(onSubmit)}
            />

            <PaymentBottomSheet
              open={isBottomSheetOpen}
              onDismiss={onDismiss}
              paymentHookOptions={{ onCreate, onSuccess, onError }}
            />
          </>
        )}
      </div>
    </FormProvider>
  );
};

export default Checkout;
