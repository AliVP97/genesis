import { TCreateOrderPayload } from 'services/hotel/orders/interface';
import { useMutation } from 'react-query';
import { createOrder } from 'services/hotel/orders';
import { useRouter } from 'next/router';
import { notify } from 'utils/notification';
export const useAddRooms = () => {
  const router = useRouter();
  const {
    data: createOrderData,
    isLoading: createOrderIsLoading,
    mutate: createHotelOrder,
  } = useMutation({
    mutationFn: async (orderInfo: TCreateOrderPayload) => {
      return createOrder(orderInfo);
    },
    mutationKey: 'createHotelOrder',
    onSuccess: (res, ctx) => {
      router.push(
        `/hotel/passengers?orderId=${res?.orderId}&nights=${ctx.nights}&rooms=${router.query.rooms}`,
      );
    },
    onError: (error: { response: { data: { message: string } } }) => {
      notify({
        type: 'error',
        message: error?.response?.data?.message || 'مشکلی پیش آمده است',
      });
    },
  });
  return {
    createHotelOrder,
    createOrderData,
    createOrderIsLoading,
  };
};
