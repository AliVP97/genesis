import { useRouter } from 'next/router';
import { ParsedUrlQueryInput } from 'querystring';
import { useMutation } from 'react-query';
import { createOrder } from 'services/internationalFlight/order';
import { TCreateOrderPayload } from 'services/internationalFlight/order/interface';

export const useCreateOrder = () => {
  const router = useRouter();
  const { mutate: mutateCreateOrder, isLoading: isCreateOrderLoading } = useMutation({
    mutationFn: async (payload: TCreateOrderPayload) => {
      return createOrder(payload);
    },
    mutationKey: 'createOrder',
    onSuccess: (data, context) => {
      updateLocalStorage(data);
      const pathname = `/international/${data.orderId}/passengers/v3`;
      const query: ParsedUrlQueryInput = { requestId: context.requestId };
      router.push({ pathname, query }, undefined, { shallow: false });
    },
  });

  return { isCreateOrderLoading, mutateCreateOrder };
};

function updateLocalStorage(data: { orderId?: string }) {
  sessionStorage.setItem('intelFlight_ticket', JSON.stringify(data));
  localStorage.setItem('intelFlight-orderId', JSON.stringify(data.orderId));
}
