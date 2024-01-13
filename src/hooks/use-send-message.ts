import React from 'react';
import { useSelector } from 'react-redux';
import { FriendMessageRow } from '@/types/friend';
import { GroupMessageRow } from '@/types/group';
import { IndexdbChatsRow } from '@/types/indexdb';
import { ChatType } from '@/types/chat-panel';
import socket from '@/socket';
import { RootState } from '@/redux/store';
import {
  SOCKET_EVENT_SEND_GROUP_MESSAGE,
  SOCKET_EVENT_SENT_FRIEND_MESSAGE,
} from '@/const/socket-event';

const useSendMessage = () => {
  const profile = useSelector((state: RootState) => state.profile.value);
  const sendMessage = (chat: IndexdbChatsRow, message: FriendMessageRow | GroupMessageRow) => {
    if (chat.type === ChatType.FRIEND) {
      socket.emit(SOCKET_EVENT_SENT_FRIEND_MESSAGE, {
        from: profile.id,
        to: chat.id,
        data: {
          message,
        },
      });
    }
    if (chat.type === ChatType.GROUP) {
      const uers = chat.users.map((item) => item.id);
      socket.emit(SOCKET_EVENT_SEND_GROUP_MESSAGE, {
        from: profile.id,
        to: chat.id,
        data: {
          message,
          targets: uers,
        },
      });
    }
  };
  return {
    sendMessage,
  };
};

export default useSendMessage;
