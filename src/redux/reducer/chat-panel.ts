import { type PayloadAction, createSlice } from '@reduxjs/toolkit';
import { type FriendMessageRow } from '@/types/friend';
import { type GroupMessageRow } from '@/types/group';
import { type MessageState } from '@/types';
import {
  IndexdbChatsRow,
  IndexdbFriendMessagesRow,
  IndexdbGroupMessagesRow,
} from '@/types/indexdb';

interface ChatPanelState {
  value: {
    switching: boolean;
    currentChat: IndexdbChatsRow | null;
    chatList: IndexdbChatsRow[];
    messageList: IndexdbFriendMessagesRow[] | IndexdbGroupMessagesRow[];
  };
}

export const initialChatPanel: ChatPanelState = {
  value: {
    switching: false,
    currentChat: null,
    chatList: [],
    messageList: [],
  },
};

export const chatPanelSlice = createSlice({
  name: 'chatPanel',
  initialState: initialChatPanel,
  reducers: {
    clearChatPanelState(state) {
      state.value = initialChatPanel.value;
    },
    updateSwitching(state, action: PayloadAction<boolean>) {
      state.value.switching = action.payload;
    },
    initCurrentChat(state, action: PayloadAction<IndexdbChatsRow>) {
      state.value.currentChat = action.payload;
    },
    initChatList(state, action: PayloadAction<IndexdbChatsRow[]>) {
      state.value.chatList = action.payload;
    },
    addChat(state, action: PayloadAction<IndexdbChatsRow>) {
      state.value.chatList.unshift(action.payload);
    },
    addTempMessage(state, action: PayloadAction<any>) {
      state.value.messageList.unshift(action.payload);
    },
    initMessageList(
      state,
      action: PayloadAction<IndexdbFriendMessagesRow[] | IndexdbGroupMessagesRow[]>,
    ) {
      state.value.messageList = action.payload;
      // 修改当前聊天对象的最后一条信息
      // const chatIndex = state.value.chatList.findIndex(
      //   (item) => item.id === state.value.panelInfo.id,
      // );
      // if (chatIndex === -1) return;
      // const lastMessage = state.value.messageList[state.value.messageList.length - 1];
      // state.value.chatList[chatIndex].last_message = lastMessage;
    },
    addMessage(state, action: PayloadAction<any>) {
      if (Array.isArray(action.payload)) {
        state.value.messageList.unshift(...action.payload);
      } else {
        state.value.messageList.unshift(action.payload);
      }
    },
    ackMessage(state, action: PayloadAction<FriendMessageRow | GroupMessageRow>) {
      const index = state.value.messageList.findIndex(
        (item) => item.ack_id === action.payload.ack_id,
      );
      state.value.messageList[index] = action.payload;
    },
    changeMessageState(state, action: PayloadAction<{ ackId: string; state: MessageState }>) {
      const { ackId, state: messageState } = action.payload;
      const index = state.value.messageList.findIndex((item) => item.ack_id === ackId);
      if (index !== -1) {
        state.value.messageList[index].state = messageState;
      }
    },
    updateChat(state, action: PayloadAction<IndexdbChatsRow>) {
      const { id } = action.payload;
      const index = state.value.chatList.findIndex((item) => item.id === id);
      if (index !== -1) {
        state.value.chatList[index] = action.payload;
        if (state.value.currentChat?.id === id) {
          state.value.currentChat = action.payload;
        }
      }
    },
    updateLastMessage(
      state,
      action: PayloadAction<{ index: number; lastMessage: FriendMessageRow | GroupMessageRow }>,
    ) {
      const { index, lastMessage } = action.payload;
      state.value.chatList[index].last_message = lastMessage;
    },
  },
});

export const {
  initCurrentChat,
  initChatList,
  addChat,
  addTempMessage,
  addMessage,
  initMessageList,
  ackMessage,
  changeMessageState,
  updateChat,
  updateLastMessage,
  clearChatPanelState,
  updateSwitching,
} = chatPanelSlice.actions;

export default chatPanelSlice.reducer;
