import { useMutation } from 'react-query';
import { addPassengerV2 } from 'services/general/passenger';
import { TPassengerV2Payload } from 'services/general/passenger/interface';
import { notify } from 'utils/notification';

const UseAddPassenger = (getPassengers: () => void, onSuccessCallback?: () => void) => {
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
      onSuccessCallback && onSuccessCallback();
    },
    onError: (error: { response: { data: { message: string } } }) => {
      notify({
        type: 'error',
        message: error?.response?.data?.message,
      });
    },
  });

  return { addAddPassenger, isLoading, isSuccess };
};

export default UseAddPassenger;
