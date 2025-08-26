import { useEffect, useState } from 'react';

import { useStore } from 'zustand';

import { Seat } from '../domain/seat-selection.entity';
import { SeatSelectionUseCases } from '../domain/seat-selection.use-cases';

export const useSeatSelection = (
  store: ReturnType<
    typeof import('../infrastructure/seat-selection.repository').createSeatSelectionStore
  >,
  useCases: SeatSelectionUseCases,
  busId: string,
) => {
  const { selection, setSelection } = useStore(store);

  // UI state management in presentation layer
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load seat selection on mount
  useEffect(() => {
    if (busId) {
      setIsLoading(true);
      setError(null);

      useCases
        .loadSeatSelection(busId)
        .catch((err) => {
          setError(err.message);
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  }, [busId, useCases]);

  const selectSeat = (seat: Seat) => {
    if (!selection) return;

    try {
      const newSelection = useCases.selectSeat(selection, seat);
      setSelection(newSelection);
      setError(null);
    } catch (error) {
      setError(
        error instanceof Error ? error.message : 'Failed to select seat',
      );
    }
  };

  const deselectSeat = (seat: Seat) => {
    if (!selection) return;

    try {
      const newSelection = useCases.deselectSeat(selection, seat);
      setSelection(newSelection);
      setError(null);
    } catch (error) {
      setError(
        error instanceof Error ? error.message : 'Failed to deselect seat',
      );
    }
  };

  const saveSelection = async () => {
    if (!selection) return;

    setIsLoading(true);
    setError(null);

    try {
      await useCases.saveSeatSelection(selection);
    } catch (error) {
      setError(
        error instanceof Error ? error.message : 'Failed to save selection',
      );
    } finally {
      setIsLoading(false);
    }
  };

  return {
    selection,
    isLoading,
    error,
    selectSeat,
    deselectSeat,
    saveSelection,
  };
};
