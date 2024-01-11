import React from 'react';
import Avatar from '@/components/avatar';
import { type GroupRow } from '@/types/group';

const Group: React.FC<GroupRow> = ({ id, name, members }) => {
  const avatars = members.map((item) => item.avatar);

  return (
    <div className="flex items-center justify-between px-16 py-12">
      <div className="flex items-center">
        <Avatar avatar={avatars} className="flex-none mr-8"></Avatar>
        <div className="text-base font-semibold text-tp-gray-900">{name}</div>
      </div>
    </div>
  );
};

export default Group;
