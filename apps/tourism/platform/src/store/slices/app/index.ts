import storage from 'redux-persist/lib/storage';
import { PersistConfig, persistReducer } from 'redux-persist';
import appReducer, { AppState } from './app';

const persistConfig: PersistConfig<AppState> = {
  key: 'app',
  storage,
  whitelist: ['calendarSystem'],
};
const persistedReducer = persistReducer(persistConfig, appReducer);

export default persistedReducer;
