import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useDispatch, useSelector } from 'react-redux';
import { useQueryClient } from 'react-query';
import { RootState } from 'store';

import { QUERIES } from '../hooks';
import { BusTrackingEvent } from 'utils/ecommerce/application/mappers/bus/event';
import { busViewListItemModel } from 'utils/ecommerce/application/mappers/bus/types';
import PaymentMethods from 'components/payment/desktopCard';
import { PaymentBottomSheet } from 'components/PaymentBottomSheet';
import { TUsePaymentOptions } from 'components/PaymentBottomSheet/PaymentBottomSheet.types';
import Factor from './components/factor';
import { InformPanel } from './components/InformPanel';
import Passengers from './components/passengers';
import Seats from './components/Seats';
import Share from './components/share';
import Submit from './components/submit';
import { TripItem } from './components/trip';
import SelectedTicket from '../tickets/components/selectedTicket';
import { useHandlePayment } from './hooks/useHandlePayment';
import { updateOrderBusContactInfo } from 'services/bus/contact';
import { reserveTicket } from 'services/bus/reserve';
import API from 'utils/routes/api';

import { BackArrowIcon } from 'assets/icons';
import styles from './styles/checkout.module.scss';
import Discount from 'components/discount';
import { useDiscount } from 'components/discount/hooks/useDiscount';
import { busDataObject } from 'store/slices/ecommerce/ecomerceSlice';

const Checkout = () => {
  const [gatewayId, setGatewayId] = useState<undefined | number>();

  const { back } = useRouter();
  const queryClient = useQueryClient();

  const {
    isLoading,
    onSubmit,
    onDismiss,
    paymentBottomSheet,
    isMobile,
    contactState,
    isValidContactInfoState,
    orderData,
    refetch,
  } = useHandlePayment(gatewayId);
  const dispatch = useDispatch();

  const [contactInfo] = contactState;
  const [isValidContactInfo, setIsValidContactInfo] = isValidContactInfoState;

  const onCreate: TUsePaymentOptions['onCreate'] = async (orderId?: string) => {
    if (!orderId) return;

    if (contactInfo.hasChanged) {
      await updateOrderBusContactInfo({
        phoneNumber: contactInfo.phoneNumber,
        email: contactInfo.email,
        orderId: orderId,
      });
    }

    const { paymentJwt } = await reserveTicket(orderId);

    return paymentJwt;
  };

  const { busData } = useSelector((state: RootState) => state?.ecommerceReducer?.ecomerceSlice);

  useEffect(() => {
    if (busData) {
      const busEvent = new BusTrackingEvent();
      busEvent.viewCart(busData as busViewListItemModel);
    }

    const onBeforeUnload = async () => {
      orderData?.orderId &&
        (await queryClient.invalidateQueries(QUERIES.getOrder(orderData.orderId)));
    };

    window.addEventListener('beforeunload', onBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', onBeforeUnload);
    };
  }, []);

  const discountOrder = {
    orderId: orderData?.orderId,
    discount: orderData?.discount,
    url: API.BUS.ORDER_DISCOUNT(orderData?.orderId),
  };

  const discountHandler = useDiscount(discountOrder, refetch);

  useEffect(() => {
    if (busData && orderData) {
      const busObject: busViewListItemModel = {
        ...(busData as busViewListItemModel),
        passengerLength: orderData?.passengers?.nationalCode?.length,
      };
      dispatch(busDataObject({ data: busObject }));
    }
  }, [orderData]);

  return (
    <>
      <div className="d-md-none">
        <div className={styles['checkout']}>
          <div className="p-3 text-end d-flex flex-row-reverse">
            <BackArrowIcon className="fill-white" onClick={() => back()} />
            <span className="color-white text-3 mx-auto text-weight-500">بررسی نهایی و پرداخت</span>
          </div>
          <TripItem type="oneWay" data={orderData} />
        </div>
      </div>
      <div>
        <div className="d-md-none text-end rtl">
          <p className="p-3 pb-0">
            لطفا اطلاعات زیر را با دقت بررسی و در صورت تایید، اقدام به پرداخت هزینه نمایید.
          </p>
        </div>
        <div className="d-none d-md-block">
          <SelectedTicket />
        </div>
        <div className="mt-3">
          {!!orderData?.passengers && (
            <Passengers
              passengers={orderData?.passengers}
              isInternational={orderData?.busInfo?.isInternational}
            />
          )}
        </div>
        <div className="mt-3">{orderData?.seats && <Seats seats={orderData.seats} />}</div>
        <div className="mt-3 d-none d-md-block">
          <Discount discountOrder={discountOrder} {...discountHandler} />
        </div>
        <div className="mt-3">
          {!!orderData && <Factor order={orderData} {...discountHandler} />}
        </div>
        {!isMobile ? (
          <div dir="rtl" className="mt-3">
            <PaymentMethods setGatewayId={setGatewayId} serviceId={149} />
          </div>
        ) : null}

        <div className="mt-3 rtl">
          {!!orderData && !!orderData.passengers?.providerContactPhone && (
            <Share contactState={contactState} setIsValidContactInfo={setIsValidContactInfo} />
          )}
        </div>
        {orderData?.infoMessage && (
          <div className="mt-3">
            <InformPanel>{orderData.infoMessage}</InformPanel>
          </div>
        )}
        <div className="mt-3">
          {!!orderData && (
            <>
              {isMobile && (
                <PaymentBottomSheet
                  open={paymentBottomSheet}
                  onDismiss={onDismiss}
                  paymentHookOptions={{ onCreate }}
                />
              )}
              <Submit
                isLoading={isLoading}
                handlePaymentButton={onSubmit}
                allowSubmit={isValidContactInfo}
                order={orderData}
              />
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default Checkout;
