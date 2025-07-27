import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Image from 'next/image';
import cn from 'classnames';

import Button from 'components/button';
import HeaderHoc from 'components/headerHoc';
import { useGetImages } from 'module/general/config/hooks/useGetImages';
import { customLoader } from 'utils/helpers/imageLoader';
import useDeviceDetect from 'utils/hooks/useDeviceDetect';
import { useIsSuperApp } from 'utils/hooks/useIsSuperApp';
import { useOrder } from '../hooks';
import UseBusTicketDownload from './hooks/useBusTicketDownload';

import styles from './issuance.module.scss';

const BusIssuance = () => {
  const { query, push } = useRouter();
  const { isMobile } = useDeviceDetect();

  const [intervalValue, setInterValValue] = useState(3000);

  const { downloadBusTicketLoading, getBusTicket } = UseBusTicketDownload();
  const { data: busData } = useOrder(query?.id as string, {
    refetchInterval: intervalValue,
  });

  const { ticketOk, ticketPending, ticketFailed } = useGetImages();
  const checkStatus = () => {
    if (!busData) {
      return 'pending';
    }
    if (busData?.orderStatus === 'ORDER_STATUS_ORDER_RESERVED' || 'ORDER_STATUS_BUY_CONFIRMED')
      return 'success';

    if (busData?.orderStatus === 'ORDER_STATUS_RESERVATION_EXPIRED') return 'expired';

    return 'failed';
  };

  const isSupperapp = useIsSuperApp();

  useEffect(() => {
    if (busData?.orderStatus) {
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
  }, [busData?.orderStatus]);

  const ticketDownload = () => {
    if (busData?.orderId) getBusTicket(busData?.orderId);
  };

  return (
    <div className={cn(styles['issuing'], !isMobile && styles['issuing__desktop'], 'mt-4')}>
      <HeaderHoc>صدور بلیط </HeaderHoc>
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
        {checkStatus() === 'expired'
          ? 'لطفا دوباره بلیط رزرو کنید . سفارش شما منقضی شده است .'
          : checkStatus() === 'success'
            ? 'بلیط شما با موفقیت صادر شد'
            : checkStatus() === 'pending'
              ? 'در حال صدور بلیط . لطفا منتظر بمانید'
              : 'مشکلی پیش آمده است'}
      </span>
      {checkStatus() === 'success' && (
        <div className="mt-3">بلیط‌ها در صفحه سفر‌های من قابل مشاهده است</div>
      )}
      {checkStatus() === 'success' ? (
        <div
          className={cn(
            styles['issuing__footer'],
            isSupperapp && styles['issuing__footer__isSupperapp'],
            isMobile ? 'position-absolute bottom-0 mb-3' : 'mt-2',
          )}
        >
          <Button
            loading={downloadBusTicketLoading}
            onClick={ticketDownload}
            className={styles['issuing__footer__btn']}
          >
            دانلود بلیط{' '}
          </Button>{' '}
          {isMobile && (
            <button
              onClick={() => void push('/bus')}
              className={cn(styles['issuing__footer__btn__return'], 'm-0 mt-3')}
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
              onClick={() => void push('/bus')}
            >
              بازگشت به صفحه اصلی
            </button>
          </div>
        )
      )}
    </div>
  );
};

export default BusIssuance;
