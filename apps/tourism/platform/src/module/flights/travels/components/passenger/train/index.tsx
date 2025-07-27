import cn from 'classnames';
import {
  getPassengerAgeType,
  getPassengerTripTotalPrice,
} from 'module/flights/travels/helper/travelHelper';

import { TTrainTickets } from 'services/trips/types';
import TravelPassenger from '..';
import styles from '../../../travels.module.scss';
type TrainPassengerProps = {
  arrivalCity?: string;
  departureCity?: string;
  tickets: TTrainTickets;
};

const TrainPassenger = ({ tickets, departureCity, arrivalCity }: TrainPassengerProps) => {
  return (
    <>
      <div className="d-md-none">
        <TravelPassenger
          arrivalCity={arrivalCity}
          departureCity={departureCity}
          passengersCount={tickets.length}
        >
          {tickets?.map((ticket, index) => {
            return (
              <div
                key={index.toString() + ticket?.id}
                className={cn(
                  'py-3',
                  tickets?.length - 1 !== index ? 'border-bottom border-outline-var ' : '',
                )}
              >
                <div className="d-flex justify-content-between">
                  <div>
                    <span className="text-weight-500 text-4">
                      {ticket?.passenger?.firstName} {ticket?.passenger?.lastName}
                    </span>
                  </div>
                </div>

                <div className="mt-3 d-flex justify-content-between align-item-center color-on-surface">
                  <div>مبلغ بلیط:</div>
                  <div>{getPassengerTripTotalPrice(ticket)} ریال</div>
                </div>
              </div>
            );
          })}
        </TravelPassenger>
      </div>

      <div className="d-none d-md-block">
        <TravelPassenger
          arrivalCity={arrivalCity}
          departureCity={departureCity}
          passengersCount={tickets.length}
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
                <th className={styles['travels-container__content__items__radius-left']}>
                  مبلغ بلیط
                </th>
              </tr>
            </thead>
            <tbody className="bg-color-surface-container-low rounded-bottom">
              {tickets?.map((ticket, index) => (
                <tr key={index.toString() + ticket?.id + 'train'} className="color-on-surface-var">
                  <td className="py-3">
                    {
                      <span className="color-on-surface-var">
                        {ticket?.passenger?.firstName} {ticket?.passenger?.lastName}
                      </span>
                    }
                  </td>
                  <td>
                    {ticket?.passenger?.genderType &&
                      getPassengerAgeType(ticket?.passenger?.genderType)}
                  </td>
                  <td>
                    <div>{getPassengerTripTotalPrice(ticket)} ریال</div>
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

export default TrainPassenger;
