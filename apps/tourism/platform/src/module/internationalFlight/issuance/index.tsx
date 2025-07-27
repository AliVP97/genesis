import React, { useState } from 'react';
import styles from './issuance.module.scss';
import { useQuery, useMutation } from 'react-query';
import { useRouter } from 'next/router';
import cn from 'classnames';
import HeaderHoc from 'components/headerHoc';
import Button from 'components/button';
import { detectDevice } from 'utils/helpers/global';
import { downloadApi, getOrder } from 'services/internationalFlight/order';
import { useGetImages } from 'module/general/config/hooks/useGetImages';
import Image from 'next/image';
import { customLoader } from 'utils/helpers/imageLoader';
import Spinner from 'components/spinner';
import { HAFHASHTAD_TEL } from 'utils/static/global';

type TGetOrderResponse =
  | 'ORDER_STATUS_UNDEFINED'
  | 'ORDER_STATUS_CREATED'
  | 'ORDER_STATUS_PASSENGER_ADDED'
  | 'ORDER_STATUS_BOOKED'
  | 'ORDER_STATUS_BOOK_CANCELED'
  | 'ORDER_STATUS_PAYMENT_FAILED'
  | 'ORDER_STATUS_PAYMENT_SUCCESS'
  | 'ORDER_STATUS_ISSUE_FAILED'
  | 'ORDER_STATUS_ISSUE_PENDING'
  | 'ORDER_STATUS_ISSUE_SUCCESS'
  | 'ORDER_STATUS_ISSUE_TIMEOUT';

type TOrderStatus = 'ERROR' | 'FAILED' | 'SUCCESS' | 'TIMEOUT' | 'UNDEFINED';

const FlightIssuance = () => {
  const { query, push } = useRouter();
  const { ticketOk, ticketFailed } = useGetImages();
  const { mutate: mutateDownloadApi } = useMutation({
    mutationFn: (id: string) => {
      return downloadApi(id);
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

  const [ticketLoading, setTicketLoading] = useState(false);

  const [orderStatus, setOrderStatus] = useState<TOrderStatus>('UNDEFINED');

  const {
    data: flightData,
    isLoading,
    // isError,
    // refetch,
  } = useQuery(['order', query.id as string], getOrder, {
    enabled: !!query?.id,
    refetchInterval: (data, query) => {
      const orderStatuse = data?.order?.status?.status as unknown as TGetOrderResponse;

      if (query.state.error) {
        setOrderStatus('ERROR');
        return false;
      } else if (orderStatuse === 'ORDER_STATUS_ISSUE_FAILED') {
        setOrderStatus('FAILED');
        return false;
      } else if (orderStatuse === 'ORDER_STATUS_ISSUE_TIMEOUT') {
        setOrderStatus('TIMEOUT');
        return false;
      } else if (orderStatuse === 'ORDER_STATUS_ISSUE_SUCCESS') {
        setOrderStatus('SUCCESS');
        return false;
      } else return 5000;
    },
  });

  const ticketDownload = () => {
    setTicketLoading(true);
    mutateDownloadApi(flightData?.order?.orderId as string);
  };

  return (
    <div className={styles['issuing']}>
      <HeaderHoc>صدور بلیط </HeaderHoc>
      {/* IMAGE: ////////////////////////////////////////////////////////////////////////////*/}
      {orderStatus === 'ERROR' ? (
        ''
      ) : orderStatus === 'FAILED' ? (
        <Image
          loader={customLoader}
          src={ticketFailed}
          alt="failed"
          width="344"
          height="172"
          unoptimized
        /> /* : orderStatus === 'TIMEOUT' ? (
        ''
      ) */
      ) : orderStatus === 'SUCCESS' ? (
        <Image
          loader={customLoader}
          src={ticketOk}
          alt="success"
          width="344"
          height="172"
          unoptimized
        />
      ) : (
        <Spinner />
      )}
      {/* TEXT: /////////////////////////////////////////////////////////////////////////////*/}
      <div className={styles['status-message']}>
        {orderStatus === 'ERROR' ? (
          'خطایی رخ داده'
        ) : orderStatus === 'FAILED' ? (
          'صدور بلیط ناموفق' /* : orderStatus === 'TIMEOUT' ? (
          ''
        ) */
        ) : orderStatus === 'SUCCESS' ? (
          'صدور بلیط موفق'
        ) : (
          <div>
            <div>بلیت شما در حال صدور میباشد.</div>
            <div>فرآیند صدور بلیت پرواز خارجی زمان بر است، لطفا منتظر بمانید.</div>
            <div>{`شماره پشتیبانی : ${HAFHASHTAD_TEL}`}</div>
          </div>
        )}
      </div>
      {/* ACTION: ///////////////////////////////////////////////////////////////////////////*/}
      {orderStatus === 'ERROR' ? (
        ''
      ) : orderStatus === 'FAILED' ? (
        <div className={styles['issuing__footer']}>
          <button
            className={cn(styles['issuing__footer__btn__return'], 'm-0')}
            onClick={() => void push('/international')}
          >
            بازگشت به صفحه اصلی
          </button>
        </div>
      ) : orderStatus === 'TIMEOUT' ? (
        ''
      ) : orderStatus === 'SUCCESS' ? (
        <div className={styles['issuing__footer']}>
          <Button
            loading={isLoading || ticketLoading}
            onClick={ticketDownload}
            className={styles['issuing__footer__btn']}
          >
            مشاهده و دانلود بلیط{' '}
          </Button>
        </div>
      ) : (
        ''
      )}
    </div>
  );
};

export default FlightIssuance;
