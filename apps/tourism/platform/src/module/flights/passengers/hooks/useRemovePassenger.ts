import { useMutation } from 'react-query';
import { deletePassenger } from 'services/general/passenger';

const UseRemovePassenger = (getPassengers: () => void, close: () => void) => {
  const { mutate, isLoading } = useMutation({
    mutationFn: (id: string) => {
      return deletePassenger(id);
    },
    onSuccess: () => {
      getPassengers();
      close();
    },
  });

  const removePassenger = (id: string) => {
    mutate(id);
  };

  return { removePassenger, isLoading };
};

export default UseRemovePassenger;
