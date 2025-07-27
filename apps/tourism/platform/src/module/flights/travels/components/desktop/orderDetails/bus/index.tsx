import cn from 'classnames';
import { getDateTimeDetails } from 'module/flights/travels/helper/travelHelper';
import { TTrip } from 'services/trips/types';

import styles from '../../../../travels.module.scss';
type TripBusDetailsProps = {
  details: TTrip;
};

export const TripBusDetails = ({ details }: TripBusDetailsProps) => {
  const busDetails = details?.busDetails;

  const { date: departureCalender } = getDateTimeDetails(busDetails?.busInfo?.departureDate);

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
          مسیر
        </th>
        <th className="text-center"> شماره خرید </th>
        <th className="text-center"> شماره بلیط </th>
        <th className="text-center"> تعاونی </th>
        <th className="text-center">تاریخ و ساعت حرکت</th>
        <th className="text-center">مبلغ کل</th>
        <th className={styles['travels-container__content__items__radius-left']} />
      </tr>

      <tr className="text-3 p-5 color-on-surface">
        <td className="text-center p-4">
          {(busDetails?.busInfo?.originCity || busDetails?.busInfo?.originStation) +
            ' - ' +
            (busDetails?.busInfo?.destinationCity || busDetails?.busInfo?.destinationStation)}
        </td>
        <td className="text-center en">{busDetails?.ticket?.SaleId || '--'}</td>
        <td className="text-center">{busDetails?.ticket?.TicketNumber || '--'}</td>
        <td className="text-center">{busDetails?.busInfo?.companyName}</td>
        <td className="text-center">{`${busDetails?.busInfo?.departureDateHourString} - ${departureCalender}`}</td>
        <td className="text-center">{`${Number(
          busDetails?.totalPrice,
        )?.toLocaleString()} ریال`}</td>
      </tr>
    </>
  );
};

export default TripBusDetails;
