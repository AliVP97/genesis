import cn from 'classnames';
import styles from './refundRoom.module.scss';
import {TIntHotelRoomPenalties} from './types';

type TRefundRoomProps = {
  room: TIntHotelRoomPenalties;
};

const RefundDetailsRoom = ({room}: TRefundRoomProps) => {
  return (
    <>
      <div className={cn(styles['refund-room'], 'mt-4')}>
        <div
          className={cn(
            styles['refund-room__header'],
            'px-3 p-2 d-flex justify-content-between',
          )}
        >
          <div className="d-flex align-items-center justify-content-between w-100">
            <div className="d-flex align-items-center">
              <span dir="auto" className={'color-grey-24'}>
                {room?.name || '-'}
              </span>
            </div>
          </div>
        </div>
        <div className="p-3 pt-0">
          <div className="d-flex justify-content-between pt-3">
            <span className="color-grey-19">ظرفیت اتاق</span>
            <span>{room?.capacity}</span>
          </div>
          <div className="d-flex justify-content-between pt-3">
            <span className="color-grey-19">نام سرپرست </span>
            <span>{room.leader}</span>
          </div>

          <div className="d-flex justify-content-between pt-3">
            <span className="color-grey-19">مبلغ رزرو</span>
            <span className="color-primary">
              {room?.totalAmount?.toLocaleString()} <small>ریال</small>
            </span>
          </div>
          <div className="d-flex justify-content-between pt-3">
            <span className="color-grey-19">مبلغ جریمه</span>
            <span className="color-primary">
              {room?.penaltyAmount?.toLocaleString()} <small>ریال</small>
            </span>
          </div>
          <div className="d-flex justify-content-between pt-3">
            <span className="color-grey-19">مبلغ قابل استرداد</span>
            <span className="color-primary">
              {room?.refundAmount?.toLocaleString()} <small>ریال</small>
            </span>
          </div>
        </div>
      </div>
    </>
  );
};

export default RefundDetailsRoom;
