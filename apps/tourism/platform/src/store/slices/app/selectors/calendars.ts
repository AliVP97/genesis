import { RootState } from 'store';

export const selectDesktopCalendarAllowedToNavigate = (state: RootState) =>
  state.app.desktopCalendarAllowedToNavigate;

export const selectMobileCalendarObservedDate = (state: RootState) =>
  state.app.mobileCalendarObservedDate;

export const selectSearchCalendarSystem = (state: RootState) => state.app.searchCalendarSystem;

export const selectMobileSearchCalendarDate = (state: RootState) =>
  state.app.mobileSearchCalendarDate;
