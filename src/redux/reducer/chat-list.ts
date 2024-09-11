import { PayloadAction, createEntityAdapter, createSlice } from '@reduxjs/toolkit';
import { IndexdbChatsRow } from '@/types/indexdb';
import { type RootState } from '../store';

const chatListAdapter = createEntityAdapter<IndexdbChatsRow>({
  sortComparer: (a, b) => {
    if (!a.last_message || !b.last_message) return 0;
    return b.last_message.created_at - a.last_message.created_at;
  },
});

export const chatListSlice = createSlice({
  name: 'chatList',
  initialState: chatListAdapter.getInitialState(),
  reducers: {
    clearChatList(state) {
      chatListAdapter.removeAll(state);
    },
    initChatList(state, action: PayloadAction<IndexdbChatsRow[]>) {
      chatListAdapter.setAll(state, action.payload);
    },
    addChat(state, action: PayloadAction<IndexdbChatsRow>) {
      chatListAdapter.addOne(state, action.payload);
    },
    updateChat(state, action: PayloadAction<IndexdbChatsRow>) {
      const { id } = action.payload;
      chatListAdapter.updateOne(state, {
        id,
        changes: action.payload,
      });
    },
    // updateChatLastMessage(
    //   state,
    //   action: PayloadAction<{ index: number; lastMessage: FriendMessageRow | GroupMessageRow }>,
    // ) {

    // },
  },
});

export const { clearChatList, initChatList, addChat, updateChat } = chatListSlice.actions;

export const {
  selectAll: selectAllChats,
  selectById: selectChatById,
  selectEntities: selectChatsEntities,
  selectIds: selectChatsIds,
  selectTotal: selectChatsTotal,
} = chatListAdapter.getSelectors((state: RootState) => state.chatList);

export default chatListSlice.reducer;
