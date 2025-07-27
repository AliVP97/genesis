import React, { useEffect, useState } from 'react';
import styles from './styles/checkout.module.scss';
import { BackArrowIcon, Star } from 'assets/icons';
import { useRouter } from 'next/router';
import Invoice from 'module/hotel/checkout/components/invoice';
import useDeviceDetect from 'utils/hooks/useDeviceDetect';
import { DATE_UTILS } from 'utils/helpers/dateUtils';
import { useHandlePayment } from './hooks/useHandlePayment';
import PriceChangeModal from './components/priceChangeModal';
import ReservedModal from './components/reservedModal';
import HeaderInfo from './components/headerInfo';
import cn from 'classnames';
import { Payment } from 'components/payment';
import useGetOrder from './hooks/useGetOrder';
import PaymentInfo from './components/paymentInfo';
import { useSelector } from 'react-redux';
import { RootState } from 'store';
import { HotelTrackingEvent } from 'utils/ecommerce/application/mappers/hotel/event';
import { hotelViewListItemModel } from 'utils/ecommerce/application/mappers/hotel/types';
import { TGateway } from 'components/DynamicGateways';

const Checkout = () => {
  const { back } = useRouter();
  const { isMobile } = useDeviceDetect();
  const [paymentBottomSheet, setPaymentBottomSheet] = useState(false);
  const { order, refetch } = useGetOrder();
  const [gateway, setGateway] = useState<TGateway | undefined>();
  const {
    submitMutate,
    setEmail,
    isLoading,
    setPhoneNumber,
    setConfirmed,
    reservePriceChange,
    newPrice,
    isReserved,
  } = useHandlePayment(gateway);
  const [passengersLength, setPassengersLength] = useState<number>();
  useEffect(() => {
    const hotelPassengers = JSON.parse(String(localStorage.getItem('hotel_last_search')))[0]
      .passenger;
    let length = 0;
    for (let idx = 0; idx < hotelPassengers.length; idx++) {
      length += hotelPassengers[idx].adult + hotelPassengers[idx]['child'].length;
    }
    setPassengersLength(length);
  }, []);
  const { hotelData } = useSelector((state: RootState) => state?.ecommerceReducer?.ecomerceSlice);
  useEffect(() => {
    if (hotelData) {
      if (hotelData instanceof Object && 'data' in hotelData) {
        const hotelEvent = new HotelTrackingEvent();
        hotelEvent.viewCart(hotelData as hotelViewListItemModel);
      }
    }
  }, []);
  return (
    <>
      <div className={cn(isMobile && styles['checkout'])}>
        {isMobile ? (
          <div className={styles['checkout']}>
            <div className="d-flex align-items-center p-3">
              <div className="col-11 color-white text-3 text-center ps-4">بررسی نهایی و پرداخت</div>
              <div className="col-1">
                <BackArrowIcon className="fill-white" onClick={() => back()} />
              </div>
            </div>
            <div className="d-flex flex-column align-items-center ">
              <div className="text-5 color-white">{order?.hotelInfo?.name}</div>
              <div>
                {[...Array(order?.hotelInfo?.star)].map((_, index) => (
                  <Star key={index.toString() + 'hotelCheckout'} />
                ))}
              </div>
              <div className="text-3 color-white">{order?.hotelInfo?.city?.name}</div>
            </div>
            <div className="d-flex px-2 pb-2">
              <div className="col-6 text-4 text-weight-500  color-white">
                <span className="  color-white ">خروج </span>
                <div>
                  {DATE_UTILS.formatDate(order?.checkDate?.checkOut as unknown as number, {
                    lang: 'fa',
                    showWeekDay: true,
                  })}
                </div>
              </div>
              <div className="col-6 text-4 text-weight-500 text-end  color-white">
                <span className="  color-white ">ورود </span>
                <div>
                  {DATE_UTILS.formatDate(order?.checkDate?.checkIn as unknown as number, {
                    lang: 'fa',
                    showWeekDay: true,
                  })}
                </div>
              </div>
            </div>{' '}
            <div className="rtl text-3 d-flex justify-content-center color-white">
              {passengersLength ? `${passengersLength}  مسافر` : null}
            </div>
          </div>
        ) : (
          order && <HeaderInfo passengersLength={passengersLength} order={order} />
        )}
        {order && (
          <>
            <Invoice
              orderData={order}
              refetchOrder={refetch}
              serviceId={172}
              setGateway={setGateway}
              setPhoneNumber={setPhoneNumber}
              setEmail={setEmail}
              isLoading={isLoading}
              handlePaymentButton={() => {
                {
                  isMobile ? setPaymentBottomSheet(true) : submitMutate();
                }
              }}
            />
            <Payment
              reservePriceChange={reservePriceChange || isReserved}
              open={paymentBottomSheet}
              onDismiss={() => setPaymentBottomSheet(false)}
              title="خرید هتل"
              module="hotel"
              serviceId={172}
              submitCallback={submitMutate}
              price={order?.payment?.totalPrice}
              setGateway={setGateway}
              isLoading={isLoading}
            >
              <PaymentInfo reason={'هتل'} paymentOrder={order?.payment} />
            </Payment>
          </>
        )}
      </div>
      {reservePriceChange ? (
        <PriceChangeModal newPrice={newPrice} setConfirmed={setConfirmed} />
      ) : (
        <></>
      )}
      {isReserved ? <ReservedModal /> : <></>}
    </>
  );
};

export default Checkout;
