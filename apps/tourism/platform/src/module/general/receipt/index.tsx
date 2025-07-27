import { useCallback, useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/router';
import { AxiosError } from 'axios';
import cn from 'classnames';
import { useQuery } from 'react-query';
import { toast } from 'react-toastify';
import UAParser from 'ua-parser-js';

import { DynamicButtons, StatusPanel } from './components';
import AlertPanel, { TAlertPanelVaraints } from 'components/AlertPanel';
import { DynamicInvoice } from 'components/DynamicInvoice';
import { ShareButtons } from 'components/ShareButtons';
import Skeleton from 'components/skeleton';
import ChanceCard from 'components/userChanceCard';
import { getOrderReceipt } from 'services/general/payment';

import styles from './payment.module.scss';
import { BusTrackingEvent } from 'utils/ecommerce/application/mappers/bus/event';
import { useSelector } from 'react-redux';
import { RootState } from 'store';
import {
  busViewListItemModel,
  purchaseBusModel,
} from 'utils/ecommerce/application/mappers/bus/types';
import { TrainTrackingEvent } from 'utils/ecommerce/application/mappers/train/events';
import { trainViewListItemModel } from 'utils/ecommerce/application/mappers/train/types';
import { IPurchasePropsModel } from 'utils/ecommerce/domain/models';
import { HotelTrackingEvent } from 'utils/ecommerce/application/mappers/hotel/event';
import { hotelViewListItemModel } from 'utils/ecommerce/application/mappers/hotel/types';
import PaymentBanner from './components/PaymentBanner';
import useDeviceDetect from 'utils/hooks/useDeviceDetect';
import { FlightInternationalTracking } from 'utils/ecommerce/application/mappers/international-flight/events';
import { viewItemListModel } from 'utils/ecommerce/application/mappers/international-flight/types';
import { propsModel } from 'utils/ecommerce/application/mappers/domestic-flight/types';
import { DomesticFlightTrackingEvent } from 'utils/ecommerce/application/mappers/domestic-flight/events';
import { ServiceNameFromPaymentSide } from 'utils/ecommerce/domain/constants';

const Receipt = () => {
  const { isMobile } = useDeviceDetect();
  const [userId, setUserId] = useState('');

  const receiptRef = useRef(null);
  const userAgent = new UAParser();
  const { query, push, beforePopState } = useRouter();

  const {
    data: receipt,
    isFetched,
    isFetching,
    refetch,
  } = useQuery(['receipt', query?.orderId, userId], getOrderReceipt, {
    enabled: !!userId,
    onError: (err) => {
      if (err instanceof AxiosError) {
        toast.error((err.response?.data as { message: string })?.message);
      }
    },
    meta: {
      id: userId,
      orderId: query.orderId,
      version: userAgent.getDevice().vendor + '-' + userAgent.getDevice().model,
    },
  });

  const clickHandler = useCallback((type?: string, cta?: string) => {
    if (type === 'inquiry') {
      return refetch();
    } else if (type === 'redirect' && cta) {
      return push(cta);
    }
  }, []);

  useEffect(() => {
    const id = localStorage.getItem('user_id') as string;
    if (id) setUserId(id);
  }, []);

  const {
    busData,
    trainData,
    trainPassengersLength,
    hotelData,
    internationalFlightCartObject,
    domesticFlightData,
  } = useSelector((state: RootState) => state?.ecommerceReducer?.ecomerceSlice);
  useEffect(() => {
    const isSuccessOrPending =
      receipt?.status?.type === 'success' || receipt?.status?.type === 'pending';

    if (isSuccessOrPending) {
      switch (receipt?.meta?.serviceName) {
        case ServiceNameFromPaymentSide.BUS:
          if (busData) {
            const busEvent = new BusTrackingEvent();
            const props: purchaseBusModel = {
              rrn: receipt?.meta?.rrn,
              price: receipt?.meta?.price,
            };
            busEvent.purchase(busData as busViewListItemModel, props as purchaseBusModel);
          }
          break;
        case ServiceNameFromPaymentSide.TRAIN:
          if (trainData) {
            const trainEvent = new TrainTrackingEvent();

            const props: purchaseBusModel = {
              rrn: receipt?.meta?.rrn,
              price: receipt?.meta?.price,
            };
            trainEvent.purchase(
              trainData as trainViewListItemModel,
              props as IPurchasePropsModel,
              trainPassengersLength as number,
            );
          }
          break;
        case ServiceNameFromPaymentSide.HOTEL:
          if (hotelData instanceof Object && 'data' in hotelData) {
            const hotelEvent = new HotelTrackingEvent();
            const hotelProps: IPurchasePropsModel = {
              price: receipt?.meta?.price,
              rrn: receipt?.meta?.rrn,
            };
            hotelEvent.purchase(hotelData as hotelViewListItemModel, hotelProps);
          }
          break;
        case ServiceNameFromPaymentSide.INTERNATIONALFLIGHT:
          if (
            internationalFlightCartObject instanceof Object &&
            'ticketsData' in internationalFlightCartObject
          ) {
            const internationalFlightTracking = new FlightInternationalTracking();
            const internationalProps: IPurchasePropsModel = {
              price: receipt?.meta?.price,
              rrn: receipt?.meta?.rrn,
            };
            internationalFlightTracking.purchase(
              internationalFlightCartObject as viewItemListModel,
              internationalProps,
            );
          }
          break;

        case ServiceNameFromPaymentSide.DOMESTICFLIGHT:
          if (domesticFlightData) {
            const domesticFlightTracking = new DomesticFlightTrackingEvent();
            const flightData = {
              ...domesticFlightData,
            };
            const domesticProps: IPurchasePropsModel = {
              price: receipt?.meta?.price,
              rrn: receipt?.meta?.rrn,
            };
            domesticFlightTracking.purchase(flightData as propsModel, domesticProps);
          }

        default:
          break;
      }
    }
    if (receipt?.meta?.serviceName === 'hotel' && receipt.status?.type === 'failed') {
      beforePopState(() => {
        window.history.go(-3);
        return false;
      });
    }
  }, [receipt]);

  return (
    <div className={cn(styles.payment, 'container')}>
      <div className={styles['payment__print-wrapper']} ref={receiptRef}>
        <div className={styles['payment__print-wrapper__result']}>
          {isFetched && !isFetching ? (
            <>
              <StatusPanel data={receipt?.status} />
              {receipt?.tips?.map(({ id, type, text }) => (
                <AlertPanel key={id} variant={type as TAlertPanelVaraints}>
                  {text}
                </AlertPanel>
              ))}
              <hr />
              <DynamicInvoice sections={receipt?.sections} />
              {(receipt?.status?.type === 'success' || receipt?.status?.type === 'failed') && (
                <>
                  <hr className={styles.sparator} />
                  <div className={styles['payment__print-wrapper__result__share']}>
                    <ShareButtons elementRef={receiptRef} />
                  </div>
                </>
              )}
            </>
          ) : (
            <Skeleton
              uniqueKey="receipt"
              type="receipt"
              className="d-flex justify-content-center"
            />
          )}
          <div className={styles['payment__print-wrapper__result__footer']} />
        </div>
      </div>
      <div className={styles.payment__chance}>
        <ChanceCard />
      </div>
      {isMobile && <PaymentBanner />}
      <div className="mb-4 w-100 d-flex align-items-center justify-content-center">
        <DynamicButtons data={receipt?.buttons} clickHandler={clickHandler} />
      </div>
    </div>
  );
};

export default Receipt;
