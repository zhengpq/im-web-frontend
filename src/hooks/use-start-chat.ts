import React from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { ChatType } from '@/types/chat-panel';
import { getIndexdb } from '@/common/indexdb';
import { addChat, initCurrentChat, updateChat } from '@/redux/reducer/chat-panel';
import { IndexdbChatsRow } from '@/types/indexdb';
import { GroupMember } from '@/types/group';
import { FriendRow } from '@/types/friend';

const useStartChat = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const indexdb = getIndexdb();
  const startChat = async (
    chatId: string,
    chaName: string,
    chatUsers: GroupMember[] | FriendRow[],
    chatType: ChatType,
  ) => {
    const chat = await indexdb?.chats.get(chatId);
    if (chat) {
      chat.active_time = Date.now();
      await indexdb?.chats.update(chat.id, chat);
      dispatch(updateChat(chat));
      dispatch(initCurrentChat(chat));
    } else {
      const createdTime = Date.now();
      const newChat: IndexdbChatsRow = {
        id: chatId,
        name: chaName,
        type: chatType,
        users: chatUsers,
        unread_count: 0,
        last_message: null,
        active_time: createdTime,
        created_at: createdTime,
      };
      await indexdb?.chats.add(newChat);
      dispatch(addChat(newChat));
      dispatch(initCurrentChat(newChat));
    }
    navigate('/main/chats');
  };
  return {
    startChat,
  };
};

export default useStartChat;
