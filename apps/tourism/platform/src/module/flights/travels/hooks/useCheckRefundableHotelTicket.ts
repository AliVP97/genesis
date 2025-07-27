import { useQuery } from 'react-query';

import { getHotelRefundable } from 'services/hotel/refund';

const UseCheckRefundableHotelTicket = (orderId: string) => {
  const {
    data: hotelRefund,
    isSuccess,
    refetch,
    isLoading,
    isFetching,
  } = useQuery(['hotelRefund', orderId], getHotelRefundable, {
    enabled: false,
  });

  const checkRefund = () => {
    refetch();
  };

  return {
    isFetching,
    isLoading,
    hotelRefund,
    isSuccess,
    checkRefund,
  };
};

export default UseCheckRefundableHotelTicket;
