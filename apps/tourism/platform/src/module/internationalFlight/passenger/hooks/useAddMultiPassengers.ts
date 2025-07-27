import { useMutation } from 'react-query';
import { addMultiPassenger } from 'services/general/passenger/index';
import { IPassenger } from 'services/general/passenger/interface';
import { notify } from 'utils/notification';

const UseAddMultiPassengers = (getPassengers: () => void) => {
  const { mutate: addMultiPassengers, isLoading: isLoading } = useMutation({
    mutationFn: (passengers: Array<IPassenger>) => {
      return addMultiPassenger({ passengers: passengers });
    },
    onSuccess: () => {
      getPassengers();
    },
    onError: ({ message }) => {
      getPassengers();
      notify({
        type: 'error',
        message: message,
      });
    },
  });

  return { addMultiPassengers, isLoading };
};

export default UseAddMultiPassengers;
