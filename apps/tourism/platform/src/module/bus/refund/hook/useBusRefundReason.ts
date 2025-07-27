import { useQuery } from 'react-query';
import { busGetRefundReason } from 'services/bus/refund';

const UseBusRefundReason = (orderId: string) => {
  const {
    data: busRefundReasons,
    isSuccess,
    isLoading,
  } = useQuery(['orderBusRefund', orderId], busGetRefundReason);

  return {
    isLoading,
    busRefundReasons,
    isSuccess,
  };
};

export default UseBusRefundReason;
