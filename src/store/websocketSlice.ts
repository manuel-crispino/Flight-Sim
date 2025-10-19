import { createSlice } from '@reduxjs/toolkit';

type WSState = { connected: boolean };
const initialState: WSState = { connected: false };

const websocketSlice = createSlice({
  name: 'ws',
  initialState,
  reducers: {
    setConnected(state) { state.connected = true; },
    setDisconnected(state) { state.connected = false; },
  },
});

export const { setConnected, setDisconnected } = websocketSlice.actions;
export default websocketSlice.reducer;
