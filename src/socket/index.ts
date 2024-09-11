import { io } from 'socket.io-client';
import { message as AntMessage } from 'antd';
import {
  SOCKET_EVENT_ADD_GROUP_MEMBERS,
  SOCKET_EVENT_CONNECT,
  SOCKET_EVENT_CONNECT_ERROR,
  SOCKET_EVENT_CREATE_GROUP,
  SOCKET_EVENT_DELETE_FRIEND,
  SOCKET_EVENT_DELETE_GROUP_MEMBERS,
  SOCKET_EVENT_DISBAND_GROUP,
  SOCKET_EVENT_DISCONNECT,
  SOCKET_EVENT_FRIEND_REQUEST,
  SOCKET_EVENT_FRIEND_REQUEST_RECEIVED,
  SOCKET_EVENT_FRIEND_REQUEST_REJECT,
  SOCKET_EVENT_QUIT_GROUP,
  SOCKET_EVENT_SEND_GROUP_MESSAGE,
  SOCKET_EVENT_SENT_FRIEND_MESSAGE,
  SOCKET_EVENT_UPDATE_GROUP_NAME,
} from '../const/socket-event';
import { store } from '../redux/store';
import {
  FriendRequestStatus,
  type FriendReceiveFinishData,
  type FriendRequestData,
  FriendRow,
  FriendDeletedData,
} from '../types/friend';
import {
  addFriendRequest,
  deleteFriendRequestBySenderId,
  updateFriendRequestState,
} from '../redux/reducer/friend-request';
import { addFriend, deleteFriendByFriendId } from '../redux/reducer/friends';
import { type FriendMessageRow } from '@/types/friend';
import { updateCurrentChat } from '@/redux/reducer/chat-panel';
import { MessageState, MessageType } from '@/types';
import { ChatType } from '@/types/chat-panel';
import {
  GroupAddNewMembers,
  type CreateGroupData,
  type GroupMessageRow,
  GroupUpdateType,
  GroupRow,
  GroupDeleteNewMembers,
} from '@/types/group';
import browserRouter from '@/router';
import { SocketValue } from '@/types/socket';
import { ErrorCode, errorMessage } from '@/const/error-code';
import { getIndexdb } from '@/common/indexdb';
import { FRIEND_HELLO_MESSAGE } from '@/const/message';
import {
  IndexdbChatsRow,
  IndexdbFriendMessagesRow,
  IndexdbGroupMessagesRow,
} from '@/types/indexdb';
import { initNewData } from '@/init';
import handleNewFriendMessages from '@/common/handle-new-friend-messages';
import handleNewGroupMessages from '@/common/handle-new-group-messages';
import uuidv4 from '@/utils/uuid';
import { addGroup, deleteGroup, updateGroup } from '@/redux/reducer/groups';
import { changeConnectingState } from '@/redux/reducer/socket';
import { DOMAIN } from '@/const/api';
import { addChat, updateChat } from '@/redux/reducer/chat-list';
import { ackMessage } from '@/redux/reducer/message-list';

const socket = io(`${DOMAIN}`, {
  autoConnect: false,
  reconnection: true,
  reconnectionDelay: 10000,
  reconnectionAttempts: Infinity,
});

socket.on(SOCKET_EVENT_CONNECT, () => {
  console.log('websocket connected', socket.connected);
  initNewData();
  store.dispatch(changeConnectingState(true));
});

socket.on(SOCKET_EVENT_DISCONNECT, () => {
  console.log('websocket disconnected');
  store.dispatch(changeConnectingState(false));
});

socket.on(SOCKET_EVENT_CONNECT_ERROR, (error) => {
  console.log('websocket disconnected error', error);
  store.dispatch(changeConnectingState(false));
});

socket.on(SOCKET_EVENT_FRIEND_REQUEST, (value: SocketValue<FriendRequestData>) => {
  const userId = store.getState().profile.value.id;
  const {
    code,
    data: { data: friendRequestData, from },
  } = value;
  // 首先判断是否是本人发起的
  if (from === userId) {
    if (code === ErrorCode.FRIEND_REQUEST_FAILED) {
      AntMessage.error(errorMessage[code]);
      return;
    }
    if (friendRequestData === null) {
      AntMessage.info('已发送过好友请求，对方确认中');
    } else {
      AntMessage.success('好友申请已发送！');
    }
  } else {
    const indexdb = getIndexdb();
    if (friendRequestData !== null) {
      indexdb?.friendRequests
        .add(friendRequestData)
        .then(() => {
          store.dispatch(addFriendRequest(friendRequestData));
        })
        .catch((error) => {
          console.error(error);
        });
    }
  }
});

