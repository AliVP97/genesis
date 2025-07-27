import classNames from 'classnames';
import { PassengerType } from '../../types/api';
import formatPrice from '../utils/formatPrice';
import styles from './PassengerDetails.module.scss';

type PassengerDetailsProps = {
  count?: number;
  totalPrice?: number;
  passengerType?: PassengerType;
};

const FARE_BREAKDOWNS: Record<PassengerType, string> = {
  PASSENGER_TYPE_UNDEFINED: '',
  PASSENGER_TYPE_ADULT: 'بزرگسال',
  PASSENGER_TYPE_CHILD: 'کودک',
  PASSENGER_TYPE_INFANT: 'نوزاد',
};

const getPassengerTypeText = (passengerType: PassengerType | undefined) =>
  passengerType ? FARE_BREAKDOWNS[passengerType] : '';

const PassengerDetails = ({ count, totalPrice, passengerType }: PassengerDetailsProps) => {
  if (!totalPrice || !count) {
    return null;
  }

  const price = totalPrice * count;

  return (
    <div
      className={classNames('d-flex justify-content-between w-100', styles['passenger-details'])}
    >
      <span>
        {getPassengerTypeText(passengerType)}{' '}
        <span className={styles['count']}>({count} مسافر)</span>
      </span>
      <span>{formatPrice(price)}</span>
    </div>
  );
};

export default PassengerDetails;
