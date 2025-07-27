import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { CalendarSystem } from 'containers/datepicker/types/common';

type MobileCalendarObservedDate = {
  month: number;
  year: number;
};

export type MobileSearchCalendarDate = {
  month: number;
  year: number;
  monthOffset: number;
} | null;

export type AppState = {
  searchCalendarSystem: CalendarSystem;
  notFoundRedirectUrl: string | null;
  desktopCalendarAllowedToNavigate: boolean;
  mobileSearchCalendarDate: MobileSearchCalendarDate;
  mobileCalendarObservedDate: MobileCalendarObservedDate;
};

const initialAppState: AppState = {
  notFoundRedirectUrl: null,
  searchCalendarSystem: 'jalali',
  desktopCalendarAllowedToNavigate: true,
  mobileCalendarObservedDate: {
    month: -1,
    year: 0,
  },
  mobileSearchCalendarDate: null,
};

const appSlice = createSlice({
  name: 'app',
  initialState: initialAppState,
  reducers: {
    notFoundRedirectUrlChanged: (state, action: PayloadAction<string | null>) => {
      state.notFoundRedirectUrl = action.payload;
    },
    clearNotFoundRedirectUrl: (state) => {
      state.notFoundRedirectUrl = null;
    },
    searchCalendarSystemChanged(state, action: PayloadAction<CalendarSystem>) {
      state.searchCalendarSystem = action.payload;
    },
    desktopCalendarAllowedToNavigateChanged(state, action: PayloadAction<boolean>) {
      state.desktopCalendarAllowedToNavigate = action.payload;
    },
    mobileCalendarObservedDateChanged(state, action: PayloadAction<MobileCalendarObservedDate>) {
      state.mobileCalendarObservedDate = action.payload;
    },
    mobileSearchCalendarDateChanged(state, action: PayloadAction<MobileSearchCalendarDate>) {
      state.mobileSearchCalendarDate = action.payload;
    },
  },
});

export const {
  notFoundRedirectUrlChanged,
  clearNotFoundRedirectUrl,
  searchCalendarSystemChanged,
  mobileSearchCalendarDateChanged,
  mobileCalendarObservedDateChanged,
  desktopCalendarAllowedToNavigateChanged,
} = appSlice.actions;
export default appSlice.reducer;
