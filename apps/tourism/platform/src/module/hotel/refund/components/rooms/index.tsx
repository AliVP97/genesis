import React, { Dispatch, SetStateAction } from 'react';
import { TTrip, TTripsHotelRoom } from 'services/trips/types';
import RefundRoom from './components/refundRoom';
import dayjs from 'dayjs';
import styles from '../../refund.module.scss';
import cn from 'classnames';

type TRefundRoomsProps = {
  order?: TTrip;
  setSelectedRooms: Dispatch<SetStateAction<TTripsHotelRoom[]>>;
  selectedRooms: TTripsHotelRoom[];
};

const getHotelPassengerInfo = (order?: TTrip, roomId?: string) => {
  return `${
    order?.hotelDetail?.passengers?.find((x) => x.roomID === roomId)?.name
  } ${order?.hotelDetail?.passengers?.find((x) => x.roomID === roomId)?.family}`;
};

const RefundRooms = ({ order, setSelectedRooms, selectedRooms }: TRefundRoomsProps) => {
  return (
    <>
      <div className="rtl">
        <div className="p-3 pb-0 d-flex flex-column">
          <span>هتل {order?.hotelDetail?.hotelInfo?.name}</span>
          <span>لطفا اتاق خود را انتخاب کنید</span>
        </div>
        <div className={cn(styles['refund__modal__rooms'], 'px-3 py-3')}>
          {React.Children.toArray(
            order?.hotelDetail?.room?.map((item, index) => (
              <RefundRoom
                key={index.toString() + item?.roomId}
                room={item}
                enterDate={
                  dayjs(order?.hotelDetail?.checkDate?.checkIn)
                    .calendar('jalali')
                    .format('YYYY/MM/DD') || ''
                }
                exitDate={
                  dayjs(order?.hotelDetail?.checkDate?.checkOut)
                    .calendar('jalali')
                    .format('YYYY/MM/DD') || ''
                }
                fullName={getHotelPassengerInfo(order, item?.roomId)}
                selectedRooms={selectedRooms}
                setSelectedRooms={setSelectedRooms}
              />
            )),
          )}
        </div>
      </div>
    </>
  );
};

export default RefundRooms;
