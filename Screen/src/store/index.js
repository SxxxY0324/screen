import { configureStore } from '@reduxjs/toolkit';
import monitorReducer from './slices/monitorSlice';
import appReducer from './slices/appSlice';

const store = configureStore({
  reducer: {
    monitor: monitorReducer,
    app: appReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware(),
  devTools: process.env.NODE_ENV !== 'production',
});

export default store; 