import { useState } from 'react';

import { TSeat } from 'services/bus/seats/interface';
import { notify } from 'utils/notification';

export const useHandleSelectSeat = () => {
  const [selectedSeats, setSelectedSeats] = useState<number[]>([]);
  const [isAddPassengerVisible, setIsAddPassengerVisible] = useState<boolean>(false);

  const toggleSeatSelection = (seat: TSeat) => {
    const isSeatAvailable = seat.availability === 'SEAT_AVAILABLE';
    const seatIndex = selectedSeats.indexOf(seat.seatNumber!);

    if (isSeatAvailable && seatIndex === -1) {
      if (selectedSeats.length >= 6) {
        notify({
          message: 'حداکثر ۶ صندلی در هر خرید قابل رزرو می‌باشد.',
          type: 'warning',
          config: { position: 'bottom-right' },
        });
      } else {
        setSelectedSeats([...selectedSeats, seat.seatNumber!]);
      }
    } else if (seatIndex !== -1) {
      const updatedSeats = [...selectedSeats];
      updatedSeats.splice(seatIndex, 1);
      setSelectedSeats(updatedSeats);
    }
  };

  return {
    toggleSeatSelection,
    selectedSeats,
    setSelectedSeats,
    isAddPassengerVisible,
    setIsAddPassengerVisible,
  };
};
