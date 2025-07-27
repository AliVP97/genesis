import React, { useEffect, useState } from 'react';
import styles from './styles/checkout.module.scss';
import { BackArrowIcon } from 'assets/icons';
import { useRouter } from 'next/router';
import Invoice from 'module/internationalFlight/checkout/components/invoice';
import { DetailItem } from './components/trip';
import useDeviceDetect from 'utils/hooks/useDeviceDetect';
import { useHandlePayment } from './hooks/useHandlePayment';
import { TDictionary } from 'services/internationalFlight/flight/interface';
import SelectedInternationalTicket from '../tickets/selectedTicket';
import { emailRegex } from 'utils/helpers/validations';
import cn from 'classnames';
import { FlightInternationalTracking } from 'utils/ecommerce/application/mappers/international-flight/events';
import { useSelector } from 'react-redux';
import { RootState } from 'store';
import { viewItemListModel } from 'utils/ecommerce/application/mappers/international-flight/types';
import { PaymentBottomSheet } from 'components/PaymentBottomSheet';
import useGetOrder from './hooks/useGetOrder';
import { useAppDispatch } from 'store/hook/storeHook';
import { onClickPaymentButton } from 'store/slices/internationalFlight/invoice';
import { useExpireContext } from 'utils/hooks/useExpireContext';

const Checkout = () => {
  const { back } = useRouter();
  const { isMobile } = useDeviceDetect();
  // const {data: order} = useQuery(['order', query.id as string], getOrderV2);
  const { order, refetchOrder } = useGetOrder();
  const [paymentBottomSheet, setPaymentBottomSheet] = useState(false);
  const [gatewayId, setGatewayId] = useState<undefined | number>();
  const [checkEmail, setCheckEmail] = useState(false);
  const { uuidExpired } = useExpireContext();
  const {
    setEmail,
    setPhoneNumber,
    submitMutate,
    isLoading,
    handleCreatePayment,
    handleConfirmPayment,
  } = useHandlePayment(gatewayId);

  const { internationalFlightCartObject } = useSelector(
    (state: RootState) => state?.ecommerceReducer?.ecomerceSlice,
  );
  const dictionary: TDictionary = {
    iataDictionary: order?.iataDictionary,
    aircraftDictionary: order?.aircraftDictionary,
    airlineDictionary: order?.airlineDictionary,
  };

  const itinerary = order?.order?.itinerary;
  const dispatch = useAppDispatch();
  useEffect(() => {
    if (
      internationalFlightCartObject instanceof Object &&
      'ticketsData' in internationalFlightCartObject
    ) {
      const internationalFlightTracking = new FlightInternationalTracking();
      internationalFlightTracking.viewCart(internationalFlightCartObject as viewItemListModel);
    }
  }, []);

  useEffect(() => {
    if (paymentBottomSheet) {
      dispatch(onClickPaymentButton(true));
    } else {
      dispatch(onClickPaymentButton(false));
    }
  }, [paymentBottomSheet]);

  return (
    <div className={styles.checkout__wrapper}>
      {isMobile && (
        <div
          className={
            String(order?.order?.itinerary?.tripMode) === 'TRIP_MODE_ROUND_TRIP'
              ? styles['checkout--roundTrip']
              : styles.checkout
          }
        >
          <div className="p-3 text-end d-flex flex-row-reverse">
            <BackArrowIcon className="fill-white" onClick={() => back()} />
            <span className={cn('color-white text-3 mx-auto', styles['header-title'])}>
              بررسی نهایی و پرداخت
            </span>
          </div>
          {String(order?.order?.itinerary?.tripMode) === 'TRIP_MODE_ONEWAY' ? (
            <DetailItem
              cabinTypeTitle={order?.order?.itinerary?.cabinType?.cabinTypeTitle}
              type="oneWay"
              flight={order?.order?.itinerary?.leavingFlight}
              dictionary={dictionary}
            />
          ) : (
            <>
              <DetailItem
                type="toward"
                flight={itinerary?.leavingFlight}
                dictionary={dictionary}
                cabinTypeTitle={itinerary?.cabinType?.cabinTypeTitle}
              />
              <div className={styles.checkout__divider} />
              <DetailItem
                type="backward"
                flight={itinerary?.returningFlight}
                dictionary={dictionary}
                cabinTypeTitle={itinerary?.cabinType?.cabinTypeTitle}
              />
            </>
          )}
        </div>
      )}
      {order && !isMobile && (
        <div className="mt-4">
          <SelectedInternationalTicket orderData={order} isLoading={isLoading} />
        </div>
      )}
      {order && (
        <>
          <Invoice
            refetchOrder={refetchOrder}
            serviceId={246}
            setGatewayId={setGatewayId}
            order={order}
            setPhoneNumber={setPhoneNumber}
            setEmail={(e) => {
              if (emailRegex(e)) {
                setCheckEmail(true);
              } else {
                setCheckEmail(false);
              }
              setEmail(e);
            }}
            isLoading={isLoading}
            handlePaymentButton={() => {
              if (isMobile) {
                if (checkEmail) {
                  setPaymentBottomSheet(true);
                }
              } else {
                submitMutate();
              }
            }}
          />
          <PaymentBottomSheet
            blocking={!uuidExpired}
            onDismiss={() => setPaymentBottomSheet(false)}
            paymentHookOptions={{
              onCreate: handleCreatePayment,
              onConfirm: handleConfirmPayment,
            }}
            open={paymentBottomSheet}
          />
        </>
      )}
    </div>
  );
};

export default Checkout;
