import { RootState } from 'store';

export const selectIsPaymentButtonClick = (state: RootState) =>
  state.internationalFlight.invoice.isPaymentButtonClicked;

export const selectHasActionOnPrice = (state: RootState) =>
  state.internationalFlight.invoice.hasActionOnPrice;
