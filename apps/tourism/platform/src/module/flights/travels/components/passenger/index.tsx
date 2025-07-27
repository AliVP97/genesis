import { Passenger } from 'assets/icons';
import cn from 'classnames';
import styles from '../../travels.module.scss';

type TravelPassengerProps = {
  children: React.ReactNode;
  departureCity?: string;
  arrivalCity?: string;
  title?: string;
  passengersCount: number;
};

const TravelPassenger = ({
  departureCity,
  arrivalCity,
  children,
  title,
  passengersCount,
}: TravelPassengerProps) => {
  return (
    <>
      <div className="d-md-none">
        <div className={cn(styles.Details__item, 'd-flex flex-column bg-color-surface mb-3 ')}>
          <div
            className={cn(
              styles.Details__item__header,
              'bg-color-surface-container text-3 px-3 py-2 text-weight-500 d-flex',
            )}
          >
            <div className="col-6">
              {' '}
              <Passenger />
              <span className="px-2 col-6 text-4">{`${departureCity} به ${arrivalCity}`}</span>
            </div>
            <div className="col-6 text-start">{passengersCount} مسافر </div>
          </div>
          <div className="d-flex flex-column p-3 text-3">{children}</div>
        </div>
      </div>
      <div className="d-none d-md-block">
        <div className={cn('d-flex flex-column bg-color-surface mb-3')}>
          <div className={cn(styles.Details__item__header, ' px-3 py-2 text-weight-500')}>
            <Passenger />
            {title ? (
              <span>{title}</span>
            ) : (
              <span className="px-2">{`${departureCity} به ${arrivalCity}`}</span>
            )}
          </div>
          <div className="d-flex flex-column p-3 text-3">{children}</div>
        </div>
      </div>
    </>
  );
};

export default TravelPassenger;
