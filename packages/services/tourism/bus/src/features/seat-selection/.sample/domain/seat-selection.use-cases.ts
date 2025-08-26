import {
  Seat,
  SeatSelection,
  canSelectSeat,
  canDeselectSeat,
  getMaxSeats,
  isSelectionValid,
} from './seat-selection.entity';

// Repository interface (dependency inversion)
export interface SeatSelectionRepository {
  getSeatSelection(busId: string): Promise<SeatSelection>;
  saveSeatSelection(selection: SeatSelection): Promise<void>;
}

// Pure business logic use cases
export const loadSeatSelection = async (
  repository: SeatSelectionRepository,
  busId: string,
): Promise<SeatSelection> => {
  return repository.getSeatSelection(busId);
};

export const selectSeat = (
  currentSelection: SeatSelection,
  seat: Seat,
): SeatSelection => {
  if (!canSelectSeat(currentSelection, seat)) {
    throw new Error('Cannot select this seat');
  }

  if (currentSelection.selectedSeats.length >= getMaxSeats()) {
    throw new Error(`Maximum ${getMaxSeats()} seats allowed`);
  }

  return {
    ...currentSelection,
    selectedSeats: [...currentSelection.selectedSeats, seat],
  };
};

export const deselectSeat = (
  currentSelection: SeatSelection,
  seat: Seat,
): SeatSelection => {
  if (!canDeselectSeat(currentSelection, seat)) {
    throw new Error('Cannot deselect this seat');
  }

  return {
    ...currentSelection,
    selectedSeats: currentSelection.selectedSeats.filter((s) => s !== seat),
  };
};

export const saveSeatSelection = async (
  repository: SeatSelectionRepository,
  selection: SeatSelection,
): Promise<void> => {
  if (!isSelectionValid(selection)) {
    throw new Error('Invalid seat selection');
  }

  await repository.saveSeatSelection(selection);
};
