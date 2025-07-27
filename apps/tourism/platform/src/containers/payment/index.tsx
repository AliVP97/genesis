import cn from 'classnames';
import Button from 'components/button';
import Divider from 'components/divider';
import styles from './payment.module.scss';
import { useRouter } from 'next/router';
import { CloseCircleWhiteIcon, DoneIcon } from 'assets/icons';
import UAParser from 'ua-parser-js';
import { useEffect, useState } from 'react';
import Skeleton from 'components/skeleton';
import useDeviceDetect from 'utils/hooks/useDeviceDetect';
import { useQuery } from 'react-query';
import { getOrderDetail } from 'services/general/payment';
import { OrderDetailResponse } from 'services/general/payment/interface';
import dayjs from 'dayjs';
import PaymentBanner from 'module/general/receipt/components/PaymentBanner';

function getFailedPath(serviceName: string | string[] | undefined) {
  // International flight is not correct and should redirect page to international page
  if (serviceName === 'international-flight') {
    return '/international';
  }
  if (serviceName === 'tourism') {
    return '/flights';
  }

  return '/' + serviceName;
}

const PaymentResult = () => {
  const userAgent = new UAParser();
  const { query, push, beforePopState } = useRouter();
  const router = useRouter();
  const [userId, setUserId] = useState('');
  const [loading, setLoading] = useState(true);
  const { isMobile } = useDeviceDetect();

  useEffect(() => {
    if (query?.serviceName === 'hotel' && query?.status === 'failed') {
      beforePopState(() => {
        window.history.go(-3);
        return false;
      });
    }
  }, [router]);
  const { data: result, error } = useQuery(
    ['order', query.orderId as string, userId],
    getOrderDetail,
    {
      enabled: !!userId,
      meta: {
        id: userId,
        orderId: query.orderId,
        version: userAgent.getDevice().vendor + '-' + userAgent.getDevice().model,
      },
    },
  );
  const serviceData = () => {
    if (result) {
      const { type, about, reason, fromFa, toFa } = result?.data as OrderDetailResponse['data'];
      switch (type) {
        case 'flight':
          return { about };
        case 'train':
          return { about };
        case 'bus':
          return { about };
        case 'international':
          return { about: `${reason} ${fromFa} - ${toFa}` };
        case 'hotel':
          return { about: reason };
      }
    }
  };

  useEffect(() => {
    if (result || error) setLoading(false);
  }, [result]);

  useEffect(() => {
    if (result || error) setLoading(false);
  }, [result]);

  useEffect(() => {
    const id = localStorage.getItem('user_id') as string;
    if (id) setUserId(id);
  }, []);

  return (
    <div className={cn(styles['payment'], !isMobile ? 'position-relative' : '', 'container')}>
      <div className={styles['payment__result']}>
        {loading ? (
          <Skeleton uniqueKey="receipt" type="receipt" className="d-flex justify-content-center" />
        ) : (
          <>
            <div
              className={cn(
                styles['payment__result__status--icon'],
                query?.status === 'failed' ? 'bg-color-red-1' : 'bg-color-green-1',
              )}
            >
              {result?.status === 'failed' ? <CloseCircleWhiteIcon /> : <DoneIcon />}
            </div>
            <div className={cn(styles['payment__result__status--title'], 'text-center pt-2')}>
              <span className={query?.status === 'failed' ? 'color-red-1' : 'color-green-1'}>
                {query?.status === 'failed' ? 'پرداخت ناموفق' : 'پرداخت موفق'}
              </span>
            </div>
            <Divider type="horizontal" />
            {result?.price && (
              <div
                className={cn(
                  styles['payment__result--row'],
                  styles['payment__result--row-price'],
                  'd-flex justify-content-between',
                )}
              >
                <span className="text-2">مبلغ:</span>
                <span className="color-primary text-5">
                  {result?.price.toLocaleString()} <span>ریال</span>
                </span>
              </div>
            )}
            {result?.status !== 'failed' && (
              <div className={cn(styles['payment__result--row'], 'd-flex justify-content-between')}>
                <span className="text-2">بابت:</span>
                <span className="text-3">{serviceData()?.about}</span>
              </div>
            )}
            {result?.mask && (
              <div className={cn(styles['payment__result--row'], 'd-flex justify-content-between')}>
                <span className="text-2">کارت مبدا:</span>
                <span className="text-3 ltr">{result?.mask}</span>
              </div>
            )}

            {result?.data?.checkinDate && (
              <div className={cn(styles['payment__result--row'], 'd-flex justify-content-between')}>
                <span className="text-2">تاریخ ورود:</span>
                <span className="text-3 ltr">{result?.data?.checkinDate}</span>
              </div>
            )}
            {result?.data?.checkoutDate && (
              <div className={cn(styles['payment__result--row'], 'd-flex justify-content-between')}>
                <span className="text-2">تاریخ خروج:</span>
                <span className="text-3 ltr">{result?.data?.checkoutDate}</span>
              </div>
            )}
            {result?.createdAt && (
              <div className={cn(styles['payment__result--row'], 'd-flex justify-content-between')}>
                <span className="text-2">ساعت و تاریخ:</span>
                <span className="text-3">
                  {dayjs(result?.createdAt)
                    .add(3, 'hour')
                    .add(30, 'minute')
                    .calendar('jalali')
                    .locale('fa')
                    .format('HH:mm:ss - YYYY/MM/DD')}
                </span>
              </div>
            )}
            {result?.saleReferenceId !== '0' && (
              <div className={cn(styles['payment__result--row'], 'd-flex justify-content-between')}>
                <span className="text-2">شماره پیگیری:</span>
                <span className="text-3">{result?.saleReferenceId}</span>
              </div>
            )}
          </>
        )}
        <div className={styles['payment__result__status--footer']} />
      </div>
      {isMobile && <PaymentBanner />}
      <div className={styles['payment__btn']}>
        <Button
          radius
          className="w-100 bg-color-primary"
          onClick={() =>
            push(
              result?.status === 'failed'
                ? getFailedPath(query?.serviceName)
                : result?.serviceName === 'rajatrain'
                  ? `/train/issuance/${query?.orderId}`
                  : result?.serviceName === 'bus'
                    ? `/bus/issuance/${query?.orderId}`
                    : result?.serviceName === 'international-flight'
                      ? `/international/issuance/${query?.orderId}`
                      : result?.serviceName === 'hotel'
                        ? `/hotel/issuance/${query?.orderId}`
                        : `/flights/issuance/${query?.orderId}`,
            )
          }
        >
          {query?.status === 'failed'
            ? 'بازگشت به صفحه اصلی'
            : result?.serviceName === 'international-flight'
              ? 'تایید و ادامه'
              : 'مشاهده بلیط'}
        </Button>
      </div>
    </div>
  );
};

export default PaymentResult;
