import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

interface SocketState {
  value: {
    connecting: boolean;
  };
}

export const initialSocketState: SocketState = {
  value: {
    connecting: false,
  },
};

export const socketSlice = createSlice({
  name: 'socket',
  initialState: initialSocketState,
  reducers: {
    changeConnectingState(state, action: PayloadAction<boolean>) {
      state.value.connecting = action.payload;
    },
  },
});

export const { changeConnectingState } = socketSlice.actions;

export default socketSlice.reducer;
