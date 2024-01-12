import { message as AntMessage } from 'antd';
import { addFriendRequest } from '@/redux/reducer/friend-request';
import { initFriends } from '@/redux/reducer/friends';
import { initGroups } from '@/redux/reducer/groups';
import { store } from '@/redux/store';
import { FriendDeleted, FriendNewMessageRow, FriendRequestRow, FriendRow } from '@/types/friend';
import { GroupNewMessageRow, GroupRow } from '@/types/group';
import { DexieClass, getIndexdb } from '@/common/indexdb';
import request from '@/common/request';
import handleNewFriendMessages from '@/common/handle-new-friend-messages';
import handleNewGroupMessages from '@/common/handle-new-group-messages';

interface NewFriendsParam {
  user_id: string;
  offline_time?: number;
}

interface NewGroupsParam {
  user_id: string;
  offline_time?: number;
}

// 为避免异地登录本地没有保存好友信息，好友直接拉取线上全部的好友信息
const initNewFriends = async (indexdb: DexieClass) => {
  const { id, offline_time } = store.getState().profile.value;
  if (id) {
    const params: NewFriendsParam = {
      user_id: id,
    };
    // 根据本地是否有好友数据来判断是否是登录新设备
    const localFriendsNum = await indexdb.friends.count();
    if (localFriendsNum !== 0) {
      params.offline_time = offline_time;
    }
    const { data: friendsData } = await request<FriendRow[]>({
      url: '/friends',
      params,
    });
    if (friendsData && friendsData.length > 0) {
      await indexdb.friends.bulkPut(friendsData).catch((error) => {
        console.error(error);
      });
      const friends = await indexdb.friends.where({ deleted: FriendDeleted.NOT_DELETED }).toArray();
      store.dispatch(initFriends(friends));
    }
  }
};

// 群聊同上
const initNewGroups = async (indexdb: DexieClass) => {
  const { id, offline_time } = store.getState().profile.value;
  if (id) {
    const params: NewGroupsParam = {
      user_id: id,
    };
    // 根据本地是否有好友数据来判断是否是登录新设备
    const localGroupsNum = await indexdb.groups.count();
    if (localGroupsNum !== 0) {
      params.offline_time = offline_time;
    }
    const { data: groupsData } = await request<GroupRow[]>({
      url: '/groups',
      params,
    });
    if (groupsData) {
      await indexdb.groups.bulkPut(groupsData).catch((error) => {
        console.error(error);
      });
      const groups = await indexdb.groups.toArray();
      store.dispatch(initGroups(groups));
    }
  }
};

const initNewFriendRequests = async (indexdb: DexieClass) => {
  const { id, offline_time } = store.getState().profile.value;
  if (id) {
    const { data: newFrienRequests } = await request<FriendRequestRow[]>({
      url: '/friendrequests',
      params: {
        receiver_id: id,
        offline_time,
      },
    });
    if (newFrienRequests) {
      indexdb.friendRequests.bulkPut(newFrienRequests).catch((error) => {
        console.error(error);
      });
      store.dispatch(addFriendRequest(newFrienRequests));
    }
  }
};

const initNewFriendMessages = async (indexdb: DexieClass) => {
  const { id, offline_time } = store.getState().profile.value;
  if (id) {
    const { data: newFriendMessages } = await request<FriendNewMessageRow[]>({
      url: 'friendmessages/new',
      params: {
        receiver_id: id,
        offline_time,
      },
    });
    if (newFriendMessages && newFriendMessages.length > 0) {
      Promise.all(
        newFriendMessages.map((item) => {
          return new Promise((resolve, reject) => {
            indexdb.friendMessages.bulkPut(item.messages).then(async () => {
              await handleNewFriendMessages(item.messages, resolve);
            });
          });
        }),
      )
        .then(() => {
          console.log('好友信息更新完毕');
        })
        .catch((error) => {
          console.error(error);
        });
    }
  }
};

const initNewGroupMessages = async (indexdb: DexieClass) => {
  const { id, offline_time } = store.getState().profile.value;
  if (id) {
    const { data: newGroupMessages } = await request<GroupNewMessageRow[]>({
      url: 'groupmessages/new',
      params: {
        user_id: id,
        offline_time,
      },
    });
    if (newGroupMessages && newGroupMessages.length > 0) {
      Promise.all(
        newGroupMessages.map((item) => {
          return new Promise((resolve, reject) => {
            indexdb.groupMessages.bulkPut(item.messages).then(async () => {
              await handleNewGroupMessages(item.messages, false, resolve);
            });
          });
        }),
      )
        .then(() => {
          console.log('群信息更新完毕');
        })
        .catch((error) => {
          console.error(error);
        });
    }
  }
};

const initNewData = async () => {
  const indexdb = getIndexdb();
  if (indexdb) {
    AntMessage.info({
      content: '数据同步中...',
      duration: 0,
    });
    await initNewFriends(indexdb);
    await initNewFriendRequests(indexdb);
    await initNewGroups(indexdb);
    await initNewFriendMessages(indexdb);
    await initNewGroupMessages(indexdb);
    AntMessage.destroy();
    AntMessage.success({
      content: '数据同步完成',
      duration: 1,
    });
  }
};

export default initNewData;
