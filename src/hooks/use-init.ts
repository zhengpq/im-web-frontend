import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { message } from 'antd';
import { useNetwork } from 'ahooks';
import socket from '../socket';
import { type RootState } from '../redux/store';
import { initProfile } from '@/init';
import { NETWORK_OFF_LINE_MESSAGE } from '@/const/message';
import socketConnect from '@/common/socket-connect';

const useInit = () => {
  const userId = useSelector((state: RootState) => state.profile.value.id);
  const { connecting } = useSelector((state: RootState) => state.socket.value);
  const networkState = useNetwork();
  const handleVisibilityChange = () => {
    if (document.visibilityState === 'visible') {
      // 切换回当前页面的时候需要查看是否已经断开连接，如果断开，需要重连
      if (!socket.connected) {
        // socket.connect();
        socketConnect(userId);
      }
    } else {
      console.log('离开当前选项卡');
    }
  };

  useEffect(() => {
    if (!networkState.online) {
      message.error(NETWORK_OFF_LINE_MESSAGE, 0);
    } else {
      message.destroy();
    }
  }, [networkState.online]);

  useEffect(() => {
    initProfile();
    document.body.id = 'body';
    window.addEventListener('error', (event) => {
      // 处理错误，例如记录错误日志、显示错误信息等
      console.error('An error occurred:', event.error);
    });
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  useEffect(() => {
    if (userId) {
      // socket.auth = { user_id: userId };
      // socket.connect();
      socketConnect(userId);
      return () => {
        socket.disconnect();
      };
    }
  }, [userId]);

  useEffect(() => {
    if (userId && !connecting) {
      message.error({
        content: '与服务器连接已断开，请刷新页面重试',
        duration: 0,
      });
      return () => {
        message.destroy();
      };
    }
  }, [userId, connecting]);
};

export default useInit;
