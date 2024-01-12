import React, { type SyntheticEvent, useState } from 'react';
import { Input, Modal } from 'antd';
import { useSelector } from 'react-redux';
import { type UserOnlyData } from '@/types/user';
import socket from '@/socket';
import { SOCKET_EVENT_FRIEND_REQUEST } from '@/const/socket-event';
import { type RootState } from '@/redux/store';
import { FRIEND_REQUEST_HELLO_MESSAGE } from '@/const/message';
import Avatar from '@/components/avatar';

const FriendsSearchItem: React.FC<UserOnlyData> = ({ username, avatar, id }) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [message, setMessage] = useState(FRIEND_REQUEST_HELLO_MESSAGE);
  const { id: senderID } = useSelector((state: RootState) => state.profile.value);
  const handleClick = () => {
    setIsModalVisible(true);
  };
  const handleCancel = () => {
    setIsModalVisible(false);
  };
  const handleOK = () => {
    const payload = {
      from: senderID,
      to: id,
      data: {
        message,
      },
    };
    socket.emit(SOCKET_EVENT_FRIEND_REQUEST, payload);
    setIsModalVisible(false);
  };
  const handleMessageChange = (event: SyntheticEvent<HTMLInputElement>) => {
    const { value } = event.currentTarget;
    setMessage(value);
  };
  return (
    <>
      <div
        className="flex items-center justify-between hover:bg-tp-gray-100 px-12 h-42 text-tp-gray-800 cursor-pointer"
        onClick={handleClick}
      >
        <div className="flex items-center min-w-0">
          <Avatar avatar={avatar} size={28} className="mr-8 flex-none"></Avatar>
          <div className="flex-1 overflow-hidden">{username}</div>
        </div>
      </div>
      <Modal
        title="添加好友"
        open={isModalVisible}
        onCancel={handleCancel}
        onOk={handleOK}
        centered
        cancelText="取消"
        okText="确定"
      >
        <div className="py-20">
          <div className="flex items-center mb-20">
            <Avatar avatar={avatar} size={40} className="mr-12"></Avatar>
            <div>{username}</div>
          </div>
          <div className="flex items-center">
            <div className="mr-16 flex-none">验证信息</div>
            <Input
              placeholder="可输入朋友验证信息"
              value={message}
              onChange={handleMessageChange}
            ></Input>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default FriendsSearchItem;
