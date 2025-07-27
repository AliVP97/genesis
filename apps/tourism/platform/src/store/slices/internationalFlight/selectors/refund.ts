import { RootState } from 'store';

export const selectRefundStep = (state: RootState) =>
  state.internationalFlight.refund.steps[state.internationalFlight.refund.currentStepIndex];

export const selectRefundItineraries = (state: RootState) =>
  state.internationalFlight.refund.itineraries;

export const selectRefundItinerary = (state: RootState) =>
  state.internationalFlight.refund.selectedItinerary;

export const selectRefundReasons = (state: RootState) => state.internationalFlight.refund.reasons;

export const selectRefundItineraryPassengers = (state: RootState) =>
  state.internationalFlight.refund.selectedItinerary?.passengers ?? [];

export const selectRefundPreConfirmData = (state: RootState) => {
  const { selectedItinerary, selectedReason, orderId } = state.internationalFlight.refund;

  return {
    orderId: orderId ?? '',
    refundReasonId: selectedReason?.id ?? '',
    flightId: selectedItinerary?.flightId ?? '',
    itineraryId: selectedItinerary?.itineraryId ?? '',
  };
};

export const selectRefundModalState = (state: RootState) =>
  state.internationalFlight.refund.modalState;
