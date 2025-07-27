import cn from 'classnames';
import Divider from 'components/divider';
import styles from './payment.module.scss';
import { useRouter } from 'next/router';
import { CloseCircleWhiteIcon, DoneIcon } from 'assets/icons';
import UAParser from 'ua-parser-js';
import { useEffect, useState } from 'react';
import Skeleton from 'components/skeleton';
import useDeviceDetect from 'utils/hooks/useDeviceDetect';
import { useQuery } from 'react-query';
import { OrderDetailResponse } from 'services/general/payment/interface';
import dayjs from 'dayjs';
import Button from 'components/button';
import { getTourOrderDetail } from 'services/tour/register';
import Link from 'next/link';
import UseTourVoucherDownload from '../../module/tour/issuance/hooks/useTourVoucherDownload';
// import {TourTrackingEvent} from 'utils/ecommerce/application/mappers/tour/events';
import { HAFHASHTAD_TEL } from 'utils/static/global';
import PaymentBanner from 'module/general/receipt/components/PaymentBanner';

const TourPaymentResult = () => {
  const userAgent = new UAParser();
  const { query, push } = useRouter();
  const [userId, setUserId] = useState('');
  const [loading, setLoading] = useState(true);
  const { isMobile } = useDeviceDetect();
  const { downloadTourVoucherLoading, getTourVoucher } = UseTourVoucherDownload();
  // const tourTrackingEvent = new TourTrackingEvent();

  const { data: result, error } = useQuery(
    [
      'order',
      query.orderId as string,
      {
        id: userId,
        version: userAgent.getDevice().vendor + '-' + userAgent.getDevice().model,
      },
    ],
    getTourOrderDetail,
    {
      enabled: !!userId,
    },
  );
  useEffect(() => {
    const timeout = setTimeout(() => {
      localStorage.removeItem('tour-auth');
    }, 60 * 50000);
    return () => clearTimeout(timeout);
  }, []);
  const serviceData = () => {
    if (result) {
      const { about } = result?.data as OrderDetailResponse['data'];
      return { about };
    }
  };
  useEffect(() => {
    if (result || error) setLoading(false);
    if (result?.status === 'success') {
      // tourTrackingEvent.purchase(result);
    }
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
                result?.status !== 'success' ? 'bg-color-red-1' : 'bg-color-green-1',
              )}
            >
              {result?.status !== 'success' ? <CloseCircleWhiteIcon /> : <DoneIcon />}
            </div>
            <div className={cn(styles['payment__result__status--title'], 'text-center pt-2')}>
              <span className={result?.status !== 'success' ? 'color-red-1' : 'color-green-1'}>
                {result?.status !== 'success' ? 'پرداخت ناموفق' : 'پرداخت موفق'}
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
            <div className={cn(styles['payment__result--row'], 'd-flex justify-content-between')}>
              <span className="text-2">بابت:</span>
              <span className="text-3">{serviceData()?.about}</span>
            </div>
            {result?.mask && (
              <div className={cn(styles['payment__result--row'], 'd-flex justify-content-between')}>
                <span className="text-2">کارت مبدا:</span>
                <span className="text-3 ltr">{result?.mask}</span>
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
            {result?.saleReferenceId !== undefined && (
              <div className={cn(styles['payment__result--row'], 'd-flex justify-content-between')}>
                <span className="text-2">شماره پرداخت:</span>
                <span className="text-3">{result?.saleReferenceId}</span>
              </div>
            )}
            {result?.data?.rrn !== undefined && (
              <div className={cn(styles['payment__result--row'], 'd-flex justify-content-between')}>
                <span className="text-2">شماره پیگیری:</span>
                <span className="text-3">{result?.data?.rrn}</span>
              </div>
            )}

            <div className={cn(styles['payment__result--row'], 'd-flex justify-content-between')}>
              <span className="text-2">شماره پشتیبانی:</span>
              <Link href={`tel:${HAFHASHTAD_TEL}`}>
                <span role="button" dir={'rtl'} className="text-center text-3 text-black">
                  021-4780
                </span>
              </Link>
            </div>
          </>
        )}
        <div className={styles['payment__result__status--footer']} />
      </div>
      {isMobile && <PaymentBanner />}
      <div className="w-50 mx-auto">
        {result?.status === 'success' && (
          <Button
            loading={downloadTourVoucherLoading}
            radius
            className="w-100  mb-2 bg-color-primary"
            onClick={() => getTourVoucher(query.orderId as string)}
          >
            مشاهده و دانلود بلیط
          </Button>
        )}
        <Button radius className="w-100 bg-color-primary" onClick={() => push('/tour')}>
          بازگشت به صفحه اصلی
        </Button>
      </div>
    </div>
  );
};

export default TourPaymentResult;
