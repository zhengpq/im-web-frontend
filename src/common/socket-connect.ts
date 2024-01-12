import socket from '@/socket';

const socketConnect = (userId: string) => {
  if (!socket.connected && userId) {
    socket.auth = { user_id: userId };
    socket.connect();
  }
};

export default socketConnect;
