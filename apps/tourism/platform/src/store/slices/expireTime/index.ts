import { createSlice, PayloadAction } from '@reduxjs/toolkit';

const initialState = {
  uuidExpired: false,
  reserveExpired: false,
};

export const expireTimeSlice = createSlice({
  name: 'expireTimeSlice',
  initialState,
  reducers: {
    checkExpiry: (state, action: PayloadAction<{ type: 'uuid' | 'reserve'; expired: boolean }>) => {
      const { type, expired } = action.payload;
      switch (type) {
        case 'uuid':
          state.uuidExpired = expired;
          return;
        case 'reserve':
          state.reserveExpired = expired;
        default:
          return;
      }
    },
  },
});

export const { checkExpiry } = expireTimeSlice.actions;
export default expireTimeSlice.reducer;
