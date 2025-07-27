import { RootState } from 'store';

export const selectSearchData = (state: RootState) => state.internationalFlight.search;
