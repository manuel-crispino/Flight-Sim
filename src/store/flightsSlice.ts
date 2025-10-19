import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type Flight = { icao24: string; callsign?: string; lat: number; lon: number; baro_altitude?: number };

type FlightsState = { byId: Record<string, Flight> };

const initialState: FlightsState = { byId: {} };

const flightsSlice = createSlice({
  name: 'flights',
  initialState,
  reducers: {
    upsertFlight(state, action: PayloadAction<Flight>) {
      state.byId[action.payload.icao24] = action.payload;
    },
    removeFlight(state, action: PayloadAction<string>) {
      delete state.byId[action.payload];
    },
  },
});

export const { upsertFlight, removeFlight } = flightsSlice.actions;
export default flightsSlice.reducer;
