import { useMutation } from 'react-query';
import { ErrorResponse } from 'services/bus/tickets/interface';
import { addPassengerV2 } from 'services/general/passenger';
import { TPassengerV2Payload } from 'services/general/passenger/interface';
import { notify } from 'utils/notification';
import { useRouter } from 'next/router';

const UseAddPassenger = (getPassengers: () => void) => {
  const router = useRouter();
  const {
    mutate: addAddPassenger,
    isLoading: isLoading,
    isSuccess,
  } = useMutation({
    mutationFn: (passenger: TPassengerV2Payload) => {
      return addPassengerV2(passenger);
    },
    onSuccess: () => {
      getPassengers();
      router.query.selectedPassenger = 'true';
      router.push(router);
    },
    onError: (error) => {
      notify({
        type: 'error',
        message: (error as ErrorResponse)?.response?.data?.message,
      });
    },
  });

  return { addAddPassenger, isLoading, isSuccess };
};

export default UseAddPassenger;
