import { configureStore } from '@reduxjs/toolkit';
import { persistStore } from 'redux-persist';
import expireTimeSlice from './slices/expireTime';
import { rtkQueryErrorLogger } from './errorHandling';
import ecommerceReducer from './slices/ecommerce';
import domesticFlightsReducer from './slices/domestic-flights';
import internationalFlightReducer from './slices/internationalFlight';
import appReducer from './slices/app';

const reducers = {
  app: appReducer,
  ecommerceReducer,
  expireTimeSlice,
  domesticFlightsReducer,
  internationalFlight: internationalFlightReducer,
};
export const store = configureStore({
  reducer: reducers,
  devTools: process.env.NODE_ENV !== 'production',
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore these action types
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
        // Optionally ignore paths in the state
        ignoredPaths: ['register', 'rehydrate'],
      },
    }).concat(rtkQueryErrorLogger),
});

export const persistor = persistStore(store);
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
