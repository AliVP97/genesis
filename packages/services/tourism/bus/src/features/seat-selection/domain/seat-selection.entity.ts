export type Seat = {
  number: number;
  isAvailable: boolean;
};

export type SeatSelection = {
  busId: string;
  selectedSeats: Seat['number'][];
};

// Domain business rules
export const canSelectSeat = (
  selection: SeatSelection,
  seat: Seat,
): boolean => {
  return (
    selection.selectedSeats.some((s) => s === seat.number) &&
    !selection.selectedSeats.includes(seat.number)
  );
};

export const canDeselectSeat = (
  selection: SeatSelection,
  seat: Seat,
): boolean => {
  return selection.selectedSeats.includes(seat.number);
};

export const getMaxSeats = (): number => {
  return 4; // Business rule: max 4 seats per booking
};

export const isSelectionValid = (selection: SeatSelection): boolean => {
  return (
    selection.selectedSeats.length <= getMaxSeats() &&
    selection.selectedSeats.every((seat) =>
      selection.selectedSeats.includes(seat),
    )
  );
};
