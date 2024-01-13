import { useDispatch } from 'react-redux';
import { isEqual } from 'lodash';
import request from '@/common/request';
import { FriendRow } from '@/types/friend';
import { getIndexdb } from '@/common/indexdb';
import { initCurrentChat, updateChat } from '@/redux/reducer/chat-panel';
import { updateFriend } from '@/redux/reducer/friends';

const useFriendDiff = () => {
  const dispatch = useDispatch();
  const friendDiff = async (friendId: string, userId: string) => {
    const { data } = await request<FriendRow>({
      url: 'friends/exist',
      params: {
        friend_id: friendId,
        user_id: userId,
      },
    });
    if (data) {
      const indexdb = getIndexdb();
      const localFriend = await indexdb?.friends.get(friendId);
      if (!isEqual(data, localFriend)) {
        await indexdb?.friends.update(data.id, data);
        dispatch(updateFriend(data));
        indexdb?.chats.get(friendId).then(async (chatValue) => {
          if (!chatValue) return;
          const chatCopy = {
            ...chatValue,
          };
          chatCopy.name = data.username;
          chatCopy.users = [data];
          await indexdb.chats.update(friendId, chatCopy);
          dispatch(updateChat(chatCopy));
          dispatch(initCurrentChat(chatCopy));
        });
      }
      return data;
    }
    return null;
  };
  return {
    friendDiff,
  };
};

export default useFriendDiff;
