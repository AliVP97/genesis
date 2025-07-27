import { useState } from 'react';

import { useOrder } from 'module/bus/hooks';

const UseBusOrder = () => {
  const [enabled, setEnabled] = useState<boolean>(false);
  const [orderId, setOrderId] = useState<string>();

  const { data: busOrder, isSuccess, isLoading } = useOrder(orderId, { enabled });

  const getBusOrder = (busOrderId: string | undefined) => {
    setOrderId(busOrderId);
    setEnabled(true);
  };

  return {
    isLoading,
    busOrder,
    isSuccess,
    getBusOrder,
  };
};

export default UseBusOrder;
