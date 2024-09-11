import { initFriendRequests } from '@/redux/reducer/friend-request';
import { initFriends } from '@/redux/reducer/friends';
import { initGroups } from '@/redux/reducer/groups';
import { store } from '@/redux/store';
import { FriendDeleted, FriendRequestStatus } from '@/types/friend';
import { DexieClass } from '@/common/indexdb';
import { initChatList } from '@/redux/reducer/chat-list';

const initFriendRequestsData = async (indexdb: DexieClass) => {
  const { id } = store.getState().profile.value;
  const friendRequestsSending = await indexdb.friendRequests
    .where({ status: FriendRequestStatus.SENDING, receiver_id: id })
    .toArray();
  const friendRequestNotSending = await indexdb.friendRequests
    .filter((item) => item.status !== FriendRequestStatus.SENDING && item.receiver_id === id)
    .toArray();
  friendRequestNotSending.sort((a, b) => b.updated_at - a.updated_at);
  store.dispatch(initFriendRequests([...friendRequestsSending, ...friendRequestNotSending]));
};

const initChatsData = async (indexdb: DexieClass) => {
  // await indexdb.chats.toCollection().modify({ active_time: Date.now() });
  const chatsData = await indexdb.chats.toArray();
  store.dispatch(initChatList(chatsData));
};

const initFriendsData = async (indexdb: DexieClass) => {
  const friendsData = await indexdb.friends.where({ deleted: FriendDeleted.NOT_DELETED }).toArray();
  store.dispatch(initFriends(friendsData));
};

const initGroupsData = async (indexdb: DexieClass) => {
  const groups = await indexdb.groups.toArray();
  store.dispatch(initGroups(groups));
};

const initData = async (indexdb: DexieClass) => {
  await initFriendRequestsData(indexdb);
  await initFriendsData(indexdb);
  await initChatsData(indexdb);
  await initGroupsData(indexdb);
};

export default initData;
