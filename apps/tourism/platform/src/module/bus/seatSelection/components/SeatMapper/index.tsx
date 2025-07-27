import { FC } from 'react';

import { Seat } from '../Seats';
import { PersianBusSeatAvailability } from '../Seats/interface';
import { TBusSeatAvailability, TSeat } from 'services/bus/seats/interface';

type TSeatCellProps = {
  data: TSeat;
  selectedSeats: number[];
  toggleSeatSelection: (seat: TSeat) => void;
  isMobile?: boolean;
};

export const SeatMapper: FC<TSeatCellProps> = ({
  data: { availability, seatNumber },
  selectedSeats,
  toggleSeatSelection: handleToggleSeatSelection,
  isMobile = false,
}) => {
  const isAvailable = availability === 'SEAT_AVAILABLE' && seatNumber !== 0;
  const isUnavailable =
    ['SEAT_UNAVAILABLE_WOMAN', 'SEAT_UNAVAILABLE_MAN', 'SEAT_UNAVAILABLE_EMPTY'].includes(
      availability,
    ) && seatNumber !== 0;

  return (
    <div className={isMobile ? 'px-2' : 'ps-3 pe-4 py-2'}>
      {isAvailable ? (
        <Seat.AvailableSeat
          toggleSeatSelection={handleToggleSeatSelection}
          seat={{ availability, seatNumber }}
          selectedSeats={selectedSeats}
        />
      ) : isUnavailable ? (
        <Seat.ReservedSeat
          text={PersianBusSeatAvailability[availability as TBusSeatAvailability]}
        />
      ) : (
        <div style={{ height: 42, width: isMobile ? 44 : undefined }} />
      )}
    </div>
  );
};
