import { FC } from 'react';

import { SeatSelectionUseCases } from '../domain/seat-selection.use-cases';
import { createSeatSelectionStore } from '../infrastructure/seat-selection.repository';
import { useSeatSelection } from './use-seat-selection.hook';

interface SeatSelectionProps {
  store: ReturnType<typeof createSeatSelectionStore>;
  useCases: SeatSelectionUseCases;
  busId: string;
}

export const SeatSelection: FC<SeatSelectionProps> = ({
  store,
  useCases,
  busId,
}) => {
  const {
    selection,
    isLoading,
    error,
    selectSeat,
    deselectSeat,
    saveSelection,
  } = useSeatSelection(store, useCases, busId);

  if (isLoading) return <div>Loading seats...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!selection) return <div>No seat data available</div>;

  const handleSeatToggle = (seatNumber: number) => {
    if (selection.selectedSeats.includes(seatNumber)) {
      deselectSeat(seatNumber);
    } else {
      selectSeat(seatNumber);
    }
  };

  return (
    <div>
      <h1>Bus Seat Selection</h1>
      <div>Selected Seats: {selection.selectedSeats.join(', ')}</div>

      <div className="seat-grid">
        {selection.availableSeats.map((seatNumber) => (
          <button
            key={seatNumber}
            onClick={() => handleSeatToggle(seatNumber)}
            className={`seat ${
              selection.selectedSeats.includes(seatNumber)
                ? 'selected'
                : 'available'
            }`}
          >
            {seatNumber}
          </button>
        ))}
      </div>

      <button
        onClick={saveSelection}
        disabled={selection.selectedSeats.length === 0}
      >
        Save Selection
      </button>
    </div>
  );
};
