import { useMutation } from 'react-query';
import { editPassengerV2 } from 'services/general/passenger/index';
import { PassengerV2EditPayload } from 'services/general/passenger/interface';
import { notify } from 'utils/notification';

const UseEditPassenger = (getPassengers: () => void) => {
  const {
    mutate: editPassenger,
    isLoading: isLoading,
    isSuccess,
  } = useMutation({
    mutationFn: (passenger: PassengerV2EditPayload) => {
      return editPassengerV2(passenger);
    },
    onSuccess: () => {
      getPassengers();
    },
    onError: ({ message }) => {
      notify({
        type: 'error',
        message: message,
      });
    },
  });

  return { editPassenger, isLoading, isSuccess };
};

export default UseEditPassenger;
