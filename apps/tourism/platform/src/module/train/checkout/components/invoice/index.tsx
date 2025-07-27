import { Dispatch, FC } from 'react';

import router from 'next/router';
import * as Sentry from '@sentry/nextjs';
import { AxiosError } from 'axios';
import cn from 'classnames';

import Button from 'components/button';
import { TrainOrder } from 'services/train/orders/interface';
import { definitions } from 'types/rajatrain';
import { useResponsive } from 'utils/hooks/useResponsive';
import { notify } from 'utils/notification';
import { TGateway } from 'components/DynamicGateways';
import PaymentMethods from 'components/payment/desktopCard/v2';
import { InfoIcon, UserIcon } from 'assets/icons';
import Discount from '../../components/discount';
import Factor from '../../components/factor';
import Passengers from '../../components/passengers';
import Share from '../../components/share';
import { PersianCompartmentGenderType } from '../../types/interface';
import CheckoutDesktopTickets from '../desktopTickets';
import InformPanel from '../informPanel';
import { PassengerTypes } from './PassengerTypes';
import { Captcha } from '../captcha';

import styles from '../../styles/invoice.module.scss';

interface Props {
  order: TrainOrder;
  handlePaymentButton: () => void;
  isLoading: boolean;
  serviceId?: number;
  setGateway?: Dispatch<React.SetStateAction<TGateway | undefined>>;
  allowSubmit?: boolean;
}

const Invoice: FC<Props> = ({
  order,
  handlePaymentButton,
  isLoading,
  setGateway,
  serviceId,
  allowSubmit,
}) => {
  const { isMobile } = useResponsive();

  const handlePayment = async () => {
    try {
      handlePaymentButton();
    } catch (error) {
      if (error instanceof AxiosError) {
        notify({
          type: 'error',
          message: (error as AxiosError<definitions['rpcStatus']>).response?.data?.message,
        });
      }

      Sentry.captureException(error);
    }
  };

  return (
    <div dir="rtl" className={!order.trips?.[1] ? styles.invoice : styles['invoice--roundTrip']}>
      {isMobile && (
        <>
          <span className="text-2 p-4 d-flex">
            لطفا اطلاعات زیر را با دقت بررسی و در صورت تایید اقدام به پرداخت هزینه کنید.
          </span>
        </>
      )}

      {!isMobile && (
        <div>
          <CheckoutDesktopTickets order={order} />
        </div>
      )}

      <div className={cn(styles.invoice__table, 'mt-3')}>
        <div className={styles.invoice__table__header}>
          <UserIcon />
          <div className="pe-2">
            مسافران
            {isMobile ? (
              <span className="me-1">
                ({PersianCompartmentGenderType[order?.trips![0]?.compartmentType as never]})
              </span>
            ) : (
              <span className={styles['invoice__table__header__passenger-type']}>
                <PassengerTypes data={order?.trips![0]?.tickets} /> -{' '}
                {PersianCompartmentGenderType[order?.trips![0]?.compartmentType as never]}
              </span>
            )}
          </div>
        </div>
        {order && <Passengers order={order} />}
      </div>
      {!isMobile && <Discount />}
      {order && <Factor order={order} />}
      {!isMobile ? <PaymentMethods setGateway={setGateway} serviceId={serviceId} /> : null}
      <Share />
      {order?.isCaptchaRequired && <Captcha />}
      <InformPanel />
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
              راه‌آهن جمهوری اسلامی و سایت هف‌هشتاد توسط شما می باشد .{' '}
            </span>
          </div>

          <div className="p-3">
            <Button
              btnType="submit"
              onClick={handlePaymentButton}
              className="btn btn-primary w-100"
              radius
              loading={isLoading}
              disabled={!allowSubmit}
            >
              {isMobile ? 'ادامه و پرداخت' : 'تایید و پرداخت'}
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
              ادامه فرایند خرید، به منزله تایید
              <a
                className="text-decoration-none"
                href={`${process.env.NEXT_PUBLIC_DOMAIN}page/tourism-terms`}
              >
                قوانین و مقررات
              </a>{' '}
              راه‌آهن جمهوری اسلامی و سایت هف‌هشتاد توسط شما می باشد .{' '}
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
              onClick={handlePayment}
              className={cn(styles['invoice__table__footer-btn'], 'btn btn-primary border-0')}
              radius
              loading={isLoading}
              disabled={!allowSubmit}
            >
              <div className="d-flex flex-row w-100 text-center" style={{ width: '150px' }}>
                پرداخت {(Number(order.price) / 10).toLocaleString()} تومان
              </div>
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Invoice;
