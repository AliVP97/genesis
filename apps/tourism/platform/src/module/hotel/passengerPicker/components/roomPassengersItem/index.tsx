import { DecreasePrimaryIcon, MinusCircleGrayIcon, IncreseCirclePrimary } from 'assets/icons';

import styles from './roomPassengersitem.module.scss';

type TRoomPassengersItemProps = {
  title: string;
  description: string;
  count: number;
  increase?: () => void;
  decrease?: () => void;
  allowedMinimum?: number;
};
const RoomPassengersItem = ({
  title,
  description,
  count,
  increase,
  decrease,
  allowedMinimum = 0,
}: TRoomPassengersItemProps) => {
  return (
    <div className="d-flex justify-content-between pt-3 pb-2 px-0 mw-100">
      <span className={styles['room_passengers_item-title']}>
        {title}
        <small className={styles['room_passengers_item-desc']}>{description}</small>
      </span>
      <div className="d-flex justify-content-between align-items-center">
        <IncreseCirclePrimary onClick={increase} />
        <div className={styles['room_passengers_item-count']}>{count}</div>
        {count >= allowedMinimum ? (
          <DecreasePrimaryIcon onClick={decrease} />
        ) : (
          <MinusCircleGrayIcon />
        )}
      </div>
    </div>
  );
};

export default RoomPassengersItem;
