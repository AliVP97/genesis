import cn from 'classnames';
import styles from './refundRoom.module.scss';
import Checkbox from 'components/checkbox';
import { Dispatch, SetStateAction } from 'react';
import { TTripsHotelRoom } from 'services/trips/types';

type TRefundRoomProps = {
  room: TTripsHotelRoom;
  setSelectedRooms: Dispatch<SetStateAction<TTripsHotelRoom[]>>;
  selectedRooms: TTripsHotelRoom[];
  fullName: string;
  enterDate: string;
  exitDate: string;
};

const RefundRoom = ({
  room,
  fullName,
  selectedRooms,
  setSelectedRooms,
  exitDate,
  enterDate,
}: TRefundRoomProps) => {
  const canRefund =
    room?.roomStatus === 'ROOM_STATUS_REFUND_ACCEPTED' ||
    room?.roomStatus === 'ROOM_STATUS_REFUND_REJECTED' ||
    room?.roomStatus === 'ROOM_STATUS_RESERVED' ||
    room?.roomStatus === 'ROOM_STATUS_REFUND_REQUESTED';
  const select = () => {
    const find = selectedRooms.find((x) => x.roomId === room?.roomId);
    if (find) {
      setSelectedRooms(selectedRooms.filter((x) => x.roomId != room?.roomId));
      return;
    }
    setSelectedRooms((prev) => [...prev, room]);
  };

  return (
    <>
      <div className={cn(styles['refund-room'], 'mt-4')}>
        <div
          className={cn(styles['refund-room__header'], 'px-3 p-2 d-flex justify-content-between')}
        >
          <div className="d-flex align-items-center justify-content-between w-100">
            <div className="d-flex align-items-center">
              <Checkbox
                disabled={canRefund || !room?.refundable}
                checked={selectedRooms?.some((x) => x.roomId === room.roomId) || canRefund}
                handleClick={select}
              />
              <span
                className={canRefund ? 'color-grey-24' : ''}
                onClick={() => (!canRefund ? select() : null)}
                dir="auto"
              >
                {room?.roomInfo?.name || '-'}
              </span>
            </div>
            {room?.roomStatus === 'ROOM_STATUS_REFUND_ACCEPTED' ? (
              <div className="text-2" style={{ color: '#27B67C' }}>
                استراد شده
              </div>
            ) : room?.roomStatus === 'ROOM_STATUS_REFUND_REJECTED' ? (
              <div className="color-red text-2">لغوشده</div>
            ) : room?.roomStatus === 'ROOM_STATUS_REFUND_REQUESTED' ? (
              <div className="color-grey-1 text-2">درخواست استرداد</div>
            ) : !room?.refundable ? (
              <div className="color-red text-2">غیرقابل استرداد</div>
            ) : null}
          </div>
          <span>
            {room?.roomStatus === 'ROOM_STATUS_REFUND_ACCEPTED' ? (
              <span className="color-green-1">استرداد شده</span>
            ) : room?.roomStatus === 'ROOM_STATUS_REFUND_REJECTED' ? (
              <span className="color-green-1"> رد شده </span>
            ) : (
              ''
            )}
          </span>
        </div>
        <div className="p-3 pt-0">
          <div className="d-flex justify-content-between pt-3">
            <span className="color-grey-19">ظرفیت اتاق</span>
            <span>{room?.roomInfo?.capacity}</span>
          </div>
          <div className="d-flex justify-content-between pt-3">
            <span className="color-grey-19">نام سرپرست </span>
            <span>{fullName}</span>
          </div>
          <div className="d-flex justify-content-between pt-3">
            <span className="color-grey-19">تاریخ ورود </span>
            <span>{enterDate}</span>
          </div>
          <div className="d-flex justify-content-between pt-3">
            <span className="color-grey-19">تاریخ خروج </span>
            <span>{exitDate}</span>
          </div>
          <div className="d-flex justify-content-between pt-3">
            <span className="color-grey-19">مبلغ رزرو </span>
            <span className="color-primary">
              {room?.priceDetail?.price?.totalPrice?.toLocaleString()} <small>ریال</small>
            </span>
          </div>
        </div>
      </div>
    </>
  );
};

export default RefundRoom;
