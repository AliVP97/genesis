import { TGetHotelOrder } from 'services/hotel/orders/interface';

type TRoomsSummary = {
  [key: string]: {
    title: string;
    number: number;
    price: number;
  };
};

export const getRoomsSummary = (rooms: TGetHotelOrder['room']) =>
  Object.values(
    rooms?.reduce((acc, curr) => {
      const type = curr.roomInfo?.roomType || '';
      const title = curr.roomInfo?.name || type;
      const price = curr.priceDetail?.price?.totalPrice || 0;
      type &&
        (acc[type]
          ? (acc[type].number += 1)
          : (acc = {
              ...acc,
              [type]: { title, number: 1, price },
            }));
      return acc;
    }, {} as TRoomsSummary) || {},
  );
