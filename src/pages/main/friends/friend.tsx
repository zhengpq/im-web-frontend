import React from 'react';
import { type FriendRow } from '@/types/friend';
import Avatar from '@/components/avatar';

const Friend: React.FC<FriendRow> = ({ avatar, username }) => {
  return (
    <div className="flex items-center justify-between px-16 py-12">
      <div className="flex items-center">
        <Avatar avatar={avatar} className="flex-none mr-8"></Avatar>
        <div className="text-base font-semibold text-tp-gray-900">{username}</div>
      </div>
    </div>
  );
};

export default Friend;
