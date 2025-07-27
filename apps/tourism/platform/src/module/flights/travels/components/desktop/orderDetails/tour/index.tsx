import cn from 'classnames';
import { TTrip } from 'services/trips/types';
import styles from '../../../../travels.module.scss';
import { FC } from 'react';

type TripTourDetailsProps = {
  tourDetails: TTrip['tourDetail'];
};

export const TripTourDetails: FC<TripTourDetailsProps> = ({ tourDetails }) => {
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
          مسیر / مقصد
        </th>
        <th className="text-center">شماره سفارش</th>
        <th className="text-center">نام تور</th>
        <th className="text-center">نام هتل</th>
        <th className="text-center"> تاریخ ورود </th>
        <th className="text-center"> تاریخ خروج </th>
        <th className="text-center">مبلغ کل</th>
        <th className={styles['travels-container__content__items__radius-left']} />
      </tr>

      <tr className="text-3 p-5 color-on-surface">
        <td className="text-center p-4">{`${tourDetails?.cityName || '--'}`}</td>
        <td className="text-center">{tourDetails?.rrn || '--'}</td>
        <td className="text-center">{tourDetails?.tourName || '--'}</td>
        <td className="text-center">{tourDetails?.hotelName || '--'}</td>
        <td className="text-center">{tourDetails?.fromDate}</td>
        <td className="text-center">{tourDetails?.toDate}</td>
        <td className="text-center">
          <b className="color-primary">{Number(tourDetails?.price)?.toLocaleString()}</b>{' '}
          <small>ریال</small>
        </td>
      </tr>
    </>
  );
};

export default TripTourDetails;
