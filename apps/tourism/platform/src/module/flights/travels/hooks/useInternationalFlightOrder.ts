import { useState } from 'react';
import { useQuery } from 'react-query';
import { getOrder } from 'services/internationalFlight/order';

const useInternationalFlightOrder = () => {
  const [isEnable, setIsEnable] = useState<boolean>(false);
  const [orderId, setOrderId] = useState<string>();

  const {
    data: internationalFlightOrder,
    isSuccess,
    isLoading,
  } = useQuery(['order', orderId], getOrder, {
    enabled: isEnable,
  });

  const getInternationalFlightOrder = (internationalFlightOrderId: string | undefined) => {
    setOrderId(internationalFlightOrderId);
    setIsEnable(true);
  };

  return {
    isLoading,
    internationalFlightOrder,
    isSuccess,
    getInternationalFlightOrder,
  };
};

export default useInternationalFlightOrder;
