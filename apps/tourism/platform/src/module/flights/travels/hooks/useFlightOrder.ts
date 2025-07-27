import { useState } from 'react';
import { useQuery } from 'react-query';
import { getOrder } from 'services/domestic/flight';

const UseFlightOrder = () => {
  const [isEnable, setIsEnable] = useState<boolean>(false);
  const [orderId, setOrderId] = useState<string>();
  const {
    data: flightOrder,
    isSuccess,
    isLoading,
  } = useQuery(['order', orderId], getOrder, {
    enabled: isEnable,
    onSuccess: () => setIsEnable(false),
  });

  const getFlightOrder = (flightOrderId: string | undefined) => {
    setOrderId(flightOrderId);
    setIsEnable(true);
  };

  return {
    isLoading,
    flightOrder,
    isSuccess,
    getFlightOrder,
  };
};

export default UseFlightOrder;
