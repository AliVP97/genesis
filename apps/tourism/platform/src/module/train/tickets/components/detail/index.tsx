import React, { useEffect, useState } from 'react';
import styles from './detail.module.scss';
import cn from 'classnames';
import { detailOptions, TabType, TicketType, TrainTicket } from '../../interface';

import Divider from 'components/divider';
import SwitchButton from 'components/switchButton';
import TrainDetail from '../trainDetail';
import RefundPolicy from '../refundPolicy';
import ticketDetailStyle from '../trainDetail/ticketDetail.module.scss';
import useDeviceDetect from 'utils/hooks/useDeviceDetect';
import { usePriceDetail } from '../../hooks/usePriceDetail';
import TicketDetailPassenger from '../detailPassenger';
import { TrainOrder } from 'services/train/orders/interface';
import Skeleton from 'components/skeleton';
import { useQuery } from 'react-query';
import { getMiddleStations } from 'services/train/tickets';
import { TrainMiddleStationsResponse } from 'services/train/tickets/interface';
import { useRouter } from 'next/router';
import { MiddleStations } from '../middleStations';
import { PassengersCount } from 'services/train/tickets/priceDetail/interface';
import CheckoutDetailsPassengers from 'module/train/checkout/components/detailsPassengers';
import { getTrainTripTotalPrice } from 'module/train/checkout/helper';

interface Props {
  order?: TrainOrder;
  ticket: TicketType;
  isSelected?: boolean;
  openedDetailId?: string;
  setIsCoupe: React.Dispatch<React.SetStateAction<boolean>>;
  setTotalPrice?: (price: string) => void;
}

const Detail = ({
  ticket,
  order,
  isSelected,
  openedDetailId,
  setIsCoupe,
  setTotalPrice,
}: Props) => {
  const { query } = useRouter();
  const [activeTab, setActiveTab] = useState<TabType>(TabType.DETAIL);
  const handleSelectTab = (str: TabType) => setActiveTab(str);
  const { isMobile } = useDeviceDetect();
  const [enable, setEnable] = useState(false);

  const { priceDetailPayload, detail, setIsChecked, priceLoading } = usePriceDetail(
    ticket as TrainTicket,
  );

  const { data: middleStations } = useQuery(
    ['getMiddleStations', ticket.trainId as string],
    getMiddleStations,
    {
      enabled: enable,
    },
  );

  useEffect(() => {
    if ((ticket?.trainId && ticket?.trainId === openedDetailId) || isSelected) {
      priceDetailPayload();
      setEnable(true);
    }
  }, [ticket?.trainId, openedDetailId]);

  useEffect(() => {
    if (setTotalPrice && detail) {
      setTotalPrice(detail?.totalPrice);
    }
  }, [detail]);

  const handleCoupeClick = (e: boolean) => {
    if (!isSelected && ticket?.trainId === openedDetailId && ticket.hasCompartment) {
      setIsChecked(e);
      priceDetailPayload(e);
      setIsCoupe(e);
    }
  };
  const [passengersCount, sePassengersCount] = useState<PassengersCount>();

  useEffect(() => {
    const last_search = JSON.parse(localStorage?.getItem('train_last_search') as string)?.[0];

    if (query.adult) {
      sePassengersCount({
        adult: query.adult as string,
        child: query.child as string,
        infant: query.infant as string,
        wantCompartment: query.wantCompartment as string,
      });
    } else {
      sePassengersCount({
        adult: last_search.passenger.adult,
        child: last_search.passenger.child,
        infant: last_search.passenger.infant,
        wantCompartment: last_search.wantCompartment,
      });
    }
  }, []);

  return (
    <div className={styles['detail__content']}>
      <div className="col-7 mx-2">
        <div className={cn('d-flex', styles['detail__item--divider'])}>
          {detailOptions.map((item) => (
            <div
              className={cn(
                'd-flex ',
                item.value === activeTab
                  ? styles['detail__item--options--active']
                  : styles['detail__item--options'],
              )}
              onClick={() => handleSelectTab(item.value)}
              key={item.value}
            >
              <span>{item.label}</span>
            </div>
          ))}
        </div>
        <div className={cn(ticketDetailStyle['ticket-detail'])}>
          {activeTab === TabType.DETAIL ? (
            <TrainDetail
              ticket={ticket as TicketType}
              isDesktop={!isMobile}
              openedDetailId={openedDetailId}
            />
          ) : activeTab === TabType.MIDDLESTATIONS ? (
            <MiddleStations
              stations={middleStations as Required<TrainMiddleStationsResponse>}
              isDesktop={!isMobile}
              selectedTicket={ticket}
            />
          ) : (
            <RefundPolicy data={ticket as TicketType} />
          )}
        </div>
      </div>
      <div className="col-5 mx=2">
        <div className={styles['detail__item']}>جزییات قیمت </div>
        <div className="ps-3 py-3">
          <div className={cn('p-3 bg-color-white-1', styles['detail__background'])}>
            <div>
              <div className="d-flex flex-column">
                <div dir="rtl" className="color-primary col text-start">
                  {isSelected &&
                  order &&
                  order.trips?.[0].trainInfo?.priceDetail &&
                  order.trips?.[0].trainInfo?.priceDetail?.length > 0 ? (
                    <>
                      {ticket.priceDetail?.map((item) => {
                        return (
                          <>
                            <CheckoutDetailsPassengers price={item} />
                          </>
                        );
                      })}
                    </>
                  ) : (
                    <>
                      {detail?.priceDetail?.map((item) => {
                        return (
                          <>
                            <TicketDetailPassenger price={item} count={passengersCount!} />
                          </>
                        );
                      })}
                    </>
                  )}
                </div>
              </div>

              <Divider type="horizontal" />
              <div className="d-flex align-items-center">
                <div className="col text-end text-3">مجموع قیمت</div>
                <span className="text-5 text-weight-500 color-primary">
                  {isSelected &&
                  order &&
                  order.trips?.[0].trainInfo?.priceDetail &&
                  order.trips?.[0].trainInfo?.priceDetail?.length > 0 ? (
                    <>{order && getTrainTripTotalPrice(order, ticket).toLocaleString()}</>
                  ) : (
                    <>
                      {priceLoading ? (
                        <Skeleton
                          uniqueKey="trainDetailsPrice"
                          type="trainDetailsPrice"
                          width={100}
                          height={30}
                        />
                      ) : Number(detail?.totalPrice) ? (
                        Number(detail?.totalPrice).toLocaleString()
                      ) : (
                        0
                      )}
                    </>
                  )}
                </span>
                <span className="text-3 me-1 color-primary">ریال </span>
              </div>

              {isSelected ? (
                <></>
              ) : (
                <>
                  <div className="d-flex justify-content-between mt-3">
                    <div>کوپه دربست می خواهم</div>

                    <SwitchButton
                      disabled={!ticket.hasCompartment}
                      defaultChecked={query['wantCompartment'] === 'true'}
                      onChange={(e) => handleCoupeClick(e)}
                    />
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Detail;
