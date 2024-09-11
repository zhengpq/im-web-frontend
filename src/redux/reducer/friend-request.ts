import { type PayloadAction, createSlice, createEntityAdapter } from '@reduxjs/toolkit';
import { type FriendRequestData, type FriendRequestStatus } from '../../types/friend';
import { friendRequestSort } from '../../common/friend';
import { type RootState } from '../store';

export const friendRequestsAdapter = createEntityAdapter<FriendRequestData>({
  sortComparer: (a, b) => {
    if (!a?.created_at || !b?.created_at) return 0;
    return a.created_at - b.created_at;
  },
});

export const friendRequestsSlice = createSlice({
  name: 'friendRequest',
  initialState: friendRequestsAdapter.getInitialState(),
  reducers: {
    clearFriendRequestState(state) {
      friendRequestsAdapter.removeAll(state);
    },
    initFriendRequests(state, action: PayloadAction<FriendRequestData[]>) {
      friendRequestsAdapter.setAll(state, action.payload);
    },
    addFriendRequest(state, action: PayloadAction<FriendRequestData | FriendRequestData[]>) {
      if (Array.isArray(action.payload)) {
        friendRequestsAdapter.addMany(state, action.payload);
      } else {
        friendRequestsAdapter.addOne(state, action.payload);
      }
    },
    deleteFriendRequest(state, action: PayloadAction<string>) {
      friendRequestsAdapter.removeOne(state, action.payload);
    },
    deleteFriendRequestBySenderId(state, action: PayloadAction<string>) {
      friendRequestsAdapter.removeOne(state, action.payload);
    },
    updateFriendRequestState(
      state,
      action: PayloadAction<{ id: string; status: FriendRequestStatus }>,
    ) {
      friendRequestsAdapter.updateOne(state, {
        id: action.payload.id,
        changes: {
          status: action.payload.status,
        },
      });
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

export const {
  selectAll: selectAllFriendRequests,
  selectById: selectFriendRequestById,
  selectEntities: selectFriendRequestsEntities,
  selectIds: selectFriendRequestsIds,
  selectTotal: selectTotalFriendRequests,
} = friendRequestsAdapter.getSelectors((state: RootState) => state.friendRequest);

export default friendRequestsSlice.reducer;
