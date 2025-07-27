import { useMutation } from 'react-query';
import { createDomesticOrder } from 'services/domestic/orders';
import { TFlightCreateOrderPayload } from 'services/domestic/orders/interface';

const useFlightCreateOrder = () => {
  const {
    mutate: createOrderMutate,
    data: createOrderData,
    isSuccess,
    isLoading,
  } = useMutation({
    mutationFn: async (payload: TFlightCreateOrderPayload) => {
      return createDomesticOrder(payload);
    },
  });

  return {
    createOrderMutate,
    createOrderData,
    isLoading,
    isSuccess,
  };
};

export default useFlightCreateOrder;
