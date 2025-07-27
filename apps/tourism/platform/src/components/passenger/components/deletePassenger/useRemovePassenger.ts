import { MoreButtonContext } from 'components/passenger/context/MoreButtonContext';
import { useContext } from 'react';
import { useMutation, useQueryClient } from 'react-query';
import { deletePassenger } from 'services/general/passenger';

const useRemovePassenger = (close: () => void) => {
  const queryClient = useQueryClient();
  const { selectedPassengers, setSelectedPassengers } =
    useContext<MoreButtonContext>(MoreButtonContext);
  const { isLoading, mutateAsync: removePassenger } = useMutation({
    mutationFn: async ({ id }: { id: string }) => {
      await deletePassenger(id);
      const newSelected = selectedPassengers?.filter((item) => {
        return item.id !== id;
      });
      setSelectedPassengers && newSelected && setSelectedPassengers(newSelected);
    },
    mutationKey: ['deletePassenger'],
    onSettled: () => {
      queryClient.invalidateQueries('passengerList');
      close();
    },
  });

  return { removePassenger, isLoading };
};

export default useRemovePassenger;
