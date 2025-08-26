import { createStore } from 'zustand';

import { canSelectSeat, Seat } from '../domain/seat-selection.entity';
import {
  fetchSeatList,
  saveSeatSelection,
} from '../infrastructure/seat-selection.api';

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

type RepositoryState = {
  seatList: Response;
  selectedSeats: Seat['number'][];
};

type RepositoryActions = {
  // Data operations
  loadSeatList: () => Promise<void>;
  saveSeatSelection: () => Promise<void>;

  // Local state operations
  selectSeat: (seatNumber: Seat['number']) => void;
  deselectSeat: (seatNumber: Seat['number']) => void;

  // State setters
  setSeatList: (seatList: Response) => void;
  setSelectedSeats: (seats: Seat['number'][]) => void;
};

export type Repository = RepositoryState & RepositoryActions;

// Single repository layer using Zustand
export const repository = createStore<Repository>((set, get) => ({
  // Initial state
  seatList: {
    busMap: [],
  },
  selectedSeats: [],

  // Data operations - orchestrate API calls
  loadSeatList: async () => {
    const seatList = await fetchSeatList();
    set({ seatList });
  },

  saveSeatSelection: async () => {
    const { selectedSeats } = get();
    await saveSeatSelection(selectedSeats);
  },

  // Local state operations
  selectSeat: (seatNumber: Seat['number']) => {
    const state = get();
    if (canSelectSeat(state, seatNumber)) {
      set((state) => ({
        selectedSeats: [...state.selectedSeats, seatNumber],
      }));
    }
  },

  deselectSeat: (seatNumber: Seat['number']) => {
    set((state) => ({
      selectedSeats: state.selectedSeats.filter((s) => s !== seatNumber),
    }));
  },

  // State setters
  setSeatList: (seatList: Response) => set({ seatList }),
  setSelectedSeats: (selectedSeats: Seat['number'][]) => set({ selectedSeats }),
}));
