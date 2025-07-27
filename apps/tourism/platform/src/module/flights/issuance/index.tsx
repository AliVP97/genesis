import React, { useEffect, useState } from 'react';
import styles from './issuance.module.scss';

import { useQuery, useMutation } from 'react-query';
import { getOrder } from 'services/domestic/orders';
import { useRouter } from 'next/router';
import cn from 'classnames';
import HeaderHoc from 'components/headerHoc';
import Button from 'components/button';
import { downloadApi } from 'services/domestic/download';
import { detectDevice } from 'utils/helpers/global';
import Image from 'next/image';
import { customLoader } from 'utils/helpers/imageLoader';
import { useGetImages } from 'module/general/config/hooks/useGetImages';

const getDescriptionClass = (status: string) => {
  switch (status) {
    case 'success':
      return styles['issuing__description--done'];
    case 'pending':
    case 'expired':
      return styles['issuing__description'];
    default:
      return styles['issuing__description--failed'];
  }
};

const getDescriptionText = (status: string) => {
  switch (status) {
    case 'expired':
      return 'لطفا دوباره بلیط رزرو کنید . سفارش شما منقضی شده است .';
    case 'success':
      return 'بلیط شما با موفقیت صادر شد';
    case 'pending':
      return 'در حال صدور بلیط . لطفا منتظر بمانید';
    default:
      return 'مشکلی پیش آمده است';
  }
};

const FlightIssuance = () => {
  const { query, push } = useRouter();

  const { mutate: mutateDownloadApi, isLoading } = useMutation({
    mutationFn: (id: string) => {
      return downloadApi(id);
    },
    onSuccess: (data) => {
      const url = data?.url;
      if (!url) {
        return;
      }
      if (detectDevice() === 'mobile') {
        window.location.href = url;
      } else {
        window.open(url, '_blank');
      }
      setTicketLoading(false);
    },
    onError: () => setTicketLoading(false),
  });

  const [intervalValue, setInterValValue] = useState(3000);
  const [ticketLoading, setTicketLoading] = useState(false);

  const { data: flightData } = useQuery(['order', query.id as string], getOrder, {
    enabled: !!query?.id,
    refetchInterval: intervalValue,
  });

  const checkStatus = () => {
    if (!flightData) {
      return 'pending';
    }
    if (flightData?.status === 'ORDERSTATUS_BUY_CONFIRMED') return 'success';
    if (
      flightData?.status === 'ORDERSTATUS_BUY_PENDING' ||
      flightData?.status === 'ORDERSTATUS_ORDER_RESERVED'
    )
      return 'pending';

    if (flightData.expireDate) {
      if (Number(flightData?.expireDate) < Date.now() / 1000) return 'expired';
    }
    return 'failed';
  };

  useEffect(() => {
    if (flightData?.status) {
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
  }, [flightData?.status]);

  const ticketDownload = () => {
    setTicketLoading(true);
    mutateDownloadApi(flightData?.orderId as string);
  };
  const { ticketOk, ticketPending, ticketFailed } = useGetImages();

  const status = checkStatus();
  const getImageSrc = () => {
    if (status === 'success') return ticketOk;
    if (status === 'pending' || isLoading) return ticketPending;
    return ticketFailed;
  };

  return (
    <div className={styles['issuing']}>
      <HeaderHoc>صدور بلیط </HeaderHoc>

      <Image
        loader={customLoader}
        src={getImageSrc()}
        alt="ticket"
        width="344"
        height="172"
        unoptimized
      />
      <span className={getDescriptionClass(status)}>{getDescriptionText(status)}</span>
      {checkStatus() === 'success' ? (
        <div className={styles['issuing__footer']}>
          <button
            onClick={() =>
              push(`/review/${query?.id}`).catch(() => {
                throw new Error('try it again');
              })
            }
            className={styles['issuing__footer__btn__see']}
          >
            مشاهده بلیط
          </button>
          <Button
            loading={ticketLoading}
            onClick={ticketDownload}
            className={styles['issuing__footer__btn']}
          >
            دانلود بلیط
          </Button>
        </div>
      ) : (
        (checkStatus() === 'failed' || checkStatus() === 'expired') && (
          <div className={styles['issuing__footer']}>
            <button
              className={cn(styles['issuing__footer__btn__return'], 'm-0')}
              onClick={() =>
                push('/flights').catch(() => {
                  throw new Error('try it again');
                })
              }
            >
              بازگشت به صفحه اصلی
            </button>
          </div>
        )
      )}
    </div>
  );
};

export default FlightIssuance;
