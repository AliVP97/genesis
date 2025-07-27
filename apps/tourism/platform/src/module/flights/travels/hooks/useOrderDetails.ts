import { useState } from 'react';
import { useQuery } from 'react-query';
import { TTripTypes } from 'services/domestic/orders/interface';
import { getTrip } from 'services/trips/order';

const UseOrderDetails = () => {
  const [isEnable, setIsEnable] = useState<boolean>(false);
  const [orderId, setOrderId] = useState<string>();
  const [type, setType] = useState<TTripTypes>();
  const {
    data: order,
    isSuccess,
    isLoading,
  } = useQuery(['trip', type, orderId], getTrip, {
    enabled: isEnable,
  });

  const getOrderDetails = (orderDetailsId: string | undefined, typeDetails?: TTripTypes) => {
    setOrderId(orderDetailsId);
    setIsEnable(true);
    setType(typeDetails);
  };

  return {
    isLoading,
    order,
    isSuccess,
    getOrderDetails,
  };
};

export default UseOrderDetails;
