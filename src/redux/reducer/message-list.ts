import { MessageState } from '@/types';
import { FriendMessageRow } from '@/types/friend';
import { GroupMessageRow } from '@/types/group';
import { IndexdbFriendMessagesRow, IndexdbGroupMessagesRow } from '@/types/indexdb';
import { PayloadAction, createEntityAdapter, createSlice } from '@reduxjs/toolkit';
import { type RootState } from '../store';

const messageListAdapter = createEntityAdapter<IndexdbFriendMessagesRow | IndexdbGroupMessagesRow>({
  sortComparer: (a, b) => b.created_at - a.created_at,
});

const messageListSlice = createSlice({
  name: 'messageList',
  initialState: messageListAdapter.getInitialState,
  reducers: {
    addTempMessage(state, action: PayloadAction<any>) {
      messageListAdapter.addOne(state, action.payload);
    },
    initMessageList(
      state,
      action: PayloadAction<IndexdbFriendMessagesRow[] | IndexdbGroupMessagesRow[]>,
    ) {
      messageListAdapter.setAll(state, action.payload);
    },
    addMessage(state, action: PayloadAction<any>) {
      if (Array.isArray(action.payload)) {
        messageListAdapter.addMany(state, action.payload);
      } else {
        messageListAdapter.addOne(state, action.payload);
      }
    },
    ackMessage(state, action: PayloadAction<FriendMessageRow | GroupMessageRow>) {
      messageListAdapter.updateOne(state, {
        id: action.payload.ack_id,
        changes: action.payload,
      });
    },
    changeMessageState(state, action: PayloadAction<{ ackId: string; state: MessageState }>) {
      messageListAdapter.updateOne(state, {
        id: action.payload.ackId,
        changes: {
          state: action.payload.state,
        },
      });
    },
  },
});

export const {
  selectAll: selectAllMessages,
  selectById: selectMessageById,
  selectIds: selectMessagesIds,
  selectEntities: selectMessagesEntities,
  selectTotal: selectMessagesTotal,
} = messageListAdapter.getSelectors((state: RootState) => state.messageList);

export const { initMessageList, addTempMessage, addMessage, ackMessage, changeMessageState } =
  messageListSlice.actions;

export default messageListSlice.reducer;
