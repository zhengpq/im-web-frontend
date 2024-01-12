import React from 'react';
import { MessageAvatarPoi } from '@/types';
import { IndexdbGroupMessagesRow } from '@/types/indexdb';
import Message from '@/components/message';
import useGetUserData from '@/hooks/use-get-user-avatar';

interface GroupMessageProps {
  username?: string;
  avatar?: string;
  className?: string;
  avatarPoi: MessageAvatarPoi;
  message: IndexdbGroupMessagesRow;
}

const GroupMessage: React.FC<GroupMessageProps> = ({
  className,
  username,
  avatar,
  avatarPoi,
  message,
}) => {
  const { avatar: newAvatar, username: newUsername } = useGetUserData(message.sender_id, avatar);
  return (
    <Message
      className={className}
      username={username || newUsername}
      avatar={avatar || newAvatar}
      avatarPoi={avatarPoi}
      message={message}
    ></Message>
  );
};

export default GroupMessage;