socket.on(
  SOCKET_EVENT_FRIEND_REQUEST_RECEIVED,
  async (value: SocketValue<FriendReceiveFinishData>) => {
    const { data, code } = value;
    // 如果同意失败，直接提示
    if (code === ErrorCode.FRIEND_REQUEST_RECEIVED_FAILED) {
      await AntMessage.error(errorMessage[ErrorCode.FRIEND_REQUEST_RECEIVED_FAILED]);
      return;
    }

    // 如果通过成功，更新状态，添加好友，发送第一条消息
    const {
      data: { request_id, friend },
      from,
      to,
    } = data;
    const indexdb = getIndexdb();
    const userId = store.getState().profile.value.id;
    if (userId === from && friend) {
      AntMessage.success('添加好友成功');
      try {
        await indexdb?.friendRequests.update(request_id, { status: FriendRequestStatus.RECEIVED });
        await indexdb?.friends.add(friend);
        store.dispatch(
          updateFriendRequestState({ id: request_id, status: FriendRequestStatus.RECEIVED }),
        );
        store.dispatch(addFriend(friend));
        // 通过好友申请之后，首先新建一个对话，然后发送第一条消息
        const ackId = uuidv4();
        const messageData: IndexdbFriendMessagesRow = {
          id: ackId,
          ack_id: ackId,
          sender_id: userId,
          receiver_id: to,
          type: MessageType.TEXT,
          state: MessageState.SENDING,
          content: FRIEND_HELLO_MESSAGE,
          created_at: Date.now(),
        };
        const chatData: IndexdbChatsRow = {
          id: to,
          name: friend.username,
          type: ChatType.FRIEND,
          users: [friend] as FriendRow[],
          unread_count: 0,
          last_message: messageData,
          active_time: Date.now(),
          created_at: Date.now(),
        };
        const localChat = indexdb?.chats.get(chatData.id);
        if (localChat) {
          await indexdb?.chats.delete(chatData.id);
        }
        await indexdb?.chats.add(chatData);
        await indexdb?.friendMessages.add(messageData);
        store.dispatch(addChat(chatData));
        socket.emit(SOCKET_EVENT_SENT_FRIEND_MESSAGE, {
          from: userId,
          to,
          data: {
            message: messageData,
          },
        });
        await browserRouter.navigate('/main/chats');
      } catch (error) {
        console.error(error);
      }
    }
    if (userId === to && friend) {
      try {
        await indexdb?.friendRequests.where({ sender_id: from }).delete();
        await indexdb?.friends.add(friend);
        store.dispatch(addFriend(friend));
        store.dispatch(deleteFriendRequestBySenderId(from));
      } catch (error) {
        console.error(error);
      }
    }
  },
);

socket.on(
  SOCKET_EVENT_FRIEND_REQUEST_REJECT,
  async (value: SocketValue<{ request_id: string }>) => {
    const { data, code } = value;
    if (code === ErrorCode.FRIEND_REQUEST_REJECT_FAILED) {
      return AntMessage.error(errorMessage[ErrorCode.FRIEND_REQUEST_REJECT_FAILED]);
    }
    const indexdb = getIndexdb();
    const { data: requestData } = data;
    indexdb?.friendRequests
      .update(requestData.request_id, { status: FriendRequestStatus.REJECT })
      .then(() => {
        store.dispatch(
          updateFriendRequestState({
            id: requestData.request_id,
            status: FriendRequestStatus.REJECT,
          }),
        );
      })
      .catch((error) => {
        console.error(error);
      });
  },
);

