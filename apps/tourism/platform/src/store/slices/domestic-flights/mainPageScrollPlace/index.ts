import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface scrollStatus {
  status: boolean;
}

const initialState: scrollStatus = {
  status: false,
};

export const mainPageScrollPlaceSlice = createSlice({
  name: 'mainPageScrollPlace',
  initialState,
  reducers: {
    scrollHandler(state, action: PayloadAction<scrollStatus>) {
      state.status = action.payload.status;
    },
  },
});

export const { scrollHandler } = mainPageScrollPlaceSlice.actions;
