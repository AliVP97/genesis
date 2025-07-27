import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type InvoiceState = {
  isPaymentButtonClicked: boolean;
  hasActionOnPrice: boolean;
};

const initialState: InvoiceState = {
  isPaymentButtonClicked: false,
  hasActionOnPrice: false,
};

const invoiceSlice = createSlice({
  name: 'invoice',
  initialState,
  reducers: {
    onClickPaymentButton: (state, action: PayloadAction<boolean>) => {
      state.isPaymentButtonClicked = action.payload;
    },
    onActionOnPrice: (state, action: PayloadAction<boolean>) => {
      state.hasActionOnPrice = action.payload;
    },
  },
});

export const { onClickPaymentButton, onActionOnPrice } = invoiceSlice.actions;
export default invoiceSlice.reducer;
