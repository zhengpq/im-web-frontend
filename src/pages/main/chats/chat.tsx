import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { IndexdbChatsRow } from '@/types/indexdb';
import { getIndexdb } from '@/common/indexdb';
import { RootState } from '@/redux/store';
import {
  initCurrentChat,
  initMessageList,
  updateChat,
  updateSwitching,
} from '@/redux/reducer/chat-panel';
import ChatCard from './chat-card';
import { messageFormat } from '@/common/friend-message';
import { getDateHourAndMinute } from '@/utils/common';

const Chat: React.FC<IndexdbChatsRow> = ({ id, name, type, unread_count, users, last_message }) => {
  const indexdb = getIndexdb();
  const dispatch = useDispatch();
  const chatList = useSelector((state: RootState) => state.chatPanel.value.chatList);
  const currentChat = useSelector((state: RootState) => state.chatPanel.value.currentChat);
  const handleClick = async () => {
    dispatch(updateSwitching(true));
    const chat = chatList.find((item) => item.id === id);
    if (chat) {
      dispatch(initCurrentChat(chat));
      dispatch(initMessageList([]));
      // 更新相关用户的信息的状态为已读
      if (chat) {
        const chatCopy = { ...chat };
        chatCopy.unread_count = 0;
        await indexdb?.chats.update(chatCopy.id, chatCopy);
        dispatch(updateChat(chatCopy));
      }
    }
  };
  const avatars = users.map((item) => item.avatar);
  return (
    <ChatCard
      avatar={avatars}
      name={name}
      message={messageFormat(last_message)}
      active={currentChat?.id === id}
      count={unread_count}
      time={getDateHourAndMinute(last_message ? last_message.created_at : null)}
      onClick={handleClick}
    ></ChatCard>
  );
};

export default Chat;
