import { FC, FormEventHandler, Fragment, useEffect, useState } from 'react';

import cn from 'classnames';
import dayjs from 'dayjs';
import { useQuery } from 'react-query';

import { Passenger, TrainTicket } from 'assets/icons';
import { useResponsive } from 'utils/hooks/useResponsive';
import Checkbox from 'components/checkbox';
import { getOrderV2 } from 'services/train/orders';
import { TrainTicketType } from 'module/train/tickets/interface';
import { tariffPersianName } from 'module/train/utils';
import { Badge } from 'components/badge';
import { useTrainRefundPath } from '../hooks';
import { Loader } from './Loader';
import { TComponentProps } from '.';

import styles from '../Refund.module.scss';

export const isRefundable = (ticketStatus: TrainTicketType['ticketStatus']) =>
  ticketStatus &&
  !['TICKET_STATUS_REFUND_ACCEPTED', 'TICKET_STATUS_REFUND_PENDING'].includes(ticketStatus);

export const RefundDetails: FC<TComponentProps> = ({ setAllowSubmit }) => {
  const { orderId, trainId, push } = useTrainRefundPath();
  const {
    data: orderData,
    error,
    isFetching,
    isError,
    refetch,
  } = useQuery(['train-order', orderId], getOrderV2, { staleTime: 15000, retry: false });
  const tripData = orderData?.trips?.find(({ trainInfo }) => trainInfo?.trainId === trainId);

  const [selectedTickets, setSelectedTickets] = useState(new Set());

  const { isMobile } = useResponsive();

  const onTicketSelect = (id: string) => {
    setSelectedTickets((prev) => {
      if (selectedTickets.has(id)) {
        prev.delete(id);
      } else {
        prev.add(id);
      }

      return new Set(prev);
    });
  };

  const onSubmit: FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();

    const ticketIdsArray = Array.from(selectedTickets) as string[];

    if (ticketIdsArray.length > 0) {
      push({ ticketIds: ticketIdsArray });

      setAllowSubmit(false);
    }
  };

  useEffect(() => {
    if (selectedTickets.size > 0) {
      setAllowSubmit(true);
    } else {
      setAllowSubmit(false);
    }
  }, [selectedTickets.size > 0]);

  const TripDetail = () =>
    isMobile ? (
      <div className="w-100 card border-0 shadow-sm">
        <div
          className={cn('bg-color-surface-container d-flex w-100 py-3 rounded-top text-end px-3')}
        >
          <div className="col-6">
            <TrainTicket />
            <b className="pe-2">
              {tripData?.trainInfo?.originName} - {tripData?.trainInfo?.destinationName}
            </b>
          </div>
        </div>
        <div className="py-2">
          <div className="d-flex justify-content-between py-2 p-3 color-grey-1">
            <span>شرکت ریلی</span>
            {tripData?.trainInfo?.companyName}
          </div>
          <div className="d-flex justify-content-between py-2 p-3 color-grey-1">
            <span>تاریخ و ساعت حرکت</span>
            <span>
              {tripData?.trainInfo?.departureDateHourString} -{' '}
              {dayjs(Number(tripData?.trainInfo?.departureDate) * 1000)
                .calendar('jalali')
                .format('YYYY/MM/DD')}
            </span>
          </div>
        </div>
      </div>
    ) : (
      <table
        className={cn(styles.refund__modal__table, 'bg-color-surface-container-low w-100 my-2')}
      >
        <thead>
          <tr
            className={cn(
              styles.refund__modal__table__items__font,
              'bg-color-surface-container color-on-surface w-100  text-center',
            )}
          >
            <th className="py-3"> مسیر </th>
            <th>شرکت ریلی</th>
            <th>تاریخ و ساعت حرکت</th>
          </tr>
        </thead>
        <tbody>
          <tr className="text-center">
            <td>
              {tripData?.trainInfo?.originName} - {tripData?.trainInfo?.destinationName}
            </td>
            <td>{tripData?.trainInfo?.companyName}</td>
            <td>
              {tripData?.trainInfo?.departureDateHourString} -{' '}
              {dayjs(Number(tripData?.trainInfo?.departureDate) * 1000)
                .calendar('jalali')
                .format('YYYY/MM/DD')}
            </td>
          </tr>
        </tbody>
      </table>
    );

  const PassengerDetail = () =>
    isMobile ? (
      <div className="d-md-none w-100 card border-0 shadow-sm mt-3">
        <div
          className={cn('bg-color-surface-container d-flex w-100 py-3 rounded-top text-end px-3')}
        >
          <div className="col-6">
            <Passenger />
            <b className="pe-2">مسافران </b>
          </div>
          <div className="col-6 text-start">{tripData?.tickets?.length} مسافر</div>
        </div>
        <div className="py-2">
          {tripData?.tickets?.map(({ id, persianStatus, passenger, ticketStatus, tariff }) => {
            return (
              <div
                key={`${passenger?.nationalCode}-${passenger?.passportId}`}
                className="d-flex justify-content-between py-2 p-3 color-on-surface align-items-center"
                onClick={() => {
                  if (id && isRefundable(ticketStatus)) {
                    onTicketSelect(id);
                  }
                }}
              >
                <span className="text-center d-flex justify-content-center align-items-center py-3">
                  <Checkbox
                    disabled={!isRefundable(ticketStatus)}
                    checked={!isRefundable(ticketStatus) || selectedTickets.has(id)}
                  />
                  <div className="ps-2">
                    {passenger?.firstName || passenger?.englishFirstName}{' '}
                    {passenger?.lastName || passenger?.englishLastName}
                  </div>
                  {tariff && <Badge>{tariffPersianName[tariff]}</Badge>}
                </span>

                <span className="text-center">{persianStatus}</span>
              </div>
            );
          })}
        </div>
      </div>
    ) : (
      <>
        <p className="pt-3 d-none d-md-block">لطفا مسافر مورد نظر را انتخاب نمایید</p>
        <table
          className={cn(styles.refund__modal__table, 'bg-color-surface-container-low w-100 my-2')}
        >
          <tr
            className={cn(
              styles.refund__modal__table__items__font,
              'bg-color-surface-container color-on-surface w-100',
            )}
          >
            <th
              className={cn(
                styles['refund__modal__table__items__radius-right'],
                'text-center py-4',
              )}
            ></th>
            <th className="text-center">نام و نام خانوادگی</th>
            <th className="text-center">تعرفه</th>
            <th className="text-center">وضعیت بلیط</th>
          </tr>
          {tripData?.tickets?.map(({ id, persianStatus, passenger, ticketStatus, tariff }) => {
            return (
              <tr
                key={`${passenger?.nationalCode}-${passenger?.passportId}`}
                className="cursor-pointer"
                onClick={() => {
                  if (id && isRefundable(ticketStatus)) {
                    onTicketSelect(id);
                  }
                }}
              >
                <td className="text-center d-flex justify-content-center align-items-center py-3">
                  <Checkbox
                    disabled={!isRefundable(ticketStatus)}
                    checked={!isRefundable(ticketStatus) || selectedTickets.has(id)}
                  />
                </td>
                <td className="text-center">
                  {passenger?.firstName || passenger?.englishFirstName}{' '}
                  {passenger?.lastName || passenger?.englishLastName}
                </td>
                <td className="text-center">{tariff ? tariffPersianName[tariff] : '-'}</td>
                <td className="text-center">{persianStatus}</td>
              </tr>
            );
          })}
        </table>
      </>
    );

  return (
    <Loader {...{ isFetching, isError, error, refetch }}>
      <form id="train-refund" onSubmit={onSubmit} className="w-100">
        <TripDetail />
        <PassengerDetail />
      </form>
    </Loader>
  );
};
