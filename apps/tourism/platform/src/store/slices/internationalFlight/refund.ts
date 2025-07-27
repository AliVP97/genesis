import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
  Passenger,
  RefundItinerary,
  RefundReason,
} from 'module/internationalFlight/refund/types/api';
import { Step, STEPS } from 'module/internationalFlight/refund/types/common';

export type SetupPayload = {
  orderId: string;
  reasons: RefundReason[];
  itineraries: RefundItinerary[];
};

export type RefundModalState = 'open' | 'loading' | 'close';

type RefundState = {
  steps: Step[];
  orderId: string;
  reasons: RefundReason[];
  currentStepIndex: number;
  modalState: RefundModalState;
  selectedReason: RefundReason;
  itineraries: RefundItinerary[];
  selectedPassengers: Passenger[];
  selectedItinerary: RefundItinerary;
};

const initialState: RefundState = {
  steps: [],
  reasons: [],
  orderId: '',
  itineraries: [],
  modalState: 'close',
  currentStepIndex: 0,
  selectedPassengers: [],
  selectedReason: {} as RefundReason,
  selectedItinerary: {} as RefundItinerary,
};

const refundSlice = createSlice({
  name: 'internationalFlightRefund',
  initialState: initialState,
  reducers: {
    refundSetup: (state, action: PayloadAction<SetupPayload>) => {
      const { itineraries, reasons, orderId } = action.payload;
      state.steps = [];
      state.selectedItinerary = {} as RefundItinerary;

      // when the user has multiple itineraries, we need to show the select path
      // step
      if (itineraries.length > 1) {
        state.steps.push(STEPS.SELECT_PATH);
      } else {
        // when the user has only one itinerary, we need to show that
        state.selectedItinerary = itineraries[0];
      }

      // add another steps
      state.steps.push(STEPS.SELECT_REASON);
      state.steps.push(STEPS.SELECT_PASSENGERS);

      state.reasons = reasons;
      state.orderId = orderId;
      state.modalState = 'open';
      state.currentStepIndex = 0;
      state.itineraries = itineraries;
    },
    refundSelectedItineraryChanged: (state, action: PayloadAction<RefundItinerary>) => {
      state.selectedItinerary = action.payload;
    },
    refundNextStep: (state) => {
      if (state.currentStepIndex < state.steps.length - 1) {
        state.currentStepIndex++;
      }
    },
    refundSelectedReasonChanged: (state, action: PayloadAction<RefundReason>) => {
      state.selectedReason = action.payload;
    },
    refundSelectedPassengersChanged: (state, action: PayloadAction<Passenger[]>) => {
      state.selectedPassengers = action.payload;
    },
    refundResetStep: (state) => {
      state.modalState = 'close';
      state.currentStepIndex = 0;
      state.selectedItinerary = {} as RefundItinerary;
      state.selectedReason = {} as RefundReason;
      state.selectedPassengers = [];
      state.steps = [];
      state.itineraries = [];
      state.orderId = '';
      state.reasons = [];
    },
    refundModalStateChanged: (state, action: PayloadAction<RefundModalState>) => {
      state.modalState = action.payload;
    },
  },
});

export const {
  refundSetup,
  refundNextStep,
  refundResetStep,
  refundModalStateChanged,
  refundSelectedReasonChanged,
  refundSelectedItineraryChanged,
  refundSelectedPassengersChanged,
} = refundSlice.actions;
export default refundSlice.reducer;
