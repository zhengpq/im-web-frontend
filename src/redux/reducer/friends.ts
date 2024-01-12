import { type PayloadAction, createSlice } from '@reduxjs/toolkit';
import { type FriendRow } from '../../types/friend';
import { IndexdbFriendsRow } from '@/types/indexdb';

interface FriendsState {
  value: FriendRow[];
}

export const initialFriendsState: FriendsState = {
  value: [],
};

export const friendsSlice = createSlice({
  name: 'friends',
  initialState: initialFriendsState,
  reducers: {
    clearFriendsState(state) {
      state.value = initialFriendsState.value;
    },
    initFriends(state, action: PayloadAction<FriendRow[]>) {
      state.value = action.payload;
    },
    addFriend(state, action: PayloadAction<FriendRow | FriendRow[]>) {
      if (Array.isArray(action.payload)) {
        state.value.unshift(...action.payload);
      } else {
        state.value.unshift(action.payload);
      }
    },
    updateFriend(state, action: PayloadAction<IndexdbFriendsRow>) {
      const { id } = action.payload;
      const index = state.value.findIndex((item) => item.id === id);
      if (index !== -1) {
        state.value[index] = action.payload;
      }
    },
    deleteFriend(state, action: PayloadAction<string>) {
      state.value = state.value.filter((item) => item.id !== action.payload);
    },
    deleteFriendByFriendId(state, action: PayloadAction<string>) {
      state.value = state.value.filter((item) => item.friend_id !== action.payload);
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

export default friendsSlice.reducer;
