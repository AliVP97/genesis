import { useEffect } from 'react';
import styles from '../../styles/invoice.module.scss';
import cn from 'classnames';
import { InfoIcon, UserIcon } from 'assets/icons';
import InvoicePassengers from '../passengers';
import InvoiceFactor from '../factor';
import InvoiceZeroRefund from '../zeroRefund';
import InvoiceShare from '../share';
import { Dispatch, FC } from 'react';
import router from 'next/router';
import Button from 'components/button';
import useDeviceDetect from 'utils/hooks/useDeviceDetect';
import Spinner from 'components/spinner';
import PaymentMethods from 'components/payment/desktopCard';
import GetOrderResponseV2 from '../../types/GetOrderResponseV2';
import API from 'utils/routes/api';
import { useDiscount } from 'components/discount/hooks/useDiscount';
import Discount from 'components/discount';
import { useAppDispatch, useAppSelector } from 'store/hook/storeHook';
import { onClickPaymentButton } from 'store/slices/internationalFlight/invoice';
import {
  selectHasActionOnPrice,
  selectIsPaymentButtonClick,
} from 'store/slices/internationalFlight/selectors/invoice';

import { onActionOnPrice } from 'store/slices/internationalFlight/invoice';
interface Props {
  order: GetOrderResponseV2;
  handlePaymentButton: () => void;
  setEmail: Dispatch<string>;
  setPhoneNumber: Dispatch<string>;
  isLoading: boolean;
  serviceId?: number;
  refetchOrder: () => void;
  setGatewayId?: Dispatch<React.SetStateAction<number | undefined>>;
}

