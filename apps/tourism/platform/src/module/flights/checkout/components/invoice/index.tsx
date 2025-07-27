import styles from '../../styles/invoice.module.scss';
import cn from 'classnames';
import { InfoIcon, UserIcon } from 'assets/icons';
import InvoicePassengers from '../passengers';
import InvoiceFactor from '../factor';
import InvoiceShare from '../share';
import React, { Dispatch, FC, useState } from 'react';
import router, { useRouter } from 'next/router';
import Button from 'components/button';
import useDeviceDetect from 'utils/hooks/useDeviceDetect';
import { useSelectedTicket } from 'utils/hooks/useSelectedTicket';
import SelectedTicketItem from '../../../tickets/ticket/SelectedTicketItem';
import { GetOrder, PaymentInfoResponse } from 'services/domestic/flight/interface';
import { resetFilters } from 'utils/helpers/resetFilters';
import Discount from 'components/discount';
import API from 'utils/routes/api';
import { useDiscount } from 'components/discount/hooks/useDiscount';
import { TGateway } from 'components/DynamicGateways';
import { useQueryClient } from 'react-query';
import { Order } from 'services/domestic/orders/interface';
import { definitions } from 'types/shoppingorder';
import Refund from '../refund/Refund';

interface Props {
  order: GetOrder;
  payment?: PaymentInfoResponse;
  handlePaymentButton: () => void;
  setContactChange: (contactChange: boolean) => void;
  setEmail: (email: string) => void;
  setPhoneNumber: (phoneNumber: string) => void;
  isLoading: boolean;
  serviceId?: number;
  setGateway?: Dispatch<React.SetStateAction<TGateway | undefined>>;
  reFetchOrder: () => void;
  gatewayId?: number;
}

const Invoice: FC<Props> = ({
  order,
  reFetchOrder,
  handlePaymentButton,
  setContactChange,
  setPhoneNumber,
  setEmail,
  isLoading,
  gatewayId,
}) => {
  const [refundLoading, setRefundLoading] = useState<boolean>();
  const [formErrors, setFormErrors] = useState<boolean>(false);
  const { isMobile } = useDeviceDetect();
  const { push, query } = useRouter();
  const queryClient = useQueryClient();
  const checkoutData = queryClient.getQueryData<Order>(['order', query.id]);
  const checkoutDepartureTicketsData = checkoutData &&
    checkoutData.legs?.[0] && {
      ...checkoutData.legs[0]?.FlightInfo,
      refundPolicy: [...(checkoutData.legs[0]?.FlightInfo?.refundPolicies ?? [])],
      price: Number(checkoutData.legs[0]?.FlightInfo?.price ?? 0).toLocaleString(),
    };

  const checkoutReturningTicketsData = checkoutData &&
    checkoutData.legs?.[1] && {
      ...checkoutData.legs[1]?.FlightInfo,
      refundPolicy: [...(checkoutData.legs[1]?.FlightInfo?.refundPolicies ?? [])],
      price: Number(checkoutData.legs[1]?.FlightInfo?.price ?? 0).toLocaleString(),
    };

  const { setSelectedTicketDeparture } = useSelectedTicket();

  const handleChangeTowardTicket = (changeTicket: string) => {
    const searchQuery = localStorage.getItem('search-query');
    if (searchQuery) {
      if (changeTicket === 'departureChange') {
        setSelectedTicketDeparture({ selectedTicketDeparture: null });
      }
      resetFilters(JSON.parse(searchQuery), push);
    } else {
      push('/').catch(() => {
        throw new Error('try it again');
      });
    }
  };

  const discountOrder = {
    orderId: order?.orderId,
    discount: {
      amount: order?.payment?.discount,
      code: order?.payment?.discountCode,
    },
    url: API.FLIGHTS.ORDER_DISCOUNT(order?.orderId || ''),
  };

  const discountHandler = useDiscount(discountOrder, reFetchOrder);

  return (
    <div
      dir="rtl"
      className={cn(
        !order.passengers?.[0]?.tickets?.[1] ? styles.invoice : styles['invoice--roundTrip'],
        isMobile && 'bg-color-white-2',
      )}
    >
      {!isMobile && checkoutDepartureTicketsData && (
        <div className="ltr">
          <SelectedTicketItem
            order={order}
            ticket={checkoutDepartureTicketsData as definitions['apishoppingorderFlightInfo']}
            onChangeTowardTicket={() => handleChangeTowardTicket('departureChange')}
          />
        </div>
      )}
      {!isMobile && checkoutReturningTicketsData && (
        <div className="ltr">
          <SelectedTicketItem
            order={order}
            ticket={checkoutReturningTicketsData as definitions['apishoppingorderFlightInfo']}
            onChangeTowardTicket={() => handleChangeTowardTicket('returningChange')}
            isReturn={true}
          />
        </div>
      )}
      {isMobile && (
        <>
          <span className="text-2 p-4 d-flex">
            لطفا اطلاعات زیر را با دقت بررسی و در صورت تایید اقدام به پرداخت هزینه کنید.
          </span>
        </>
      )}
      <div
        className={styles.invoice__table}
        style={{ marginTop: checkoutDepartureTicketsData ? '3%' : '35%' }}
      >
        <div className={styles.invoice__table__header}>
          <UserIcon />
          <span className="pe-2">مسافران</span>
        </div>
        {order && <InvoicePassengers order={order} />}
      </div>
      <Refund isDisabled={isLoading} gatewayId={gatewayId} setRefundLoading={setRefundLoading} />
      {!isMobile && (
        <Discount
          discountOrder={discountOrder}
          {...discountHandler}
          isDisabledBtn={discountHandler.isDisabledBtn || isLoading}
        />
      )}
      {order && (
        <InvoiceFactor
          order={order}
          {...discountHandler}
          isDisabledBtn={discountHandler.isDisabledBtn || isLoading}
        />
      )}

      <InvoiceShare
        getPhoneNumber={(mobileNumber) => setPhoneNumber(mobileNumber)}
        getEmail={(email) => setEmail(email)}
        isChanged={(contactChange) => setContactChange(contactChange)}
        setFormErrors={setFormErrors}
        isDisabled={isLoading}
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
                قوانین و مقررات{' '}
              </a>
              سازمان هواپیمایی و هف‌هشتاد، توسط شما می‌باشد.
            </span>
          </div>

          <div className="p-3">
            <Button
              btnType="submit"
              form="shareForm"
              onClick={handlePaymentButton}
              className="btn btn-primary w-100"
              radius
              loading={isLoading || refundLoading || discountHandler.isLoading}
              disabled={formErrors}
            >
              تایید و پرداخت
            </Button>
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
              btnType="submit"
              form="shareForm"
              onClick={handlePaymentButton}
              className={cn(styles['invoice__table__footer-btn'], 'btn btn-primary border-0')}
              radius
              loading={isLoading || refundLoading || discountHandler.isLoading}
              disabled={formErrors}
            >
              <div className="d-block w-100 text-center" style={{ width: '150px' }}>
                تایید و پرداخت
              </div>
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Invoice;
