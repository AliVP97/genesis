import cn from 'classnames';
import styles from '../../../travels.module.scss';
import TripType from './types/TripType';

interface TripsTableHeaderProps {
  tripType: TripType;
}

function getOrderTimeStringTitle(tripType: TripType) {
  if (tripType === 'TRIPTYPE_INTERNATIONAL_FLIGHT') {
    return 'مسیر';
  }

  return 'مسیر / مقصد';
}

const TripsTableHeader = ({ tripType }: TripsTableHeaderProps) => {
  return (
    <>
      <tr
        className={cn(
          styles['travels-container__content__items__font'],
          'bg-color-surface-container color-on-surface-var',
        )}
      >
        <th
          className={cn(
            styles['travels-container__content__items__radius-right'],
            'text-center p-3',
          )}
        >
          شماره سفارش
        </th>
        <th className="text-center">نوع‌ سفارش</th>
        <th className="text-center">تاریخ و ساعت سفارش</th>
        <th className="text-center">{getOrderTimeStringTitle(tripType)}</th>
        <th className="text-center">مبلغ پرداختی</th>
        <th />
        <th />
        <th />
        <th className={styles['travels-container__content__items__radius-left']} />
      </tr>
    </>
  );
};

export default TripsTableHeader;
