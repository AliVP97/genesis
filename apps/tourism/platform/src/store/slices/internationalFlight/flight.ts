import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type FlightState = {
  requestId: string | undefined;
};

const initialState: FlightState = {
  requestId: undefined,
};

const flightSlice = createSlice({
  name: 'flight',
  initialState,
  reducers: {
    flightRequestIdChanged: (state, action: PayloadAction<string | undefined>) => {
      state.requestId = action.payload;
    },
  },
});

export const { flightRequestIdChanged } = flightSlice.actions;
export default flightSlice.reducer;
