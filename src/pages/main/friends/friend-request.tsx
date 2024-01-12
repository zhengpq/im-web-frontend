import React from 'react';
import { Button } from 'antd';
import { type User } from '../../../types/user';
import socket from '../../../socket';
import {
  SOCKET_EVENT_FRIEND_REQUEST_RECEIVED,
  SOCKET_EVENT_FRIEND_REQUEST_REJECT,
} from '../../../const/socket-event';
import { FriendRequestStatus, type FriendRequestRow } from '../../../types/friend';
import useWrapSWR from '@/hooks/use-init-swr';
import Avatar from '@/components/avatar';

const FriendRequest: React.FC<FriendRequestRow> = ({
  id,
  sender_id: senderId,
  receiver_id: receiverId,
  status,
  message,
  updated_at,
}) => {
  const { data, isLoading } = useWrapSWR<User>(`/users/id/${senderId}`);

  const handleReceive = async () => {
    socket.emit(SOCKET_EVENT_FRIEND_REQUEST_RECEIVED, {
      from: receiverId,
      to: senderId,
      data: {
        requestId: id,
      },
    });
  };

  const handleReject = () => {
    socket.emit(SOCKET_EVENT_FRIEND_REQUEST_REJECT, {
      from: receiverId,
      to: senderId,
      data: {
        requestId: id,
      },
    });
  };

  let content = null;
  if (isLoading) {
    content = (
      <div className="flex items-center px-16 py-12">
        <div className="rounded-full bg-neutral-200 w-40 h-40 mr-12"></div>
        <div className="w-100 h-20 bg-neutral-200"></div>
      </div>
    );
  }
  if (data?.data) {
    const { avatar, username } = data.data;
    content = (
      <div className="flex items-center justify-between px-16 py-12">
        <div className="flex items-start">
          <Avatar className="mr-8 flex-none" avatar={avatar}></Avatar>
          <div className="text-sm">
            <div className="font-semibold text-tp-gray-900 mb-4">{username}</div>
            <div className="text-tp-gray-800">{message}</div>
          </div>
        </div>
        <div className="text-sm text-tp-gray-800">
          {status === FriendRequestStatus.SENDING && (
            <div className="flex items-center ">
              <Button type="primary" className="mr-12" onClick={handleReceive}>
                同意
              </Button>
              <Button type="text" onClick={handleReject}>
                拒绝
              </Button>
            </div>
          )}
          {status === FriendRequestStatus.RECEIVED && <div>已通过</div>}
          {status === FriendRequestStatus.REJECT && <div>已拒绝</div>}
        </div>
      </div>
    );
  }
  return <div className="w-full">{content}</div>;
};

export default FriendRequest;
