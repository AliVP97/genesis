import React from 'react';
import { TTripsHotelPassenger, TTripsHotelRoom } from 'services/trips/types';
import HotelDetailsHeader from './components/header';
import HotelPassengersInfo from './components/info';

import HotelPassengersInfoInDesktop from './components/desktopInfo';
import Divider from 'components/divider';

type HotelPassengerProps = {
  passengers: Array<TTripsHotelPassenger>;
  rooms: Array<TTripsHotelRoom>;
};

const HotelPassenger = ({ passengers, rooms }: HotelPassengerProps) => {
  const capacity = (room: TTripsHotelRoom): string | undefined => {
    const item = room?.roomInfo?.capacity;
    return item;
  };
  return (
    <>
      <div className="d-md-none">
        {React.Children.toArray(
          rooms.map((item) => {
            return (
              <HotelDetailsHeader
                key={item?.roomId}
                title={item?.roomInfo?.name || ''}
                refundStatus={item?.roomStatus || 'ROOM_STATUS_UNDEFINED'}
              >
                <HotelPassengersInfo
                  firstName={passengers.find((x) => x.roomID === item.roomId)?.name + ' ' || ''}
                  lastName={passengers.find((x) => x.roomID === item.roomId)?.family || ''}
                  capacity={capacity(item)}
                  price={item?.priceDetail?.price?.priceAfterDiscount}
                  refundStatus={item?.roomStatus || 'ROOM_STATUS_UNDEFINED'}
                  refundPrice={item?.priceDetail}
                />
              </HotelDetailsHeader>
            );
          }),
        )}
      </div>
      <div className="d-none d-md-block">
        {React.Children.toArray(
          rooms.map((item, index) => {
            return (
              <>
                <HotelPassengersInfoInDesktop
                  key={item?.roomId}
                  firstName={passengers.find((x) => x.roomID === item.roomId)?.name + ' ' || ''}
                  lastName={passengers.find((x) => x.roomID === item.roomId)?.family || ''}
                  capacity={capacity(item)}
                  price={item?.priceDetail?.price?.priceAfterDiscount}
                  refundStatus={item?.roomStatus || 'ROOM_STATUS_UNDEFINED'}
                  refundPrice={item?.priceDetail}
                  title={item?.roomInfo?.name || ''}
                />
                {index < rooms.length - 1 && <Divider className="my-4" type="horizontal" />}
              </>
            );
          }),
        )}
      </div>
    </>
  );
};

export default HotelPassenger;
