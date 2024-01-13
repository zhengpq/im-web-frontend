import { configureStore } from '@reduxjs/toolkit';
import profileReducer from './reducer/profile';
import friendRequestReducer from './reducer/friend-request';
import friendsReducer from './reducer/friends';
import chatPanelReducer from './reducer/chat-panel';
import groupsReducer from './reducer/groups';
import socketReducer from './reducer/socket';

export const store = configureStore({
  reducer: {
    socket: socketReducer,
    profile: profileReducer,
    friendRequest: friendRequestReducer,
    friends: friendsReducer,
    chatPanel: chatPanelReducer,
    groups: groupsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
