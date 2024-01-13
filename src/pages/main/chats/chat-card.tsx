import React from 'react';
import Avatar from '@/components/avatar';
import BadgeWrap from '@/components/badge-wrap';
import ListCard from '@/components/list-card';

interface ChatCardProps {
  active?: boolean;
  avatar: string[];
  name: React.ReactNode;
  message: string;
  time?: string;
  count?: number;
  overflowCount?: number;
  className?: string;
  onClick?: () => void;
  children?: React.ReactNode;
}

const ChatCard: React.FC<ChatCardProps> = ({
  active = false,
  avatar,
  name,
  message,
  time,
  count,
  onClick,
  className,
}) => {
  return (
    <ListCard active={active}>
      <div className="p-16 flex items-center relative" onClick={onClick}>
        <div className="flex-1 flex items-start min-w-0">
          <Avatar avatar={avatar}></Avatar>
          <div className="ml-8 flex-1 overflow-hidden overflow-ellipsis whitespace-nowrap">
            <div className="text-base font-semibold text-black">{name}</div>
            <div className="text-sm text-tp-gray-800 overflow-hidden overflow-ellipsis whitespace-nowrap">
              {' '}
              {active ? '' : message}
            </div>
          </div>
        </div>
        {(!!time || !!count) && (
          <div className="flex-none relative">
            <div className="flex flex-col justify-end items-end">
              <div className="text-xs text-tp-gray-700 font-medium mb-8">{time}</div>
              {!!count && <BadgeWrap count={count}></BadgeWrap>}
            </div>
          </div>
        )}
      </div>
    </ListCard>
  );
};

export default ChatCard;
