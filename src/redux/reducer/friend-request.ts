import { type PayloadAction, createSlice } from '@reduxjs/toolkit';
import { type FriendRequestData, type FriendRequestStatus } from '../../types/friend';
import { friendRequestSort } from '../../common/friend';

interface FriendRequestsState {
  value: FriendRequestData[];
}

export const initialRequestsState: FriendRequestsState = {
  value: [],
};

export const friendRequestsSlice = createSlice({
  name: 'friendRequest',
  initialState: initialRequestsState,
  reducers: {
    clearFriendRequestState(state) {
      state.value = initialRequestsState.value;
    },
    initFriendRequests(state, action: PayloadAction<FriendRequestData[]>) {
      state.value = friendRequestSort(action.payload);
    },
    addFriendRequest(state, action: PayloadAction<FriendRequestData | FriendRequestData[]>) {
      if (Array.isArray(action.payload)) {
        state.value.unshift(...action.payload);
      } else {
        state.value.unshift(action.payload);
      }
    },
    deleteFriendRequest(state, action: PayloadAction<string>) {
      state.value = state.value.filter((item) => item?.id !== action.payload);
    },
    deleteFriendRequestBySenderId(state, action: PayloadAction<string>) {
      state.value = state.value.filter((item) => item?.sender_id !== action.payload);
    },
    updateFriendRequestState(
      state,
      action: PayloadAction<{ id: string; status: FriendRequestStatus }>,
    ) {
      state.value.forEach((item) => {
        if (item?.id === action.payload.id) {
          item.status = action.payload.status;
        }
      });
      state.value = friendRequestSort(state.value);
    },
  },
});

export const {
  initFriendRequests,
  addFriendRequest,
  deleteFriendRequest,
  deleteFriendRequestBySenderId,
  updateFriendRequestState,
  clearFriendRequestState,
} = friendRequestsSlice.actions;

export default friendRequestsSlice.reducer;
