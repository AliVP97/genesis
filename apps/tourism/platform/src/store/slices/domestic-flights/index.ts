import { combineReducers } from '@reduxjs/toolkit';
import { mainPageScrollPlaceSlice } from './mainPageScrollPlace';
import searchReducer from './search';

const domesticFlights = combineReducers({
  mainPageScrollPlace: mainPageScrollPlaceSlice.reducer,
  search: searchReducer,
});

export default domesticFlights;
