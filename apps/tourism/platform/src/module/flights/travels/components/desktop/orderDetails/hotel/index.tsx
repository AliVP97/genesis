import cn from 'classnames';
import { TTrip } from 'services/trips/types';
import styles from '../../../../travels.module.scss';
import dayjs from 'dayjs';

type TripHotelDetailsProps = {
  details: TTrip;
};

export const TripHotelDetails = ({ details }: TripHotelDetailsProps) => {
  const hotelDetails = details?.hotelDetail;

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
          شهر و استان
        </th>
        <th className="text-center"> نام هتل </th>
        <th className="text-center"> شماره رزرو </th>
        <th className="text-center"> تاریخ ورود </th>
        <th className="text-center"> تاریخ خروج </th>
        <th className="text-center">مبلغ کل</th>
        <th className={styles['travels-container__content__items__radius-left']} />
      </tr>

      <tr className="text-3 p-5 color-on-surface">
        <td className="text-center p-4">{`${hotelDetails?.hotelInfo?.city?.province} - ${hotelDetails?.hotelInfo?.city?.name}`}</td>
        <td className="text-center">{hotelDetails?.hotelInfo?.name || '--'}</td>
        <td className="text-center">{hotelDetails?.orderNumber || '--'}</td>
        <td className="text-center">
          {dayjs(hotelDetails?.checkDate?.checkIn).calendar('jalali').format('YYYY/MM/DD')}
        </td>
        <td className="text-center">
          {dayjs(hotelDetails?.checkDate?.checkOut).calendar('jalali').format('YYYY/MM/DD')}
        </td>
        <td className="text-center">
          <b className="color-primary">
            {Number(hotelDetails?.payment?.totalPrice)?.toLocaleString()}
          </b>{' '}
          <small>ریال</small>
        </td>
      </tr>
    </>
  );
};

export default TripHotelDetails;
