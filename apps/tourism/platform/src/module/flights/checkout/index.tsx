import React, { useEffect, useState } from 'react';
import styles from './styles/checkout.module.scss';
import { BackArrowIcon } from 'assets/icons';
import { useRouter } from 'next/router';
import Invoice from 'module/flights/checkout/components/invoice';
import { DetailItem } from './components/trip';
import useDeviceDetect from 'utils/hooks/useDeviceDetect';
import { useQuery } from 'react-query';
import { getOrder } from 'services/domestic/orders';
import { useHandlePayment } from './hooks/useHandlePayment';
import PriceChangeModal from './components/priceChangeModal';
import { propsModel } from 'utils/ecommerce/application/mappers/domestic-flight/types';
import { DomesticFlightTrackingEvent } from 'utils/ecommerce/application/mappers/domestic-flight/events';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from 'store';
import { useSelectedTicket } from 'utils/hooks/useSelectedTicket';
import { domesticFlight } from 'store/slices/ecommerce/ecomerceSlice';
import { TGateway } from 'components/DynamicGateways';
import { PaymentBottomSheet } from 'components/PaymentBottomSheet';

const Checkout = () => {
  const { query, back } = useRouter();
  const { isMobile } = useDeviceDetect();
  const { data: order, refetch } = useQuery(['order', query.id as string], getOrder, {
    cacheTime: 0,
    staleTime: 0,
  });

  const [gateway, setGateway] = useState<TGateway | undefined>();
  const [paymentBottomSheet, setPaymentBottomSheet] = useState(false);
  const {
    setContactChange,
    setEmail,
    setPhoneNumber,
    submitMutate,
    loading,
    reservePriceChange,
    newPrice,
    resolveConfirmation,
    onCreateInvoice,
    onConfirmPayment,
  } = useHandlePayment(gateway);
  const domesticFlightTracking = new DomesticFlightTrackingEvent();
  const { domesticFlightData } = useSelector(
    (state: RootState) => state?.ecommerceReducer?.ecomerceSlice,
  );
  const dispatch = useDispatch();

  const { selectedTicketDeparture, selectedTicketReturning } = useSelectedTicket();
  useEffect(() => {
    if (order) {
      if (domesticFlightData !== undefined) {
        const viewCartData = [selectedTicketDeparture];
        if (selectedTicketReturning !== undefined) viewCartData.push(selectedTicketReturning);
        const flightData = {
          ...domesticFlightData,
          itinerary: viewCartData,
          passengerLength: order?.passengers?.length ?? 1,
        };
        domesticFlightTracking.viewCart(flightData as propsModel);
        dispatch(
          domesticFlight({
            flights: flightData as propsModel,
          }),
        );
      }
    }
  }, [order]);

  return (
    <>
      <div className={styles.checkout__wrapper}>
        {isMobile && (
          <div
            className={
              !order?.passengers?.[0].tickets?.[1] ? styles.checkout : styles['checkout--roundTrip']
            }
          >
            <div className="p-3 text-end d-flex flex-row-reverse">
              <BackArrowIcon className="fill-white" onClick={() => back()} />
              <span className="color-white text-3 mx-auto">بررسی نهایی و پرداخت</span>
            </div>
            {!order?.passengers?.[0]?.tickets?.[1] ? (
              <DetailItem type="oneWay" data={order?.passengers?.[0]?.tickets?.[0]} />
            ) : (
              <>
                <DetailItem type="toward" data={order?.passengers?.[0].tickets?.[0]} />
                <div className={styles.checkout__divider} />
                <DetailItem type="backward" data={order?.passengers?.[0].tickets?.[1]} />
              </>
            )}
          </div>
        )}
        {order && (
          <>
            <Invoice
              serviceId={502}
              setGateway={setGateway}
              order={order}
              reFetchOrder={refetch}
              setPhoneNumber={setPhoneNumber}
              setEmail={setEmail}
              isLoading={loading}
              setContactChange={setContactChange}
              handlePaymentButton={() => {
                if (isMobile) {
                  setPaymentBottomSheet(true);
                } else {
                  submitMutate();
                }
              }}
            />
            <PaymentBottomSheet
              open={paymentBottomSheet}
              onDismiss={() => setPaymentBottomSheet(false)}
              paymentHookOptions={{
                onCreate: onCreateInvoice,
                onConfirm: onConfirmPayment,
              }}
            />
          </>
        )}
      </div>
      {reservePriceChange && (
        <PriceChangeModal newPrice={newPrice} resolveConfirmation={resolveConfirmation} />
      )}
    </>
  );
};

export default Checkout;
