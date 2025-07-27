import { RefundEndpointPayload, TRefundReasons } from 'services/domestic/refund/interface';
import { AirplaneTicket, Passenger } from 'assets/icons';
import dayjs from 'dayjs';
import { OrderType } from 'module/flights/travels/interface';
import React, { ChangeEvent, useState } from 'react';
import styles from '../refund.module.scss';
import cn from 'classnames';
import { BottomSheet } from 'react-spring-bottom-sheet';
import Button from 'components/button';
import Modal from 'components/modal';
import { useMutation } from 'react-query';
import { notify } from 'utils/notification';
import { useRouter } from 'next/router';
import { calcRefund, refund } from 'services/domestic/refund';
import { findUserInfoBaseOnTicketId } from '../utils/tickets';
import { TRefundFlowStates } from 'containers/refund';
import TravelFlightInfo from '../../travels/components/info/flight';
import { getFlightTicketStatus } from '../../travels/helper/travelHelper';
import { RefundStatus } from '../TRefund';

export const RefundShowDetailsAndPassengers = ({
  details,
  order,
  selectedTrip,
  setSelectedTrip,
}: {
  details: OrderType;
  status: string;
  order: OrderType;
  selectedTrip: TRefundFlowStates;
  setSelectedTrip: React.Dispatch<React.SetStateAction<TRefundFlowStates>>;
}) => {
  const { query, push } = useRouter();
  const departureTime = new Date(Number(details.departureTime));
  const departureCalender = dayjs(departureTime).calendar('jalali').format('YYYY/MM/DD');
  const departureHour = departureTime.getHours();
  const departureMinute = departureTime.getMinutes();

  const [isBottomSheetOpen, setIsBottomSheetOpen] = useState(false);

  const [isModalOpen, setISModalOpen] = useState(false);

  const {
    mutate: mutateCalcRefund,
    isLoading: calculateLoading,
    data: calcRefundData,
  } = useMutation({
    mutationFn: async (payload: RefundEndpointPayload) => {
      return calcRefund(payload);
    },
    onSuccess: () => {
      setIsBottomSheetOpen(true);
    },
    onError: () => {
      notify({ type: 'error', message: 'لطفا دوباره تلاش کنید' });
    },
  });

  const calcRefundHandler = () => {
    if (selectedTrip.refundReason?.online) {
      mutateCalcRefund({
        orderId: query.id as string,
        refundReason: selectedTrip.refundReason?.refundReason as TRefundReasons,
        ticketIds: selectedTrip.ticketIds,
      });
      return;
    }

    const { refundReason, ticketIds, orderId } = selectedTrip;

    mutateRefund({
      refundReason: refundReason!.refundReason as TRefundReasons,
      ticketIds,
      orderId: orderId as string,
    });
  };

  const { mutate: mutateRefund, isLoading: refundIsLoading } = useMutation({
    mutationFn: (payload: RefundEndpointPayload) => {
      return refund(payload);
    },
    onSuccess: () => {
      setIsBottomSheetOpen(false);
      setISModalOpen(true);
    },
    onError: () => {
      notify({ type: 'error', message: 'لطفا دوباره تلاش کنید' });
    },
  });

  const handleSelectPassenger = ({ target }: ChangeEvent<HTMLInputElement>, ticketId: string) => {
    const checked = target.checked;
    if (checked) {
      setSelectedTrip((prevState) => ({
        ...prevState,
        ticketIds: [...prevState.ticketIds, ticketId],
      }));
      return;
    }

    setSelectedTrip((prevState) => ({
      ...prevState,
      ticketIds: prevState.ticketIds.filter((el) => el !== ticketId),
    }));
  };

  return (
    <div className="rtl">
      <div className="my-3 rounded ">
        <div className={cn(styles['Details__item'], 'd-flex flex-column bg-color-white mb-3')}>
          <div
            className={cn(
              styles['Details__item__header'],
              'bg-color-blue-grey color-grey-1 px-3 py-2 text-weight-500',
            )}
          >
            <AirplaneTicket />
            <span className="px-2">جزئیات سفر</span>
          </div>
          <TravelFlightInfo
            info={{
              airline: `${details.departureAirline}`,
              date: `${departureHour}:${departureMinute}  ${departureCalender}`,
              flightNo: `${details.flightId}`,
              // price: `${details.price}`,
              pnr: `${details.pnr}`,
              return: false,
            }}
          />
        </div>
      </div>

      <div className={cn(styles['Details__item'], 'd-flex flex-column bg-color-white')}>
        <div
          className={cn(
            styles['Details__item__header'],
            'bg-color-blue-grey color-grey-1 px-3 py-2 text-weight-500',
          )}
        >
          <Passenger />
          <span className="px-2">مسافران</span>
        </div>
        <div className="d-flex flex-column p-3 text-3">
          {details.passengers.map((passenger, index) => {
            return (
              <>
                <div
                  className={cn(
                    'py-3',
                    details.passengers.length - 1 !== index
                      ? 'border-bottom border-color-light '
                      : '',
                  )}
                >
                  <div
                    className={cn(
                      'd-flex justify-content-between align-items-center',
                      passenger?.tickets?.[0]?.status !== 'TICKETSTATUS_ISSUED'
                        ? 'color-grey-1'
                        : '',
                    )}
                  >
                    <div>
                      <input
                        className="ms-3 align-middle"
                        type="checkbox"
                        disabled={passenger?.tickets?.[0]?.status !== 'TICKETSTATUS_ISSUED'}
                        onChange={(event) =>
                          handleSelectPassenger(event, passenger?.tickets?.[0]?.ticketId as string)
                        }
                      />
                      <span>
                        {passenger.firstName} {passenger.lastName}
                      </span>
                    </div>

                    <div>
                      {getFlightTicketStatus(passenger?.tickets?.[0]?.status as RefundStatus) ||
                        'نا مشخص'}
                    </div>
                  </div>
                </div>
              </>
            );
          })}
        </div>
      </div>

      <div
        className="m-3"
        style={{
          position: 'absolute',
          bottom: '0',
          left: 0,
          right: 0,
        }}
      >
        <Button
          className="w-100 btn-primary"
          radius
          loading={calculateLoading}
          disabled={!selectedTrip.ticketIds?.length}
          onClick={() => {
            calcRefundHandler();
          }}
        >
          تایید
        </Button>
      </div>

      <BottomSheet open={isBottomSheetOpen} onDismiss={() => setIsBottomSheetOpen(false)}>
        <div className="p-3 pb-4">
          <div className={cn(styles['Details__item'], 'd-flex flex-column bg-color-white mb-3')}>
            {calcRefundData?.ticketsRefundInfo?.map((ticketInfo) => {
              const info = findUserInfoBaseOnTicketId(order.passengers, ticketInfo.ticketId || '');
              return (
                <>
                  <div className={cn(styles['Details__item'], 'd-flex flex-column bg-color-white')}>
                    <div
                      className={cn(
                        styles['Details__item__header'],
                        'bg-color-blue-grey color-grey-1 px-3 py-2 text-weight-500',
                      )}
                    >
                      <Passenger />
                      <span className="px-2">
                        {(info?.passenger as { firstName: string }).firstName}{' '}
                        {(info?.passenger as { lastName: string }).lastName}
                      </span>
                    </div>
                    <div className="py-3 color-grey-1 text-3">
                      <div className="d-flex justify-content-between align-items-center">
                        <div>
                          {(info?.ticket as { payment: { price: string } })?.payment?.price}
                        </div>
                        <div>
                          <span>مبلغ بلیط</span>
                        </div>
                      </div>
                      <div className="d-flex justify-content-between align-items-center">
                        <div>{ticketInfo.refundPenalty}</div>
                        <div>
                          <span>مبلغ جریمه</span>
                        </div>
                      </div>
                      <div className="d-flex justify-content-between align-items-center">
                        <div>{ticketInfo.refundAmount}</div>
                        <div>
                          <span>مبلغ قابل استرداد</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              );
            })}
          </div>

          <Button
            className="w-100 btn-primary"
            radius
            loading={refundIsLoading}
            onClick={() => {
              mutateRefund({
                orderId: query.id as string,
                refundReason: selectedTrip.refundReason?.refundReason as TRefundReasons,
                ticketIds: [...selectedTrip.ticketIds],
              });
            }}
          >
            استرداد
          </Button>
        </div>
      </BottomSheet>

      <Modal visible={isModalOpen} onClose={() => setISModalOpen(false)} className="w-100 h-100 ">
        <div
          className={cn(
            styles['Details__item'],
            'd-flex flex-column bg-color-white justify-content-around',
            'rounded p-3',
          )}
        >
          <div className={cn('rounded mb-4 fs-3', styles['refund__mobile-modal'])}>
            {selectedTrip.refundReason?.successText}
          </div>
          <div className="fs-2" onClick={() => push('/travels')}>
            متوجه شدم
          </div>
        </div>
      </Modal>
    </div>
  );
};
