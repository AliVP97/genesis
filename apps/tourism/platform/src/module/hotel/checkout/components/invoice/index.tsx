import styles from '../../styles/invoice.module.scss';
import cn from 'classnames';
import React, { Dispatch, FC, useState } from 'react';
import useDeviceDetect from 'utils/hooks/useDeviceDetect';
import { Room } from '../room';
import { HotelBed, InfoIcon, Left } from 'assets/icons';
import Share from '../share';
import Button from 'components/button';
import Factor from '../factor';
import { RefundPolicies } from '../refundPolicies';
import { BottomSheet } from 'react-spring-bottom-sheet';
import { TermsAndConditions } from '../termsAndConditions';
import router from 'next/router';
import PaymentMethods from 'components/payment/desktopCard/v2';
import Discount from 'components/discount';
import { useDiscount } from 'components/discount/hooks/useDiscount';
import API from 'utils/routes/api';
import { TGetHotelOrder } from 'services/hotel/orders/interface';
import { TGateway } from 'components/DynamicGateways';

interface Props {
  setEmail: (email: string) => void;
  setPhoneNumber: (phoneNumber: string) => void;
  handlePaymentButton: () => void;
  isLoading: boolean;
  serviceId?: number;
  setGateway?: Dispatch<React.SetStateAction<TGateway | undefined>>;
  orderData: TGetHotelOrder;
  refetchOrder: () => void;
}

