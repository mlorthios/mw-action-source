import AsyncStorage from '@react-native-community/async-storage';
import { createStore, applyMiddleware } from 'redux';
import { createLogger } from 'redux-logger';
import { persistStore, persistReducer } from 'redux-persist';

import rootReducer from './reducer';
                               
const persistConfig = {

  key: 'root',

  storage: AsyncStorage,

  whitelist: [
    'authReducer',
  ],

  blacklist: [
    'chatReducer',
  ],
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = createStore(
  persistedReducer,
  applyMiddleware(
    createLogger(),
  ),
);

let persistor = persistStore(store);

export {
  store,
  persistor,
};