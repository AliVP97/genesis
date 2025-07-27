import HeaderHoc from 'components/headerHoc';
import cn from 'classnames';
import styles from './reviewTicket.module.scss';
import { DownloadIcon } from 'assets/icons';
import ViewReceipt from 'module/flights/receipt';
import React, { useMemo } from 'react';
import { useRouter } from 'next/router';
import { useQuery, useMutation } from 'react-query';
import { getOrder } from 'services/domestic/orders';
import { OrderPassengerList } from 'services/domestic/orders/interface';
import useDeviceDetect from 'utils/hooks/useDeviceDetect';
import ReviewTicketDesktop from './desktop';
import { downloadApi } from 'services/domestic/download';
import { notify } from 'utils/notification';
import { detectDevice } from 'utils/helpers/global';

const ReviewTicket = () => {
  const { query } = useRouter();
  const { data } = useQuery(['order', query.id as string], getOrder);
  const { isMobile } = useDeviceDetect();
  const orderId = String(query.id);

  const { mutate: mutateDownloadApi, isLoading } = useMutation({
    mutationFn: (id: string) => {
      return downloadApi(id);
    },
    onSuccess: (downloadData) => {
      const url = downloadData?.url;
      if (!url) {
        return;
      }
      if (detectDevice() === 'mobile') {
        window.location.href = url;
      } else {
        window.open(url, '_blank');
      }
    },
    onError: (error) => {
      if (error instanceof Error) notify({ type: 'error', message: (error as Error)?.message });
    },
  });

  const order = useMemo(() => {
    return (data?.passengers as OrderPassengerList)?.map((item) => {
      if (item?.tickets!.length > 1)
        return {
          passenger: { ...item.passenger },
          tickets: [...item.tickets!],
          return: true,
        };

      return {
        passenger: { ...item.passenger },
        tickets: [...item.tickets!],
        return: false,
      };
    }, []);
  }, [data]);

  const downloadTicket = () => {
    mutateDownloadApi(orderId);
  };

  return (
    <div className={styles['reviewTicket']}>
      {isMobile ? (
        <>
          <HeaderHoc>
            <span className="text-3 text-weight-500">ادامه و مشاهده بلیط</span>
          </HeaderHoc>
          <div className="container rtl">
            <div className={cn(styles['reviewTicket__title'], 'text-center')}></div>
          </div>
          {order?.map((item, index) => {
            return (
              <div key={index.toString() + item?.passenger?.birthDate} className="rtl">
                <div className={cn('d-flex m-0 px-3 pt-2 pb-3')}>
                  <div className={cn(styles['reviewTicket__content__title'], 'col-6 text-end')}>
                    <span>
                      {item?.passenger?.firstname?.farsi} {item?.passenger?.lastname?.farsi}
                    </span>
                  </div>
                  <div className="col-6 text-start">
                    <DownloadIcon
                      className={styles['reviewTicket__content__download-icon']}
                      onClick={downloadTicket}
                    />
                  </div>
                </div>
                {item.tickets?.map((el, i) => (
                  <ViewReceipt
                    key={i.toString() + 'receipt'}
                    passenger={item.passenger}
                    detail={el}
                    returnFlag={item.return}
                    tripType={i === 0}
                  />
                ))}
              </div>
            );
          })}
        </>
      ) : (
        <ReviewTicketDesktop isLoading={isLoading} order={order} downloadTicket={downloadTicket} />
      )}
    </div>
  );
};
export default ReviewTicket;