const Invoice: FC<Props> = ({
  order,
  handlePaymentButton,
  setPhoneNumber,
  setEmail,
  isLoading,
  serviceId,
  setGatewayId,
  refetchOrder,
}) => {
  const { isMobile } = useDeviceDetect();
  const internationalLastSearch = JSON.parse(
    localStorage?.getItem('international_flight_last_search') as string,
  )?.[0];

  const orderData = order?.order;
  const discountOrder = {
    orderId: orderData?.orderId,
    discount: {
      ...orderData?.discount,
      discount: orderData?.discount,
      amount: orderData?.discount?.amount,
    },
    url: API.INTERNATIONALFLIGHT.ORDER_DISCOUNT(orderData?.orderId),
  };
  const dispatch = useAppDispatch();
  const changePriceActionsToDisabled = (isDisabled: boolean) => {
    dispatch(onActionOnPrice(isDisabled));
  };
  const discountHandler = useDiscount(discountOrder, refetchOrder, changePriceActionsToDisabled);

  const zeroRefund = order?.order?.services?.[0]?.serviceDetail?.[0];
  const hasActionOnPrice = useAppSelector(selectHasActionOnPrice);
  const isPaymentButtonClick = useAppSelector(selectIsPaymentButtonClick);

  useEffect(() => {
    dispatch(onClickPaymentButton(false));
  }, []);

  return (
    <div
      dir="rtl"
      className={cn(
        String(order?.order?.itinerary?.tripMode) === 'TRIP_MODE_ONEWAY'
          ? styles.invoice
          : styles['invoice--roundTrip'],
        isMobile && 'bg-color-white-2',
      )}
    >
      {isMobile && (
        <>
          <span className="text-2 p-4 d-flex">
            لطفا اطلاعات زیر را با دقت بررسی و در صورت تایید اقدام به پرداخت هزینه کنید.
          </span>
        </>
      )}
      <div className={styles.invoice__table}>
        <div className={styles.invoice__table__header}>
          <UserIcon />
          <span className="pe-2">مسافران</span>
          {!isMobile ? (
            <div className="color-primary me-3">
              {internationalLastSearch.passenger.adult}بزرگسال
              {internationalLastSearch.passenger.child != 0 && (
                <>- {internationalLastSearch.passenger.child}کودک</>
              )}
              {internationalLastSearch.passenger.infant != 0 && (
                <>- {internationalLastSearch.passenger.infant}نوزاد</>
              )}
            </div>
          ) : (
            <></>
          )}
        </div>
        {order && <InvoicePassengers passengers={order.order!.passengers!} />}
      </div>

      {order && (
        <>
          {order?.order?.services?.length ? (
            <InvoiceZeroRefund
              order={order}
              discountHandler={discountHandler}
              refetchOrder={refetchOrder}
            />
          ) : null}
        </>
      )}

      {!isMobile && (
        <Discount
          hasActionOnPrice={hasActionOnPrice || isPaymentButtonClick}
          discountOrder={discountOrder}
          {...discountHandler}
          formAlert={
            zeroRefund?.selected && (
              <div
                style={{ maxWidth: '430px' }}
                className="alert alert-info rounded-4 border-0 fs-3 mt-3"
                role="alert"
              >
                با انتخاب استرداد بدون جریمه، استفاده از کد تخفیف امکان‌پذیر نیست.
              </div>
            )
          }
        />
      )}

      {order && <InvoiceFactor order={order} discountHandler={discountHandler} />}

      {!isMobile ? <PaymentMethods setGatewayId={setGatewayId} serviceId={serviceId} /> : null}

      <InvoiceShare
        getPhoneNumber={(mobileNumber) => setPhoneNumber(mobileNumber)}
        getEmail={(email) => setEmail(email)}
      />
      {isMobile ? (
        <>
          <div className={styles.invoice__footer}>
            <div>
              <InfoIcon className="fill-grey-2" />
            </div>
            <span className="text-2 me-1">
              ادامه فرایند خرید، به منزله تایید{' '}
              <a
                className="text-decoration-none"
                href={`${process.env.NEXT_PUBLIC_DOMAIN}page/tourism-terms`}
              >
                قوانین و مقررات
              </a>{' '}
              سازمان هواپیمایی و هف‌هشتاد، توسط شما می‌باشد.
            </span>
          </div>

          <div className="p-3">
            <button
              type="submit"
              form="shareForm"
              onClick={() => {
                handlePaymentButton();
              }}
              className={cn(
                styles.invoice__footer__btn,
                isLoading ? 'bg-color-grey-3' : 'bg-color-primary',
                'justify-content-center d-flex align-items-center text-weight-500',
              )}
            >
              {isLoading ? <Spinner /> : 'تایید و ادامه'}
            </button>
          </div>
        </>
      ) : (
        <div className={cn(styles.invoice__table, 'mx-auto d-flex row mb-5 p-3')}>
          <div className="d-flex justify-content-start pb-3 col-lg-6 col-md-12">
            <div>
              <InfoIcon className="fill-grey-2" />
            </div>
            <span className="text-3 me-1">
              خرید بلیط در این سامانه، به منزله مطالعه، آگاهی و قبول‌ داشتن تمام{' '}
              <a
                className="text-decoration-none"
                href={`${process.env.NEXT_PUBLIC_DOMAIN}page/tourism-terms`}
              >
                قوانین و مقررات
              </a>{' '}
              سازمان هواپیمایی و هف‌هشتاد، توسط شما می‌باشد.
            </span>
          </div>
          <div className="d-flex justify-content-end col-lg-6 col-md-12">
            <Button
              btnType="submit"
              onClick={() => router.back()}
              className={cn(styles['invoice__table__footer-btn'], 'btn bg-white color-grey-1 mx-3')}
              radius
            >
              بازگشت
            </Button>

            <Button
              disabled={hasActionOnPrice}
              btnType="submit"
              form="shareForm"
              onClick={handlePaymentButton}
              className={cn(styles['invoice__table__footer-btn'], 'btn btn-primary border-0')}
              radius
              loading={isLoading}
            >
              <div className="d-flex flex-row w-100 text-center" style={{ width: '150px' }}>
                پرداخت {Number(order?.order?.priceInfo?.price).toLocaleString()} ریال
              </div>
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Invoice;
