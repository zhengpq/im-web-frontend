import React from 'react';
import { useSelector } from 'react-redux';
import { type RootState } from '@/redux/store';
import { ChatType } from '@/types/chat-panel';
import FriendChatPanel from './friend-chat-panel';
import GroupChatPanel from './group-chat-panel';
import EmptyChat from '@/components/empty-chat';

const ChatPanel: React.FC = () => {
  const currentChat = useSelector((state: RootState) => state.chatPanel.value.currentChat);
  if (!currentChat) {
    return <EmptyChat></EmptyChat>;
  }
  if (currentChat.type === ChatType.FRIEND) {
    return <FriendChatPanel></FriendChatPanel>;
  }
  if (currentChat.type === ChatType.GROUP) {
    return <GroupChatPanel></GroupChatPanel>;
  }
};

export default ChatPanel;
