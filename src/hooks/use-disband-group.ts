import React from 'react';
import { Modal } from 'antd';
import { useSelector } from 'react-redux';
import socket from '@/socket';
import { SOCKET_EVENT_DISBAND_GROUP } from '@/const/socket-event';
import { RootState } from '@/redux/store';

const { confirm } = Modal;

const useDisbandGroup = () => {
  const profile = useSelector((state: RootState) => state.profile.value);
  const disbandGroup = (groupId: string, content: React.ReactNode) => {
    confirm({
      content,
      okText: '确定',
      cancelText: '取消',
      styles: {
        body: { paddingTop: '16px' },
      },
      onOk: async () => {
        socket.emit(SOCKET_EVENT_DISBAND_GROUP, {
          from: profile.id,
          to: '',
          data: {
            group_id: groupId,
          },
        });
      },
    });
  };
  return {
    disbandGroup,
  };
};

export default useDisbandGroup;
