import { clearChatPanelState } from '@/redux/reducer/chat-panel';
import { clearFriendRequestState } from '@/redux/reducer/friend-request';
import { clearFriendsState } from '@/redux/reducer/friends';
import { clearGroupsState } from '@/redux/reducer/groups';
import { clearProfilestate } from '@/redux/reducer/profile';
import { store } from '@/redux/store';
import socket from '@/socket';

const useLogOut = () => {
  const initState = () => {
    // 断开与服务器的连接
    socket.disconnect();
    // 初始化 redux 数据
    store.dispatch(clearChatPanelState());
    store.dispatch(clearFriendRequestState());
    store.dispatch(clearFriendsState());
    store.dispatch(clearGroupsState());
    store.dispatch(clearProfilestate());
  };
  return {
    initState,
  };
};

export default useLogOut;
