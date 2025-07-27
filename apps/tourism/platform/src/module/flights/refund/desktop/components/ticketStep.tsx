import React from 'react';
import cn from 'classnames';
import styles from '../../refund.module.scss';
import { TTicketsStepProps } from '../types';
import Checkbox from 'components/checkbox';
import { StatusColor } from '../../utils/statusColors';
import { TicketStatusFa } from '../..';
import RefundOrderDetails from './refundOrderDetails';
import { Passenger } from 'assets/icons';
import RefundImpossibleWarning from './refundImpossibleWarning';
import { ITripPassenger } from 'module/flights/travels/interface';

export const TicketStep: React.FunctionComponent<TTicketsStepProps> = ({
  order,
  selectedDepartureIata,
  selectedTickets,
  setSelectedTickets,
}) => {
  const way = selectedDepartureIata.isReturn ? 1 : 0;
  const data = order
    .passengers!.map((passenger) => {
      const matchingTickets = passenger.tickets?.map((ticket) => {
        if (ticket.flightInfo?.departure?.airport?.iata === selectedDepartureIata.iata) {
          return { ...passenger, ticket };
        }
      });

      const validTickets = matchingTickets?.filter((ticket) => ticket);
      return validTickets?.[0];
    })
    .filter((result) => result);

  const handlePassengerCheckboxClick = (passenger: ITripPassenger) => {
    if (
      [passenger?.tickets?.[way]?.status, passenger?.tickets?.[way]?.status].includes(
        passenger?.tickets?.[way]?.status,
      )
    ) {
      setSelectedTickets((prevTickets) => {
        const currentTicket = passenger?.ticket?.ticketId;
        const ticketIsSelected = prevTickets.includes(currentTicket as string);
        let newTickets: string[];

        if (ticketIsSelected) {
          newTickets = prevTickets.filter((ticket) => ticket !== currentTicket);
        } else {
          newTickets = currentTicket ? [...prevTickets, currentTicket] : prevTickets;
        }

        return newTickets;
      });
    }
  };

  return (
    <>
      {!data.some((x) => x?.ticket.status == 'TICKETSTATUS_ISSUED') ? (
        <div className="d-md-none">
          <RefundImpossibleWarning />
        </div>
      ) : null}

      <div className="rtl px-md-4">
        <RefundOrderDetails order={order} selectedDepartureIata={selectedDepartureIata} />

        <p className="pt-3 d-none d-md-block">لطفا مسافر مورد نظر را انتخاب نمایید</p>

        <div className="d-md-none w-100 card border-0 shadow-sm mt-3">
          <div
            className={cn('bg-color-surface-container d-flex w-100 py-3 rounded-top text-end px-3')}
          >
            <div className="col-6">
              <Passenger />
              <b className="pe-2">مسافران </b>
            </div>
            <div className="col-6 text-start">{order.passengers?.length} مسافر</div>
          </div>
          <div className="py-2">
            {data.map((passenger) => {
              return (
                <React.Fragment key={passenger?.firstName}>
                  {passenger && (
                    <div
                      key={passenger!.firstName}
                      className="d-flex justify-content-between py-2 p-3 color-on-surface align-items-center"
                    >
                      <span
                        className="text-center d-flex justify-content-center align-items-center py-3"
                        onClick={() => {
                          handlePassengerCheckboxClick(passenger);
                        }}
                      >
                        <Checkbox
                          disabled={passenger?.tickets?.[way]?.status !== 'TICKETSTATUS_ISSUED'}
                          checked={
                            (passenger?.ticket.status !== 'TICKETSTATUS_ISSUED' &&
                              passenger?.ticket.status !== 'TICKETSTATUS_UNDEFINED') ||
                            selectedTickets.some(
                              (ticket) => ticket === passenger?.tickets?.[way]?.ticketId,
                            )
                          }
                        />
                        {passenger.firstName} {passenger.lastName}
                      </span>

                      <span className="text-center">
                        {StatusColor(passenger?.ticket.status as keyof typeof TicketStatusFa)}
                      </span>
                    </div>
                  )}
                </React.Fragment>
              );
            })}
          </div>
        </div>

        <div className="d-none d-md-block">
          <table
            className={cn(
              styles['refund__modal__table'],
              'bg-color-surface-container-low w-100 my-2',
            )}
          >
            <tr
              className={cn(
                styles['refund__modal__table__items__font'],
                'bg-color-surface-container color-on-surface w-100',
              )}
            >
              <th
                className={cn(
                  styles['refund__modal__table__items__radius-right'],
                  'text-center py-4',
                )}
              >
                <span></span>
              </th>
              <th className="text-center">نام و نام خانوادگی</th>
              <th className="text-center">وضعیت استرداد</th>
              <th className={styles['refund__modal__table__items__radius-left']}></th>
            </tr>
            {data
              .filter((passenger) => passenger)
              .map((passenger) => {
                return (
                  <React.Fragment key={passenger?.firstName}>
                    {passenger && (
                      <tr key={passenger!.firstName}>
                        <td
                          className="text-center d-flex justify-content-center align-items-center py-3"
                          onClick={() => {
                            handlePassengerCheckboxClick(passenger);
                          }}
                        >
                          <Checkbox
                            disabled={
                              passenger?.tickets?.[way]?.status !== 'TICKETSTATUS_ISSUED' &&
                              passenger?.tickets?.[way]?.status !== 'TICKETSTATUS_REFUND_REJECTED'
                            }
                            checked={
                              (passenger?.ticket.status !== 'TICKETSTATUS_ISSUED' &&
                                passenger?.ticket.status !== 'TICKETSTATUS_UNDEFINED' &&
                                passenger?.tickets?.[way]?.status !==
                                  'TICKETSTATUS_REFUND_REJECTED') ||
                              selectedTickets.some(
                                (ticket) => ticket === passenger?.tickets?.[way]?.ticketId,
                              )
                            }
                          />
                        </td>
                        <td className="text-center">
                          {passenger.firstName} {passenger.lastName}
                        </td>

                        <td className="text-center">
                          {StatusColor(passenger?.ticket.status as keyof typeof TicketStatusFa)}
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                );
              })}
          </table>
        </div>
      </div>
    </>
  );
};