socket.on(SOCKET_EVENT_DELETE_FRIEND, async (value: SocketValue<FriendDeletedData>) => {
  const {
    code,
    data: { from, to, data: deleteFriendData },
  } = value;
  const profile = store.getState().profile.value;
  const indexdb = getIndexdb();
  if (code === ErrorCode.FRIEND_DELETE_FAILED && from === profile.id) {
    AntMessage.error(errorMessage[code]);
  } else {
    if (from === profile.id) {
      const deleteNum = await indexdb?.friends.where({ friend_id: to }).delete();
      if (deleteNum) {
        store.dispatch(deleteFriendByFriendId(to));
        AntMessage.success('好友已删除');
      }
    }
    if (to === profile.id) {
      const deleteNum = await indexdb?.friends.where({ friend_id: from }).delete();
      if (deleteNum) {
        store.dispatch(deleteFriendByFriendId(from));
      }
    }
  }
});

socket.on(SOCKET_EVENT_SENT_FRIEND_MESSAGE, async (value: SocketValue<FriendMessageRow>) => {
  const currentUserId = store.getState().profile.value.id;
  const { currentChat } = store.getState().chatPanel.value;
  const indexdb = getIndexdb();
  const { data, code } = value;
  const { from, data: message, to } = data;
  const { ack_id } = message;
  /**
   * 如果是当前用户发送的消息：
   * 1、更新本地消息的状态
   * 2、如果这条信息是当前对话的最后一条信息，更新会话的数据
   */
  if (from === currentUserId) {
    const chatId = from === currentUserId ? to : from;
    const chat = await indexdb?.chats.get({ id: chatId });
    const messageData = {
      ...message,
      state: !code ? MessageState.SUCCESS : MessageState.FAILED,
    };
    await indexdb?.friendMessages.where({ ack_id }).modify(messageData);
    store.dispatch(ackMessage(messageData));
    if (chat && chat.last_message?.ack_id === ack_id) {
      chat.last_message = messageData;
      if (currentChat?.id !== chat.id) {
        chat.active_time = message.created_at;
      }
      await indexdb?.chats.update(chat.id, chat);
      store.dispatch(updateChat(chat));
      store.dispatch(updateCurrentChat(chat));
    }
  } else {
    await handleNewFriendMessages(message);
  }
});

socket.on(SOCKET_EVENT_CREATE_GROUP, async (value: SocketValue<CreateGroupData>) => {
  const indexdb = getIndexdb();
  const {
    code,
    data: { data: groupData, from },
  } = value;
  const profile = store.getState().profile.value;
  if (code === ErrorCode.GROUP_CREATE_FAILED) {
    AntMessage.error(errorMessage[code]);
  } else {
    /**
     * 如果新建群聊成功
     * 1、首先将群聊的数据入库
     * 2、新建一个群聊回话
     * 3、判断是否是由当前用户发起的群聊，如果是，那么发送第一条消息
     */
    const { group, first_message } = groupData;
    const { id, name, members } = group;
    const groupChat: IndexdbChatsRow = {
      id,
      name,
      type: ChatType.GROUP,
      users: members,
      unread_count: id === from ? 1 : 0,
      last_message: first_message,
      active_time: Date.now(),
      created_at: Date.now(),
    };
    await indexdb?.groups.add(group);
    await indexdb?.chats.add(groupChat);
    store.dispatch(addChat(groupChat));
    store.dispatch(addGroup(group));
    if (profile.id === from) {
      AntMessage.success('新建群聊成功！');
      const targets = members.map((item) => item.id);
      socket.emit(SOCKET_EVENT_SEND_GROUP_MESSAGE, {
        from: id,
        to: id,
        data: {
          message: first_message,
          targets,
        },
      });
    }
  }
});

socket.on(SOCKET_EVENT_SEND_GROUP_MESSAGE, async (value: SocketValue<GroupMessageRow>) => {
  console.log('paki SOCKET_EVENT_SEND_GROUP_MESSAGE', value);
  const profile = store.getState().profile.value;
  const { currentChat } = store.getState().chatPanel.value;
  const indexdb = getIndexdb();
  const {
    code,
    data: { to, data: message, from },
  } = value;
  const { ack_id } = message;
  /**
   * 如果是当前用户发出的消息：
   * 1、更新本地消息的状态
   * 2、如果这条信息是会话的最后一条信息，更新对应会话的数据
   */
  if (from === profile.id) {
    const chatId = message.group_id;
    const chat = await indexdb?.chats.get({ id: chatId });
    const messageData = {
      ...message,
      state: !code ? MessageState.SUCCESS : MessageState.FAILED,
    };
    await indexdb?.groupMessages.where({ ack_id }).modify(messageData);
    store.dispatch(ackMessage(messageData));
    if (chat && chat.last_message?.ack_id === ack_id) {
      chat.last_message = message;
      if (currentChat?.id !== chat.id) {
        chat.active_time = message.created_at;
      }
      await indexdb?.chats.update(chat.id, chat);
      store.dispatch(updateChat(chat));
      store.dispatch(updateCurrentChat(chat));
    }
  } else {
    await handleNewGroupMessages(message);
  }
});

