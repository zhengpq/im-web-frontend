import { type PayloadAction, createSlice, createEntityAdapter } from '@reduxjs/toolkit';
import { type FriendRow } from '../../types/friend';
import { IndexdbFriendsRow } from '@/types/indexdb';
import { type RootState } from '../store';

export const friendAdapter = createEntityAdapter<FriendRow>({
  sortComparer: (a, b) => a.created_at - b.created_at,
});
const initialFriendsState = friendAdapter.getInitialState();

export const friendsSlice = createSlice({
  name: 'friends',
  initialState: initialFriendsState,
  reducers: {
    clearFriendsState(state) {
      friendAdapter.removeAll(state);
    },
    initFriends(state, action: PayloadAction<FriendRow[]>) {
      friendAdapter.setAll(state, action.payload);
    },
    addFriend(state, action: PayloadAction<FriendRow | FriendRow[]>) {
      if (Array.isArray(action.payload)) {
        // state.value.unshift(...action.payload);
        friendAdapter.addMany(state, action.payload);
      } else {
        friendAdapter.addOne(state, action.payload);
        // state.value.unshift(action.payload);
      }
    },
    updateFriend(state, action: PayloadAction<IndexdbFriendsRow>) {
      friendAdapter.updateOne(state, {
        id: action.payload.id,
        changes: action.payload,
      });
    },
    deleteFriend(state, action: PayloadAction<string>) {},
    deleteFriendByFriendId(state, action: PayloadAction<string>) {
      friendAdapter.removeOne(state, action.payload);
    },
  },
});

export const {
  initFriends,
  addFriend,
  deleteFriend,
  clearFriendsState,
  updateFriend,
  deleteFriendByFriendId,
} = friendsSlice.actions;

export const {
  selectById: selectFriendById,
  selectAll: selectAllFriends,
  selectTotal: selectTotalFriends,
  selectEntities: selectFriendEntities,
  selectIds: selectFriendIds,
} = friendAdapter.getSelectors((state: RootState) => state.friends);

export default friendsSlice.reducer;
