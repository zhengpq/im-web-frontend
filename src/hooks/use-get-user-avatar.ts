import { useCallback, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { User } from '@/types/user';
import { getIndexdb } from '@/common/indexdb';
import request from '@/common/request';

const useGetUserAvatar = (id: string, avatar?: string, username?: string) => {
  const { currentChat } = useSelector((state: RootState) => state.chatPanel.value);
  const [userData, setUserData] = useState({
    avatar,
    username,
  });
  const indexdb = getIndexdb();
  const getLocalData = useCallback(async () => {
    const user = await indexdb?.users.get(id);
    if (user) {
      return user;
    }
    return null;
  }, [id]);
  const requestData = useCallback(async () => {
    const { data: user } = await request<User>({
      url: `/users/id/${id}`,
    });
    const localData = await getLocalData();
    if (user && !localData) {
      await indexdb?.users.add(user);
      return user;
    }
    return null;
  }, [id]);
  const getData = async () => {
    const memberData = currentChat?.users.find((item) => item.id === id);
    if (memberData) {
      setUserData({
        avatar: memberData.avatar,
        username: memberData.username,
      });
      return;
    }
    const localData = await getLocalData();
    if (localData) {
      setUserData({
        avatar: localData.avatar,
        username: localData.avatar,
      });
      return;
    }
    const remoteData = await requestData();
    if (remoteData) {
      setUserData({
        avatar: remoteData.avatar,
        username: remoteData.avatar,
      });
    }
  };
  useEffect(() => {
    if (!avatar) {
      getData();
    }
  }, [id, avatar, username]);
  return userData;
};

export default useGetUserAvatar;
