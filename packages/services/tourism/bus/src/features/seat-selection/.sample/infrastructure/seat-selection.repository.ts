import { createStore } from 'zustand';

import { SeatSelection } from '../domain/seat-selection.entity';

// API service functions (functional approach)
export const fetchSeatSelection = async (
  baseUrl: string,
  busId: string,
): Promise<SeatSelection> => {
  const response = await fetch(`${baseUrl}/buses/${busId}/seats`);
  if (!response.ok) throw new Error('Failed to fetch seats');
  return response.json();
};

export const updateSeatSelection = async (
  baseUrl: string,
  selection: SeatSelection,
): Promise<void> => {
  const response = await fetch(`${baseUrl}/buses/${selection.busId}/seats`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(selection),
  });
  if (!response.ok) throw new Error('Failed to save seats');
};

type Repository = {
  selection: SeatSelection | null;

  // Repository interface implementation
  getSeatSelection: (busId: string) => Promise<SeatSelection>;
  saveSeatSelection: (selection: SeatSelection) => Promise<void>;

  // Data state helpers
  setSelection: (selection: SeatSelection) => void;
};

// Repository implementation with Zustand - pure data operations
export const createSeatSelectionStore = (baseUrl: string) => {
  return createStore<Repository>((set, get) => ({
    selection: null,

    getSeatSelection: async (busId: string) => {
      const selection = await fetchSeatSelection(baseUrl, busId);
      set({ selection });
      return selection;
    },

    saveSeatSelection: async (selection: SeatSelection) => {
      await updateSeatSelection(baseUrl, selection);
      set({ selection });
    },

    setSelection: (selection) => set({ selection }),
  }));
};
