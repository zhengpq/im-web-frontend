import React from 'react';
import { FriendMessageRow } from '@/types/friend';
import { IndexdbGroupMessagesRow } from '@/types/indexdb';

const UpdateMessage: React.FC<FriendMessageRow | IndexdbGroupMessagesRow> = ({ content }) => {
  return (
    <div className="py-16 text-tp-gray-700 text-xs leading-4 text-center flex justify-center items-center">
      <div className="max-w-1/2">{content}</div>
    </div>
  );
};

export default UpdateMessage;
