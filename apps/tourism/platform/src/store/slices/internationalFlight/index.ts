import { combineReducers } from '@reduxjs/toolkit';
import flightDetailsReducer from './flightDetails';
import flightReducer from './flight';
import searchReducer from './search';
import invoiceReducer from './invoice';
import refundReducer from './refund';

const internationalFlightReducer = combineReducers({
  flight: flightReducer,
  search: searchReducer,
  refund: refundReducer,
  flightDetails: flightDetailsReducer,
  invoice: invoiceReducer,
});

export default internationalFlightReducer;