/**
 * 添加新用户
 *
 * 如果是被添加的用户：
 * 1、本地新增 group 数据
 * 2、本地新增一个 group 对应的会话
 * 3、本地 group message 新增一条加入群聊的消息
 * 4、更新对应的 redux 数据
 *
 * 如果不是被添加的用户：
 * 1、更新本地 group 数据
 * 2、本地 group message 新增一条新增成员的消息
 * 3、更新本地 chat 数据
 * 4、更新对应的 redux 数据
 */
socket.on(SOCKET_EVENT_ADD_GROUP_MEMBERS, async (value: SocketValue<GroupAddNewMembers>) => {
  const profile = store.getState().profile.value;
  const indexdb = getIndexdb();
  const {
    code,
    data: { from, data: newMembersData },
  } = value;
  if (code === ErrorCode.GROUP_ADD_MEMBERS_FAILED && from === profile.id) {
    AntMessage.error(errorMessage[code]);
  } else {
    const groupData = newMembersData.group_data;
    const newUsers = newMembersData.new_users;
    const isNew = newUsers.findIndex((item) => item.id === profile.id) !== -1;
    const groupMessage: IndexdbGroupMessagesRow = {
      id: uuidv4(),
      ack_id: uuidv4(),
      sender_id: '',
      group_id: groupData.id,
      type: MessageType.TEXT,
      content: '',
      state: MessageState.SUCCESS,
      update_type: GroupUpdateType.ADD_NEW_MEMBERS,
      created_at: Date.now(),
      updated_at: Date.now(),
    };
    if (isNew) {
      const messageContent = `你已加入 ${groupData.name} 群聊`;
      groupMessage.content = messageContent;
      await indexdb?.groups.put(groupData);
      await handleNewGroupMessages(groupMessage, true);
      store.dispatch(addGroup(groupData));
    } else {
      const messageContent = `${newUsers.map((item) => item.username).join('、')} 加入群聊`;
      groupMessage.content = messageContent;
      await indexdb?.groups.update(groupData.id, groupData);
      await handleNewGroupMessages(groupMessage, true);
      store.dispatch(updateGroup(groupData));
    }
  }
});

socket.on(SOCKET_EVENT_DELETE_GROUP_MEMBERS, async (value: SocketValue<GroupDeleteNewMembers>) => {
  const profile = store.getState().profile.value;
  const indexdb = getIndexdb();
  const {
    code,
    data: {
      from,
      data: { group_data: group, deleted_users: deletedUsers },
    },
  } = value;
  if (code === ErrorCode.GROUP_DELETE_MEMBERS_FAILED && from === profile.id) {
    AntMessage.error(errorMessage[code]);
  } else {
    const isDeleted = deletedUsers.includes(profile.id);
    const groupMessage: IndexdbGroupMessagesRow = {
      id: uuidv4(),
      ack_id: uuidv4(),
      sender_id: '',
      group_id: group.id,
      type: MessageType.TEXT,
      content: '',
      state: MessageState.SUCCESS,
      update_type: GroupUpdateType.DELETE_MEMBER,
      created_at: Date.now(),
      updated_at: Date.now(),
    };
    if (isDeleted) {
      groupMessage.content = '你已被移出当前群聊';
      await indexdb?.groups.delete(group.id);
      store.dispatch(deleteGroup(group.id));
    } else {
      const localGroup = await indexdb?.groups.get(group.id);
      const deletedUsersNames = deletedUsers.map((id) => {
        const member = localGroup?.members.find((item) => item.id === id);
        if (member) {
          return member.username;
        }
        return '';
      });
      groupMessage.content = `${deletedUsersNames.join('、')} 被移出群聊`;
      await indexdb?.groups.update(group.id, group);
      store.dispatch(updateGroup(group));
    }
    await handleNewGroupMessages(groupMessage, true);
  }
});

