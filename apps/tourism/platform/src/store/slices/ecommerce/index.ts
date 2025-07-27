import { combineReducers } from '@reduxjs/toolkit';
import storage from 'redux-persist/lib/storage';
import { persistReducer } from 'redux-persist';
import ecommerceSlice from './ecomerceSlice';

const persistConfig = {
  key: 'ecommerceReducer',
  storage,
  whitelist: [
    'domesticFlightData',
    'internationalFlightData',
    'busData',
    'trainData',
    'hotelData',
    'internationalFlightCartObject',
    'trainPassengersLength',
  ], //state you want to persist
};

const ecomerceSlice = persistReducer(persistConfig, ecommerceSlice);

const ecommerceReducer = combineReducers({
  ecomerceSlice,
});

export default ecommerceReducer;
