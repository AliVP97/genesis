import cn from 'classnames';
import {
  getFlightTicketStatus,
  getPassengerAgeType,
} from 'module/flights/travels/helper/travelHelper';
import { TFlightTripPassengers } from 'services/trips/types';
import TravelPassenger from '..';
import styles from '../../../travels.module.scss';

type DomesticFlightPassengerProps = {
  arrivalCity?: string;
  departureCity?: string;
  passengers: TFlightTripPassengers;
  isReturn?: boolean;
};

const ticketStatusClass = (passengerStatus: string) => {
  switch (passengerStatus) {
    case 'TICKETSTATUS_ISSUED':
    case 'TICKETSTATUS_REFUND_CONFIRMED':
    case 'TICKETSTATUS_REFUND_DONE':
      return 'text-success';
    case 'TICKETSTATUS_REFUND_FAILED':
      return 'text-danger';
    default:
      return '';
  }
};

const DomesticFlightPassenger = ({
  passengers,
  isReturn,
  departureCity,
  arrivalCity,
}: DomesticFlightPassengerProps) => {
  const ticketIndex = isReturn ? 1 : 0;

  return (
    <>
      <div className="d-md-none">
        <TravelPassenger
          arrivalCity={arrivalCity}
          departureCity={departureCity}
          passengersCount={passengers.length}
        >
          {passengers?.map((passenger, index) => {
            return (
              <div
                key={
                  index.toString() +
                  passenger?.passengerID +
                  passenger?.nationalCode +
                  'flight-passengers'
                }
                className={cn(
                  'py-3',
                  passengers!.length - 1 !== index ? 'border-bottom border-outline-var ' : '',
                )}
              >
                <div className="d-flex justify-content-between">
                  <div>
                    <span className="text-weight-500 text-4">
                      {passenger.firstname?.farsi} {passenger.lastname?.farsi}
                    </span>
                  </div>
                  <div>
                    <span
                      className={cn(
                        ticketStatusClass(passenger.tickets![ticketIndex].status as string),
                      )}
                    >
                      {getFlightTicketStatus(passenger.tickets![ticketIndex].status!)}
                    </span>
                  </div>
                </div>

                <div className="mt-3 d-flex justify-content-between align-item-center color-on-surface">
                  <div>مبلغ پرداختی:</div>
                  <div>
                    {Number(passenger.tickets![ticketIndex].payment?.totalPrice).toLocaleString(
                      'fa-IR',
                    )}{' '}
                    ریال
                  </div>
                </div>

                {passenger.tickets &&
                  (passenger.tickets[ticketIndex].status === 'TICKETSTATUS_REFUND_DONE' ||
                    passenger.tickets[ticketIndex].status === 'TICKETSTATUS_REFUND_CONFIRMED') && (
                    <>
                      <div className="mt-3 d-flex justify-content-between align-item-center color-on-surface">
                        <div> مبلغ جریمه: </div>
                        <div>
                          <span>
                            {Number(passenger.tickets[ticketIndex].refundPenalty).toLocaleString(
                              'fa-IR',
                            )}{' '}
                            ریال
                          </span>
                        </div>
                      </div>
                      <div className="mt-3 d-flex justify-content-between align-item-center color-on-surface">
                        <div>
                          <span className="color-primary">مبلغ استرداد شده به مسافر: </span>
                        </div>
                        <div>
                          <span className="color-primary d-flex text-start">
                            {Number(passenger.tickets[ticketIndex].refundAmount).toLocaleString(
                              'fa-IR',
                            )}{' '}
                            ریال
                          </span>
                        </div>
                      </div>
                    </>
                  )}
              </div>
            );
          })}
        </TravelPassenger>
      </div>

      <div className="d-none d-md-block">
        <TravelPassenger
          arrivalCity={arrivalCity}
          departureCity={departureCity}
          passengersCount={passengers.length}
        >
          <table className="text-center">
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
                <th className="py-3">نوع مسافر</th>
                <th className="py-3">مبلغ پرداختی</th>
                <th className="py-3">وضعیت استرداد</th>
                <th className="py-3">مبلغ جریمه</th>
                <th className={styles['travels-container__content__items__radius-left']}>
                  مبلغ استرداد
                </th>
              </tr>
            </thead>
            <tbody className="bg-color-surface-container-low color-on-surface-var rounded-bottom">
              {passengers?.map((passenger, index) => (
                <tr
                  key={
                    index.toString() +
                    passenger?.nationalCode +
                    passenger?.passengerID +
                    'flights-passengers'
                  }
                >
                  <td className="py-4">
                    {
                      <span className="colors-grey-3">
                        {passenger.firstname?.farsi} {passenger.lastname?.farsi}
                      </span>
                    }
                  </td>
                  <td>{getPassengerAgeType(passenger.ageType!)}</td>
                  <td>
                    {Number(passenger.tickets![ticketIndex].payment?.totalPrice).toLocaleString(
                      'fa-IR',
                    )}{' '}
                    ریال
                  </td>
                  <td>
                    <span
                      className={cn(
                        ticketStatusClass(passenger.tickets![ticketIndex].status as string),
                      )}
                    >
                      {getFlightTicketStatus(passenger.tickets![ticketIndex].status!)}
                    </span>
                  </td>
                  <td>
                    {passenger.tickets &&
                    (passenger.tickets[ticketIndex].status === 'TICKETSTATUS_REFUND_DONE' ||
                      passenger.tickets[ticketIndex].status === 'TICKETSTATUS_REFUND_CONFIRMED') ? (
                      <>
                        {Number(passenger.tickets[ticketIndex].refundPenalty).toLocaleString(
                          'fa-IR',
                        )}{' '}
                        ریال
                      </>
                    ) : (
                      '-'
                    )}
                  </td>
                  <td>
                    {passenger.tickets &&
                    (passenger.tickets[ticketIndex].status === 'TICKETSTATUS_REFUND_DONE' ||
                      passenger.tickets[ticketIndex].status === 'TICKETSTATUS_REFUND_CONFIRMED') ? (
                      <>
                        <span className="text-primary">
                          {Number(passenger.tickets[ticketIndex].refundAmount).toLocaleString(
                            'fa-IR',
                          )}{' '}
                          ریال
                        </span>
                      </>
                    ) : (
                      '-'
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </TravelPassenger>
      </div>
    </>
  );
};

export default DomesticFlightPassenger;
