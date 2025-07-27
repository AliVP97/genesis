import cn from 'classnames';
import { TInternationalPassenger, TTrip, TTripsIntFlightTicket } from 'services/trips/types';
import { internationalTicketStatusConvertor } from '../../utilities';
import styles from '../../../../../travels.module.scss';

type TInternationalFlightPassenger = {
  passenger: TInternationalPassenger;
  tickets: Array<TTripsIntFlightTicket>;
  isReturn?: boolean;
  details: TTrip;
};

const InternationalFlightPassengerItem = ({
  passenger,
  tickets,
  isReturn,
}: TInternationalFlightPassenger) => {
  const ticketType = isReturn ? 'INTFLIGHT_TICKET_TYPE_RETURN' : 'INTFLIGHT_TICKET_TYPE_LEAVE';
  const ticket = tickets.find(
    (x) => ticketType === x.type && x.passengerId === passenger?.passengerId,
  );

  let statusClass = '';
  const statusText =
    internationalTicketStatusConvertor[ticket?.status || 'INTFLIGHT_TICKET_STATUS_UNDEFINED'];

  if (ticket?.status === 'INTFLIGHT_TICKET_STATUS_ISSUED') {
    statusClass = 'color-success';
  } else if (ticket?.status === 'INTFLIGHT_TICKET_STATUS_REFUNDED') {
    statusClass = 'color-error';
  }

  return (
    <>
      <div className="d-md-none">
        <div>
          <div className="d-flex justify-content-between">
            {ticket?.status !== 'INTFLIGHT_TICKET_STATUS_UNDEFINED' && (
              <small className={cn(statusClass)}>{statusText}</small>
            )}

            <h6 className="color-on-surface text-weight-500">
              {passenger.firstName?.english} {passenger.lastName?.english}
            </h6>
          </div>
          <div className="d-flex justify-content-between pt-2">
            <small className="color-on-surface">مبلغ بلیط:</small>
            <small>{ticket?.priceInfo?.price?.toLocaleString()} ریال</small>
          </div>
          {ticket?.status !== 'INTFLIGHT_TICKET_STATUS_UNDEFINED' && (
            <>
              <div className="d-flex justify-content-between pt-2">
                <small className="color-on-surface">مبلغ جریمه:</small>
                <small>{ticket?.refundInfo?.refundPenalty} ریال</small>
              </div>
              <div className="d-flex justify-content-between pt-2 color-primary">
                <small></small>
                <small>{ticket?.refundInfo?.refundedAmount} ریال</small>
              </div>
            </>
          )}
        </div>
        <div></div>
      </div>
      <div className="d-none d-md-block w-100">
        <table className="text-center w-100">
          <thead>
            <tr
              className={cn(
                styles['travels-container__content__items__font'],
                'bg-color-surface-container color-on-surface',
              )}
            >
              <th
                className={cn(
                  styles['travels-container__content__items__radius-right'],
                  'text-center py-3',
                )}
              >
                نام و نام خانوادگی
              </th>
              <th className="py-3"> وضعیت استرداد </th>
              <th> مبلغ بلیط</th>
              <th> مبلغ جریمه</th>
              <th> مبلغ استرداد شده به مسافر </th>
            </tr>
          </thead>
          <tbody className="bg-color-surface-container-low rounded-bottom">
            <tr className="color-on-surface-var">
              <td className="py-3">
                {passenger?.firstName?.english} {passenger?.lastName?.english}
              </td>
              <td>
                {ticket?.status !== 'INTFLIGHT_TICKET_STATUS_ISSUED' && (
                  <small
                    className={cn(
                      ticket?.status === 'INTFLIGHT_TICKET_STATUS_REFUNDED' ? 'color-green-1' : '',
                    )}
                  >
                    {
                      internationalTicketStatusConvertor[
                        ticket?.status ? ticket?.status : 'INTFLIGHT_TICKET_STATUS_UNDEFINED'
                      ]
                    }
                  </small>
                )}
              </td>
              <td>
                {' '}
                <small>{ticket?.priceInfo?.price} ریال</small>
              </td>
              <td>
                <small>{ticket?.refundInfo?.refundPenalty} ریال</small>
              </td>
              <td>
                <small>{ticket?.refundInfo?.refundedAmount} ریال</small>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </>
  );
};

export default InternationalFlightPassengerItem;
