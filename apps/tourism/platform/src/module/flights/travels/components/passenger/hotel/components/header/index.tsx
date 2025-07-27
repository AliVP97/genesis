import { DoubleBed } from 'assets/icons';
import cn from 'classnames';
import styles from '../../../../../travels.module.scss';
import { TTripsRoomStatus } from 'services/trips/types';

type THotelDetailsHeaderProps = {
  title: string;
  children?: React.ReactNode;
  refundStatus: TTripsRoomStatus;
};

const HotelDetailsHeader = ({ title, children, refundStatus }: THotelDetailsHeaderProps) => {
  let statusText = '';
  let statusClass = '';

  if (refundStatus === 'ROOM_STATUS_REFUND_ACCEPTED') {
    statusText = 'استرداد شده';
    statusClass = 'color-green-1';
  } else if (refundStatus === 'ROOM_STATUS_REFUND_REJECTED') {
    statusText = 'رد شده';
    statusClass = 'color-red';
  } else if (refundStatus === 'ROOM_STATUS_REFUND_REQUESTED') {
    statusText = 'درخواست استرداد';
    statusClass = 'color-grey-24';
  }
  return (
    <div className={cn(styles['Details__item'], 'd-flex flex-column mb-3 bg-color-surface-saj')}>
      <div
        className={cn(
          styles['Details__item__header'],
          'bg-color-surface-container px-3 py-2 text-weight-500 d-flex justify-content-between text-2',
        )}
      >
        <span className="px-2">
          <DoubleBed /> {title}
        </span>
        {statusText && <span className={statusClass}>{statusText}</span>}
      </div>
      {children}
    </div>
  );
};

export default HotelDetailsHeader;
