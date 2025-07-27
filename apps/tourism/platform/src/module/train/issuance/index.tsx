import React, { useEffect, useState } from 'react';
import styles from './issuance.module.scss';
import { useQuery, useMutation } from 'react-query';
import { getOrder as getTrainOrder } from 'services/train/orders';
import { downloadApi as TrainDownloadApi } from 'services/train/download';
import { useRouter } from 'next/router';
import cn from 'classnames';
import HeaderHoc from 'components/headerHoc';
import Button from 'components/button';
import useDeviceDetect from 'utils/hooks/useDeviceDetect';
import { detectDevice } from 'utils/helpers/global';
import { useIsSuperApp } from 'utils/hooks/useIsSuperApp';
import { useGetImages } from 'module/general/config/hooks/useGetImages';
import Image from 'next/image';
import { customLoader } from 'utils/helpers/imageLoader';

const TrainIssuance = () => {
  const { query, push } = useRouter();
  const { isMobile } = useDeviceDetect();
  const { ticketOk, ticketPending, ticketFailed } = useGetImages();
  const { mutate: mutateTrainDownloadApi, isLoading: trainIsLoading } = useMutation({
    mutationFn: (id: string) => {
      return TrainDownloadApi(id);
    },
    onSuccess: (data) => {
      setTicketLoading(false);
      if (detectDevice() === 'mobile') {
        window.location.href = data.url as string;
        return;
      }
      window.open(`${data?.url}`, '_blank');
    },
    onError: () => setTicketLoading(false),
  });

  const isSupperapp = useIsSuperApp();

  const [intervalValue, setInterValValue] = useState(3000);
  const [ticketLoading, setTicketLoading] = useState(false);

  const { data: trainData } = useQuery(['order', query.id as string], getTrainOrder, {
    enabled: !!query?.id,
    refetchInterval: intervalValue,
  });

  const checkStatus = () => {
    if (!trainData) {
      return 'pending';
    }
    if (trainData?.status === 'ORDER_STATUS_ORDER_RESERVED' || 'ORDER_STATUS_BUY_CONFIRMED')
      return 'success';
    if (trainData?.status === 'ORDER_STATUS_BUY_PENDING') return 'pending';

    if (trainData.reserveExpireDate) {
      if (+trainData?.reserveExpireDate < Date.now() / 1000) return 'expired';
    }
    return 'failed';
  };

  useEffect(() => {
    if (trainData?.status) {
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
  }, [trainData?.status]);

  const ticketDownload = () => {
    setTicketLoading(true);
    mutateTrainDownloadApi(trainData?.orderId as string);
  };

  return (
    <div className={cn(styles['issuing'], !isMobile && styles['issuing__desktop'])}>
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
      ) : checkStatus() === 'pending' || trainIsLoading ? (
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
            loading={ticketLoading}
            onClick={ticketDownload}
            className={styles['issuing__footer__btn']}
          >
            دانلود بلیط{' '}
          </Button>{' '}
          {isMobile && (
            <button
              onClick={() => void push('/train')}
              className={cn(styles['issuing__footer__btn__return'], 'm-0')}
            >
              بازگشت به صفحه اصلی{' '}
            </button>
          )}
        </div>
      ) : (
        (checkStatus() === 'failed' || checkStatus() === 'expired') && (
          <div className={styles['issuing__footer']}>
            <button
              className={cn(styles['issuing__footer__btn__return'], 'm-0')}
              onClick={() => void push('/train')}
            >
              بازگشت به صفحه اصلی
            </button>
          </div>
        )
      )}
    </div>
  );
};

export default TrainIssuance;
