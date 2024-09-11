import { type PayloadAction, createSlice } from '@reduxjs/toolkit';
import { IndexdbChatsRow } from '@/types/indexdb';
import { type RootState } from '../store';

interface ChatPanelState {
  value: {
    switching: boolean;
    currentChat: IndexdbChatsRow | null;
  };
}

export const initialChatPanel: ChatPanelState = {
  value: {
    switching: false,
    currentChat: null,
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

export const { initCurrentChat, updateCurrentChat, clearChatPanelState, updateSwitching } =
  chatPanelSlice.actions;

export default chatPanelSlice.reducer;
