import React, { useEffect, useState } from 'react';
import styles from './issuance.module.scss';
import { useQuery } from 'react-query';
import { useRouter } from 'next/router';
import cn from 'classnames';
import HeaderHoc from 'components/headerHoc';
import Button from 'components/button';
import useDeviceDetect from 'utils/hooks/useDeviceDetect';
import { useIsSuperApp } from 'utils/hooks/useIsSuperApp';
import UseHotelVoucherDownload from './hooks/useHotelVoucherDownload';
import { getOrder } from 'services/hotel/orders';
import Image from 'next/image';
import { customLoader } from 'utils/helpers/imageLoader';
import { useGetImages } from 'module/general/config/hooks/useGetImages';

const HotelIssuance = () => {
  const { query, push } = useRouter();
  const router = useRouter();
  const { isMobile } = useDeviceDetect();
  const { ticketOk, ticketPending, ticketFailed } = useGetImages();
  const [intervalValue, setInterValValue] = useState(3000);

  const { downloadHotelVoucherLoading, getHotelVoucher } = UseHotelVoucherDownload();

  const { data: hotelData } = useQuery(['order', query.id as string], getOrder, {
    enabled: !!query?.id,
    refetchInterval: intervalValue,
  });

  const checkStatus = () => {
    if (!hotelData || hotelData?.status === 'ORDER_STATUS_BOOK_PENDING') {
      return 'pending';
    }
    if (
      hotelData?.status === 'ORDER_STATUS_PAYMENT_SUCCESSFUL' ||
      hotelData.status === 'ORDER_STATUS_BOOK_SUCCESSFUL' ||
      hotelData.status === 'ORDER_STATUS_ORDER_RESERVED'
    )
      return 'success';

    if (hotelData?.status === 'ORDER_STATUS_RESERVATION_EXPIRED') return 'expired';

    return 'failed';
  };
  useEffect(() => {
    if (hotelData) {
      if (hotelData?.status === 'ORDER_STATUS_ORDER_RESERVED' || 'ORDER_STATUS_BUY_CONFIRMED') {
        router.replace({
          pathname: router.pathname,
          query: { ...router.query, hotelPaymentStatus: 'success' },
        });
      }
    }
  }, [hotelData]);
  const isSupperapp = useIsSuperApp();

  useEffect(() => {
    if (hotelData?.status) {
      if (
        checkStatus() === 'failed' ||
        checkStatus() === 'expired' ||
        checkStatus() === 'success'
      ) {
        setInterValValue(0);
        return;
      }
      setInterValValue(3000);
    }
  }, [hotelData?.status]);

  const ticketDownload = () => {
    if (hotelData?.orderId) getHotelVoucher(hotelData?.orderId);
  };

  return (
    <div className={cn(styles['issuing'], !isMobile && styles['issuing__desktop'], 'mt-5')}>
      <HeaderHoc>صدور واچر</HeaderHoc>
      {checkStatus() === 'success' ? (
        <Image
          loader={customLoader}
          src={ticketOk}
          alt="success"
          width="344"
          height="172"
          unoptimized
        />
      ) : checkStatus() === 'pending' ? (
        <Image
          loader={customLoader}
          src={ticketPending}
          alt="pending"
          width="344"
          height="172"
          unoptimized
        />
      ) : (
        <Image
          loader={customLoader}
          src={ticketFailed}
          alt="failed"
          width="344"
          height="172"
          unoptimized
        />
      )}
      <span
        className={
          checkStatus() === 'success'
            ? styles['issuing__description--done']
            : checkStatus() === 'pending' || checkStatus() === 'expired'
              ? styles['issuing__description']
              : styles['issuing__description--failed']
        }
      >
        {hotelData?.statusTitle}
      </span>
      {checkStatus() === 'success' ? (
        <div
          className={cn(
            styles['issuing__footer'],
            isSupperapp && styles['issuing__footer__isSupperapp'],
            isMobile ? 'position-absolute bottom-0 mb-3' : 'mt-2',
          )}
        >
          <Button
            loading={downloadHotelVoucherLoading}
            onClick={ticketDownload}
            className={styles['issuing__footer__btn']}
          >
            مشاهده و دانلود واچر{' '}
          </Button>{' '}
          {isMobile && (
            <button
              onClick={() => void push('/hotel')}
              className={cn(styles['issuing__footer__btn__return'], 'm-0 ')}
            >
              بازگشت به صفحه اصلی{' '}
            </button>
          )}
        </div>
      ) : (
        (checkStatus() === 'failed' || checkStatus() === 'expired') && (
          <div className={styles['issuing__footer']}>
            <button
              className={cn(styles['issuing__footer__btn__return'], 'm-0 mt-3')}
              onClick={() => void push('/hotel')}
            >
              بازگشت به صفحه اصلی
            </button>
          </div>
        )
      )}
    </div>
  );
};

export default HotelIssuance;
