import { SeatSelectionUseCases } from './domain/seat-selection.use-cases';
import { createSeatSelectionRepository } from './infrastructure/seat-selection.repository';
import { SeatSelection } from './presentation/seat-selection.component';

// Simple factory function - no complex DI
export const createSeatSelectionModule = (apiBaseUrl: string) => {
  const store = createSeatSelectionRepository(apiBaseUrl);
  const useCases = new SeatSelectionUseCases(store.getState());

  return {
    store,
    useCases,
    Component: SeatSelection,
  };
};

// Default instance
export const seatSelectionModule = createSeatSelectionModule(
  process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api',
);

export { SeatSelection } from './presentation/seat-selection.component';
