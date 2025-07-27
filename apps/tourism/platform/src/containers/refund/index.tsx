import { useRouter } from 'next/router';
import { useQuery, useMutation, QueryFunctionContext } from 'react-query';
import React, { useMemo, useState } from 'react';
import { OrderType } from 'module/flights/travels/interface';
import { definitions } from 'types/shoppingorder';

import {
  RefundSelectPath,
  RefundSelectReason,
  RefundShowDetailsAndPassengers,
  STEPS,
} from '../../module/flights/refund';
import { getOrder } from 'services/domestic/flight';
import { OrderPassengerList } from 'services/domestic/orders/interface';
import { getRefundReason } from 'services/domestic/refund';

export type TRefundFlowStates = {
  flightId?: string;
  orderId?: string;
  isDeparture?: boolean;
  refundReason: definitions['apishoppingorderRefundReasonItem'] | null;
  ticketIds: Array<string>;
};

export const RefundContainer: React.FC = () => {
  const router = useRouter();

  // const {
  //   data: order,
  //   isLoading,
  //   isSuccess,
  // } = useQuery(['order', router.query.id as string], getOrder);

  const {
    data: order,
    isLoading,
    isSuccess,
  } = useQuery({
    queryKey: ['order', router.query.id as string],
    queryFn: (qr) => getOrder(qr as QueryFunctionContext),
    enabled: !!router.query.id,
  });
  const [step, setStep] = useState<STEPS>('selectPath');

  //@ts-ignore
  const orderComputed: OrderType = useMemo(() => {
    if (!isSuccess) return [];
    const orderItem = (order?.passengers as OrderPassengerList).reduce(
      (acc: OrderType, cur, index) => {
        if (index === 0) {
          acc.departureCity = cur.tickets![0]?.flightInfo?.departure?.airport?.city?.name?.farsi;
          acc.arrivalCity = cur.tickets![0]?.flightInfo?.arrival?.airport?.city?.name?.farsi;
          acc.price = cur?.tickets![0]?.payment?.totalPrice;
          acc.orderId = orderItem?.orderId;
          acc.departureAirline = cur.tickets![0]?.flightInfo?.airline?.name;
          acc.departureTime = cur.tickets![0]?.flightInfo?.departure?.date;
          acc.issueDate = orderItem?.createdDate;
          acc.orderNumber = orderItem?.orderNumber;
          acc.pnr = cur.tickets![0]?.pnr;
          acc.arrivalPnr = cur.tickets![1]?.pnr;

          acc.departurePrice = cur.tickets![0]?.payment?.totalPrice;
          acc.arrivalPrice = cur.tickets![1]?.payment?.totalPrice;
          acc.return = cur.tickets!.length > 1;
          acc.refundReason = cur.tickets![0]?.refundReason;
          acc.ticketId = cur.tickets![0]?.ticketId;

          acc.departureIata = cur.tickets![0]?.flightInfo?.departure?.airport?.iata;
          acc.arivalIata = cur.tickets![0]?.flightInfo?.arrival?.airport?.iata;
          acc.flightId = cur.tickets![0]?.flightInfo?.flightID;
          if (acc.return) {
            acc.returnFlightId = cur.tickets![1]?.flightInfo?.flightID;
            cur.tickets![1]?.flightInfo?.departure?.airport?.iata;
            acc.returnArivalIata = cur.tickets![1]?.flightInfo?.arrival?.airport?.iata;
            acc.returnTicketId = cur.tickets![1]?.ticketId;
            acc.returnRefundReason = cur.tickets![1]?.refundReason;
            acc.arrivalAirline = cur.tickets![1]?.flightInfo?.airline?.name;
            acc.returningDepartureTime = cur.tickets![1]?.flightInfo?.departure?.date;

            acc.returnArivalCity = cur.tickets![1]?.flightInfo?.arrival?.airport?.city?.name?.farsi;
            acc.returnDepartureCity =
              cur.tickets![1]?.flightInfo?.departure?.airport?.city?.name?.farsi;
          }
        }
        acc.passengers.push({
          firstName: cur.passenger?.firstname?.farsi,
          lastName: cur.passenger?.lastname?.farsi,
          passengerType: cur.passenger?.passengerType,
          price: cur.tickets![0]?.payment?.price,
          ageType: cur.passenger?.ageType,
          tickets: cur.tickets,
        });

        return acc;
      },
      { passengers: [] },
    );
    return orderItem;
  }, [isSuccess]);

  const [selectedTrip, setSelectedTrip] = useState<TRefundFlowStates>({
    flightId: '',
    orderId: '',
    refundReason: null,
    isDeparture: false,
    ticketIds: [],
  });

  const {
    mutate: getReasonMutate,
    data: getReasonData,
    isLoading: getReasonIsLoading,
  } = useMutation({
    mutationFn: () => getRefundReason(router.query.id as string, orderComputed.flightId!),
    onSuccess: () => {
      setStep('selectReason');
    },
  });

  if (isLoading) {
    return <div className="my-5 text-center">در حال بارگیری داده ها</div>;
  }
  return (
    <>
      {isSuccess && (
        <>
          {step === 'selectPath' && (
            <>
              <RefundSelectPath
                next={() => getReasonMutate()}
                selectedTrip={selectedTrip}
                setForDeparture={() => {
                  setSelectedTrip((old) => ({
                    ...old,
                    orderId: orderComputed.orderId,
                    flightId: orderComputed.flightId,
                    isDeparture: true,
                  }));
                }}
                setForReturning={() => {
                  setSelectedTrip((old) => ({
                    ...old,
                    orderId: orderComputed.orderId,
                    flightId: orderComputed.returnFlightId,
                    isDeparture: false,
                  }));
                }}
                isReturn={orderComputed.return as boolean}
                returnTicketId={orderComputed.returnTicketId}
                arival={orderComputed.arrivalCity || ''}
                departure={orderComputed.departureCity || ''}
                isLoading={getReasonIsLoading}
              />
            </>
          )}
          {step === 'selectReason' && (
            <>
              <RefundSelectReason
                reasons={getReasonData?.refundReasonItems}
                setStep={setStep}
                setSelectedTrip={setSelectedTrip}
                selectedTrip={selectedTrip}
              />
            </>
          )}
          {step === 'selectTicket' && (
            <>
              <RefundShowDetailsAndPassengers
                selectedTrip={selectedTrip}
                setSelectedTrip={setSelectedTrip}
                details={orderComputed}
                status={order?.status || ''}
                order={orderComputed!}
              />
            </>
          )}
        </>
      )}
    </>
  );
};
