import { FriendMessageRow } from '@/types/friend';
import { getIndexdb } from './indexdb';
import { store } from '@/redux/store';
import { updateCurrentChat } from '@/redux/reducer/chat-panel';
import { ChatType } from '@/types/chat-panel';
import { IndexdbChatsRow } from '@/types/indexdb';
import { addChat, updateChat } from '@/redux/reducer/chat-list';
import { addMessage } from '@/redux/reducer/message-list';

/**
 * 对获取到的新消息的处理：
 * 1、新消息入库
 * 2、针对每一个朋友的新消息进行判断
 * 3、首先判断该会话是否存在，如果不存在，新建一个会话，并更新会话的所有信息
 * 4、如果会话存在，那么更新对应会话的数据
 */
const handleNewFriendMessages = async (
  messages: FriendMessageRow | FriendMessageRow[],
  callback?: (chat: IndexdbChatsRow) => void,
) => {
  const messagesArray = Array.isArray(messages) ? messages : [messages];
  const indexdb = getIndexdb();
  // 新消息入库
  await indexdb?.friendMessages.bulkPut(messagesArray).catch((error) => {
    console.error(error);
  });
  const profile = store.getState().profile.value;
  const { currentChat } = store.getState().chatPanel.value;
  const messageNumber = messagesArray.length;
  const lastMessage = messagesArray[messageNumber - 1];
  const messageFromId = lastMessage.sender_id;
  const chat = await indexdb?.chats.get({ id: messageFromId });
  if (chat) {
    if (currentChat && messageFromId === currentChat.id) {
      store.dispatch(addMessage(messagesArray));
    } else {
      chat.unread_count += messageNumber;
      chat.active_time = lastMessage.created_at;
    }
    chat.last_message = lastMessage;
    await indexdb?.chats.update(chat.id, chat);
    store.dispatch(updateChat(chat));
    store.dispatch(updateCurrentChat(chat));
    if (callback) {
      callback(chat);
    }
  } else {
    const friend = await indexdb?.friends.get({
      user_id: profile.id,
      friend_id: lastMessage.sender_id,
    });
    if (!friend) return;
    const newChat: IndexdbChatsRow = {
      id: friend.friend_id,
      name: friend.username,
      type: ChatType.FRIEND,
      users: [friend],
      unread_count: messageNumber,
      last_message: lastMessage,
      active_time: lastMessage.created_at,
      created_at: Date.now(),
    };
    await indexdb?.chats.add(newChat);
    store.dispatch(addChat(newChat));
    if (callback) {
      callback(newChat);
    }
  }
};

export default handleNewFriendMessages;
