import React from 'react';
import { useSelector } from 'react-redux';
import { Receipt } from 'phosphor-react';
import { List } from 'antd';
import { RootState } from '@/redux/store';
import FriendRequest from './friend-request';

interface FriendRequestListProps {
  className?: string;
}

const FriendRequestList: React.FC<FriendRequestListProps> = ({ className }) => {
  const friendRequests = useSelector((state: RootState) => state.friendRequest.value);
  let content = null;
  if (friendRequests.length === 0) {
    content = (
      <div className="flex flex-col justify-center items-center w-full h-full text-tp-gray-600">
        <Receipt size={60} weight="light" />
        <div className="mt-18 text-lg">暂无好友添加请求</div>
      </div>
    );
  }
  if (friendRequests.length > 0) {
    content = (
      <List bordered={false}>
        {friendRequests.length > 0 &&
          friendRequests.map((item) => {
            return item !== null ? (
              <List.Item>
                <FriendRequest key={item.id} {...item}></FriendRequest>
              </List.Item>
            ) : null;
          })}
      </List>
    );
  }
  return <div className={`p-24 ${className} w-full h-full`}>{content}</div>;
};

export default FriendRequestList;
