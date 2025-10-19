import { configureStore } from '@reduxjs/toolkit';
import flightsReducer from './flightsSlice';
import websocketReducer from './websocketSlice';

export const store = configureStore({
  reducer: {
    flights: flightsReducer,
    websocket: websocketReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
