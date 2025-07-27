import {useMutation} from 'react-query';
import {hotelRefund, internationalHotelRefund} from 'services/hotel/refund';

const UseRefundHotel = () => {
  const {
    mutate: refundHotel,
    isLoading,
    isSuccess,
  } = useMutation({
    mutationFn: ({ orderId, rooms }: { orderId: string; rooms: Array<string | undefined> }) => {
      return hotelRefund(orderId, rooms);
    },
  });

  return { refundHotel, isLoading, isSuccess };
};

const UseInternationalRefundHotel = () => {
  const {
    mutate: internationalRefundHotel,
    data: internationalHotelRefundData,
    isLoading: internationalHotelRefundLoading,
    isSuccess,
  } = useMutation({
    mutationFn: ({
      orderId,
      rooms,
    }: {
      orderId: string;
      rooms: Array<string | undefined>;
    }) => {
      return internationalHotelRefund(orderId, rooms);
    },
  });
  return {
    internationalRefundHotel,
    internationalHotelRefundData,
    internationalHotelRefundLoading,
    isSuccess,
  };
};

export {UseRefundHotel, UseInternationalRefundHotel};
