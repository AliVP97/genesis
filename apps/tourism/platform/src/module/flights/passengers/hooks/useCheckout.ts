import { useRouter } from 'next/router';
import { useMutation } from 'react-query';
import { ErrorResponse } from 'services/bus/tickets/interface';
import { flightAddPassengers } from 'services/domestic/flight';
import { TFlightAddPassengerPayload } from 'services/domestic/flight/interface';
import WEB from 'utils/routes/web';
import { notify } from 'utils/notification';

const UseCheckout = () => {
  const { push } = useRouter();
  const {
    mutate: mutateGetCheckout,
    isLoading,
    isSuccess,
  } = useMutation({
    mutationFn: (payload: TFlightAddPassengerPayload) => {
      return flightAddPassengers(payload);
    },
    onSuccess: (_, { orderId }) => {
      push({ pathname: `${WEB.DOMESTIC_SEARCH}checkout/${orderId}` }, undefined, {
        shallow: false,
      }).catch(() => {
        throw new Error('try it again');
      });
    },
    onError: (error) => {
      notify({
        type: 'error',
        message: (error as ErrorResponse)?.response?.data?.message,
      });
    },
  });

  return { mutateGetCheckout, isLoading, isSuccess };
};

export default UseCheckout;
