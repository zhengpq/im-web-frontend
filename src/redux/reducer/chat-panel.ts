import { type PayloadAction, createSlice } from '@reduxjs/toolkit';
import { type FriendMessageRow } from '@/types/friend';
import { type GroupMessageRow } from '@/types/group';
import { type MessageState } from '@/types';
import {
  IndexdbChatsRow,
  IndexdbFriendMessagesRow,
  IndexdbGroupMessagesRow,
} from '@/types/indexdb';
import { type RootState } from '../store';

interface ChatPanelState {
  value: {
    switching: boolean;
    currentChat: IndexdbChatsRow | null;
    // messageList: IndexdbFriendMessagesRow[] | IndexdbGroupMessagesRow[];
  };
}

export const initialChatPanel: ChatPanelState = {
  value: {
    switching: false,
    currentChat: null,
    // messageList: [],
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
    // addTempMessage(state, action: PayloadAction<any>) {
    //   state.value.messageList.unshift(action.payload);
    // },
    // initMessageList(
    //   state,
    //   action: PayloadAction<IndexdbFriendMessagesRow[] | IndexdbGroupMessagesRow[]>,
    // ) {
    //   state.value.messageList = action.payload;
    //   // 修改当前聊天对象的最后一条信息
    //   // const chatIndex = state.value.chatList.findIndex(
    //   //   (item) => item.id === state.value.panelInfo.id,
    //   // );
    //   // if (chatIndex === -1) return;
    //   // const lastMessage = state.value.messageList[state.value.messageList.length - 1];
    //   // state.value.chatList[chatIndex].last_message = lastMessage;
    // },
    // addMessage(state, action: PayloadAction<any>) {
    //   if (Array.isArray(action.payload)) {
    //     state.value.messageList.unshift(...action.payload);
    //   } else {
    //     state.value.messageList.unshift(action.payload);
    //   }
    // },
    // ackMessage(state, action: PayloadAction<FriendMessageRow | GroupMessageRow>) {
    //   const index = state.value.messageList.findIndex(
    //     (item) => item.ack_id === action.payload.ack_id,
    //   );
    //   state.value.messageList[index] = action.payload;
    // },
    // changeMessageState(state, action: PayloadAction<{ ackId: string; state: MessageState }>) {
    //   const { ackId, state: messageState } = action.payload;
    //   const index = state.value.messageList.findIndex((item) => item.ack_id === ackId);
    //   if (index !== -1) {
    //     state.value.messageList[index].state = messageState;
    //   }
    // },
    updateCurrentChat(state, action: PayloadAction<IndexdbChatsRow>) {
      const { id } = action.payload;
      if (state.value.currentChat?.id === id) {
        state.value.currentChat = action.payload;
      }
    },
  },
});

export const currentChatSelector = (state: RootState) => {
  return state.chatPanel.value.currentChat;
};

export const {
  initCurrentChat,
  // addTempMessage,
  // addMessage,
  // initMessageList,
  // ackMessage,
  // changeMessageState,
  updateCurrentChat,
  clearChatPanelState,
  updateSwitching,
} = chatPanelSlice.actions;

export default chatPanelSlice.reducer;
