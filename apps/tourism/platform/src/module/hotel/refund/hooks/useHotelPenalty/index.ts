import {useMutation} from 'react-query';
import {hotelPenalty} from 'services/hotel/penalty';

const UsePenaltyHotel = () => {
  const {
    mutate: penaltyHotel,
    data: penaltyData,
    isLoading,
    isSuccess,
  } = useMutation({
    mutationFn: ({
      orderId,
      rooms,
    }: {
      orderId: string;
      rooms: Array<string | undefined>;
    }) => {
      return hotelPenalty(orderId, rooms);
    },
  });

  return {penaltyHotel, penaltyData, isLoading, isSuccess};
};

export default UsePenaltyHotel;