enum TabType {
  REFUNDPOLICY = 'REFUNDPOLICY',
  TERMS = 'TERMS',
}
const Invoice: FC<Props> = ({
  setPhoneNumber,
  setEmail,
  handlePaymentButton,
  isLoading,
  serviceId,
  setGateway,
  orderData,
  refetchOrder,
}) => {
  const { isMobile } = useDeviceDetect();
  const [showTermsAndConditions, setShowTermsAndConditions] = useState(false);
  const [showRefundPolicies, setShowRefundPolicies] = useState(false);
  const [activeTab, setActiveTab] = useState<TabType>(TabType.REFUNDPOLICY);
  const handleSelectTab = (str: TabType) => setActiveTab(str);

  const options = [
    {
      label: 'قوانین کنسلی',
      value: TabType.REFUNDPOLICY,
    },
    {
      label: 'قوانین و مقررات هتل',
      value: TabType.TERMS,
    },
  ];

  const discountOrder = {
    orderId: orderData?.orderId,
    discount: orderData?.payment?.discount,
    url: API.HOTEL.ORDER_DISCOUNT(orderData?.orderId),
  };

  const discountHandler = useDiscount(discountOrder, refetchOrder);

  return (
    <div dir="rtl" className={cn(styles['invoice--content'], isMobile && 'bg-color-white-1 p-3')}>
      {isMobile && (
        <div className="text-2">
          لطفا اطلاعات زیر را با دقت بررسی و در صورت تایید، اقدام به پرداخت نمایید.
        </div>
      )}
      {!isMobile ? (
        <div className={cn(styles['invoice__table'], 'mx-auto mt-3')}>
          <div
            className={cn(
              styles['invoice__table__header'],
              'd-flex align-items-center color-grey-1 text-weight-500 pe-3',
            )}
          >
            <HotelBed />
            <span className="pe-2 color-black">اتاق ها</span>
          </div>
          <div className="mb-3 px-3 py-3 col-12">
            {orderData?.room?.map((item, index) => (
              <Room
                key={item.roomId + 'invoiceHotel'}
                index={index}
                room={item}
                passengers={orderData.passengers!}
              />
            ))}
          </div>
        </div>
      ) : (
        orderData?.room?.map((item, index) =>
          orderData.passengers ? (
            <Room
              key={item.roomId + 'invoiceHotel' + item?.roomInfo}
              index={index}
              room={item}
              passengers={orderData.passengers}
            />
          ) : null,
        )
      )}

      {!isMobile && (
        <div className={cn(styles['invoice__table'], 'mx-auto mt-3')}>
          <div
            className={cn(
              styles['invoice__table__header'],
              'd-flex align-items-center color-grey-1 text-weight-500 pe-3',
            )}
          >
            {options.map((item) => (
              <div
                className={cn(
                  'd-flex ',
                  item.value === activeTab
                    ? styles['invoice__item--options--active']
                    : styles['invoice__item--options'],
                )}
                onClick={() => handleSelectTab(item.value)}
                key={item.value + 'hotelInvoiceComponent'}
              >
                <span className={cn(item.value === activeTab && 'mb-2', 'mt-2')}>{item.label}</span>
              </div>
            ))}
          </div>
          <div className="mb-3 p2 col-12">
            {activeTab === TabType.REFUNDPOLICY ? (
              <RefundPolicies content={orderData!.hotelInfo!.about!.cancellationRules!} />
            ) : (
              <TermsAndConditions
                content={orderData!.hotelInfo!.about!.generalRules!}
                checkTime={orderData!.hotelInfo!.checkTime!}
              />
            )}
          </div>
        </div>
      )}

      {isMobile && (
        <>
          <Factor paymentOrder={orderData?.payment} {...discountHandler} />

          <div className={styles['invoice__policies']} onClick={() => setShowRefundPolicies(true)}>
            <div className="col-11 pe-3">قوانین کنسلی</div>
            <div className="col-1">
              <Left />
            </div>
          </div>
          <div
            className={styles['invoice__policies']}
            onClick={() => setShowTermsAndConditions(true)}
          >
            <div className="col-11 pe-3">قوانین و مقررات</div>
            <div className="col-1">
              <Left />
            </div>
          </div>
        </>
      )}

      <Share
        getPhoneNumber={(mobileNumber) => setPhoneNumber(mobileNumber)}
        getEmail={(email) => setEmail(email)}
      />
      {!isMobile && (
        <>
          <Discount discountOrder={discountOrder} {...discountHandler} />
          <Factor paymentOrder={orderData?.payment} {...discountHandler} />
          <PaymentMethods setGateway={setGateway} serviceId={serviceId} />
        </>
      )}
      {isMobile ? (
        <>
          <div className={cn(styles['invoice__footer'], 'd-flex mt-2')}>
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
              وبسایت هف‌هشتاد، توسط شما می‌باشد.
            </span>
          </div>

          <div className="p-3">
            <Button
              btnType="submit"
              onClick={handlePaymentButton}
              className="btn btn-primary w-100"
              radius
              loading={isLoading}
            >
              ادامه و پرداخت
            </Button>
          </div>
        </>
      ) : (
        <div className={cn(styles['invoice__table'], 'mx-auto d-flex row mb-5 p-3')}>
          <div className="d-flex justify-content-start pb-3 col-lg-6 col-md-12 align-items-center">
            <div>
              <InfoIcon className="fill-grey-2" />
            </div>
            <span className="text-3 me-1">
              ادامه فرایند خرید، به منزله تایید{' '}
              <a
                className="text-decoration-none"
                href={`${process.env.NEXT_PUBLIC_DOMAIN}page/tourism-terms`}
              >
                قوانین و مقررات
              </a>{' '}
              وبسایت هف‌هشتاد، توسط شما می‌باشد.
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
              btnType="submit"
              onClick={handlePaymentButton}
              className={cn(styles['invoice__table__footer-btn'], 'btn btn-primary border-0')}
              radius
              loading={isLoading}
            >
              <div
                className="d-flex flex-row w-100 text-center justify-content-center"
                style={{ width: '150px' }}
              >
                پرداخت {Number(orderData?.payment?.totalPrice).toLocaleString()} ریال
              </div>
            </Button>
          </div>
        </div>
      )}

      <BottomSheet
        open={showTermsAndConditions}
        onDismiss={() => setShowTermsAndConditions(false)}
        skipInitialTransition
        snapPoints={({ maxHeight }) => maxHeight * 0.5}
        className={styles['tickets__bottomSheet']}
        header={<div>قوانین و مقررات</div>}
      >
        <TermsAndConditions
          content={orderData!.hotelInfo!.about!.generalRules!}
          checkTime={orderData!.hotelInfo!.checkTime!}
        />
      </BottomSheet>

      <BottomSheet
        open={showRefundPolicies}
        onDismiss={() => setShowRefundPolicies(false)}
        skipInitialTransition
        snapPoints={({ maxHeight }) => maxHeight * 0.5}
        className={styles['tickets__bottomSheet']}
        header={<div>قوانین کنسلی</div>}
      >
        <RefundPolicies content={orderData!.hotelInfo!.about!.cancellationRules!} />
      </BottomSheet>
    </div>
  );
};

export default Invoice;