socket.on(SOCKET_EVENT_QUIT_GROUP, async (value: SocketValue<GroupDeleteNewMembers>) => {
  const profile = store.getState().profile.value;
  const indexdb = getIndexdb();
  const {
    code,
    data: {
      from,
      data: { group_data: group, deleted_users: deletedUsers },
    },
  } = value;
  const groupMessage: IndexdbGroupMessagesRow = {
    id: uuidv4(),
    ack_id: uuidv4(),
    sender_id: '',
    group_id: group.id,
    type: MessageType.TEXT,
    content: '',
    state: MessageState.SUCCESS,
    update_type: GroupUpdateType.QUIT_GROUP,
    created_at: Date.now(),
    updated_at: Date.now(),
  };
  const isQuit = from === profile.id;
  if (code === ErrorCode.GROUP_QUIT_FAILED && isQuit) {
    AntMessage.error(errorMessage[code]);
  } else if (isQuit) {
    groupMessage.content = '你已退出群聊';
    await indexdb?.groups.delete(group.id);
    store.dispatch(deleteGroup(group.id));
  } else {
    const localGroup = await indexdb?.groups.get(group.id);
    const deletedUsersNames = deletedUsers.map((id) => {
      const member = localGroup?.members.find((item) => item.id === id);
      if (member) {
        return member.username;
      }
      return '';
    });
    groupMessage.content = `${deletedUsersNames.join('、')} 已退出群聊`;
    await indexdb?.groups.update(group.id, group);
    store.dispatch(updateGroup(group));
  }
  await handleNewGroupMessages(groupMessage, true);
});

socket.on(SOCKET_EVENT_DISBAND_GROUP, async (value: SocketValue<{ group_id: string }>) => {
  const profile = store.getState().profile.value;
  const indexdb = getIndexdb();
  const {
    code,
    data: {
      from,
      data: { group_id },
    },
  } = value;
  const groupMessage: IndexdbGroupMessagesRow = {
    id: uuidv4(),
    ack_id: uuidv4(),
    sender_id: '',
    group_id,
    type: MessageType.TEXT,
    content: '',
    state: MessageState.SUCCESS,
    update_type: GroupUpdateType.DISBAND_GROUP,
    created_at: Date.now(),
    updated_at: Date.now(),
  };
  const isManager = from === profile.id;
  if (code === ErrorCode.GROUP_QUIT_FAILED && isManager) {
    AntMessage.error(errorMessage[code]);
  } else {
    groupMessage.content = '该群聊已被解散';
    await indexdb?.groups.delete(group_id);
    store.dispatch(deleteGroup(group_id));
    await handleNewGroupMessages(groupMessage, true);
  }
});

socket.on(SOCKET_EVENT_UPDATE_GROUP_NAME, async (value: SocketValue<{ group: GroupRow }>) => {
  const profile = store.getState().profile.value;
  const indexdb = getIndexdb();
  const {
    code,
    data: {
      from,
      data: { group },
    },
  } = value;
  console.log('paki SOCKET_EVENT_UPDATE_GROUP_NAME', group);
  if (code === ErrorCode.GROUP_UPDATE_NAME_FAILED && from === profile.id) {
    AntMessage.error(errorMessage[code]);
  } else {
    const groupMessage: IndexdbGroupMessagesRow = {
      id: uuidv4(),
      ack_id: uuidv4(),
      sender_id: '',
      group_id: group.id,
      type: MessageType.TEXT,
      content: `群聊名称已更新为 ${group.name}`,
      state: MessageState.SUCCESS,
      update_type: GroupUpdateType.UPDATE_NAME,
      created_at: Date.now(),
      updated_at: Date.now(),
    };
    await indexdb?.groups.update(group.id, group).catch((error) => {
      console.error('updategroup', group.name, error);
    });
    await handleNewGroupMessages(groupMessage, true);
    store.dispatch(updateGroup(group));
  }
});

socket.on(SOCKET_EVENT_DISCONNECT, function (reason, details) {
  console.log(`websocket disconnected; reason: ${reason}; details: ${details}`);
});

socket.on(SOCKET_EVENT_CONNECT_ERROR, function (error) {
  console.log(`websocket disconnected; error: ${error}`);
});

export default socket;
