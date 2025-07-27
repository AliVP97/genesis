import cn from 'classnames';
import { TTrip } from 'services/trips/types';
import styles from '../../../../travels.module.scss';

type TripTrainDetailsProps = {
  details: TTrip;
};

export const TripTrainDetails = ({ details }: TripTrainDetailsProps) => {
  const trainDetails = details?.trainDetails?.trips![0];

  const hasReturn = details?.trainDetails!.trips!.length > 1;
  let returnTrainDetails = null;
  if (hasReturn) returnTrainDetails = details?.trainDetails?.trips![1];
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
        <th className="text-center">کد مرجع</th>
        <th className="text-center"> شرکت ریلی </th>
        <th className="text-center">تاریخ و ساعت حرکت</th>
        <th className="text-center">مبلغ کل</th>
        <th className={styles['travels-container__content__items__radius-left']} />
      </tr>

      <tr className="text-3 p-5 color-on-surface">
        <td className="text-center p-4">{`${trainDetails?.trainInfo?.originName} - ${trainDetails?.trainInfo?.destinationName}`}</td>
        <td className="text-center">{trainDetails?.trainInfo?.trackingId || '--'}</td>
        <td className="text-center">{trainDetails?.trainInfo?.companyName}</td>
        <td className="text-center">{`${trainDetails?.trainInfo?.departureFullDateString}`}</td>
        <td className="text-center">{`${Number(
          trainDetails?.tickets![0].price,
        )?.toLocaleString()} ریال`}</td>
      </tr>

      {hasReturn && (
        <>
          <tr className="text-3 p-5 color-on-surface">
            <td className="text-center p-4">{`${returnTrainDetails?.trainInfo?.originName} - ${returnTrainDetails?.trainInfo?.destinationName}`}</td>
            <td className="text-center">{returnTrainDetails?.trainInfo?.trackingId || '--'}</td>
            <td className="text-center">{returnTrainDetails?.trainInfo?.companyName}</td>
            <td className="text-center">{`${returnTrainDetails?.trainInfo?.departureFullDateString}`}</td>
            <td className="text-center">{`${Number(
              returnTrainDetails?.tickets![0].price,
            )?.toLocaleString()} ریال`}</td>
          </tr>
        </>
      )}
    </>
  );
};

export default TripTrainDetails;
