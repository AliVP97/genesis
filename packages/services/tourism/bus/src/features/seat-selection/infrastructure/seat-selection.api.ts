// Pure API layer - no store knowledge
interface Response {
  busMap: BusMap[];
}

interface BusMap {
  floorNumber: number;
  column: number;
  row: number;
  seat: SeatRes[];
}

interface SeatRes {
  x: number;
  y: number;
  seatNumber: number;
  availability: Availability;
}

enum Availability {
  SeatAvailable = 'SEAT_AVAILABLE',
  SeatUnavailableMan = 'SEAT_UNAVAILABLE_MAN',
  SeatUnavailableWoman = 'SEAT_UNAVAILABLE_WOMAN',
  Undefined = 'UNDEFINED',
}

// Pure API functions - no side effects
export const fetchSeatList = async (): Promise<Response> => {
  const response = await fetch('http://localhost:3000/api/bus/seats');
  if (!response.ok) throw new Error('Failed to fetch seat list');
  return response.json();
};

export const saveSeatSelection = async (
  selectedSeats: number[],
): Promise<void> => {
  const response = await fetch('http://localhost:3000/api/bus/seats', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ selectedSeats }),
  });
  if (!response.ok) throw new Error('Failed to save seat selection');
};
