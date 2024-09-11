import { GroupRow } from '@/types/group';
import { IndexdbChatsRow, IndexdbGroupMessagesRow } from '@/types/indexdb';
import { getIndexdb } from './indexdb';
import { store } from '@/redux/store';
import { updateCurrentChat } from '@/redux/reducer/chat-panel';
import request from './request';
import { ChatType } from '@/types/chat-panel';
import { addChat, updateChat } from '@/redux/reducer/chat-list';
import { addMessage } from '@/redux/reducer/message-list';

/**
 * 对获取到的新的群聊信息的处理：
 * 1、新消息入库
 * 2、针对每一个朋友的新消息进行判断
 * 3、首先判断该会话是否存在，如果不存在，新建一个会话，并更新会话的所有信息
 * 4、如果会话存在，那么更新对应会话的数据
 */
const handleNewGroupMessages = async (
  messages: IndexdbGroupMessagesRow | IndexdbGroupMessagesRow[],
  updateGroup = false,
  callback?: (chat: IndexdbChatsRow) => void,
) => {
  const messagesArray = Array.isArray(messages) ? messages : [messages];
  if (messagesArray.length === 0) return;
  const indexdb = getIndexdb();
  // 新消息入库
  await indexdb?.groupMessages.bulkPut(messagesArray).catch((error) => {
    console.error(error);
  });
  const { currentChat } = store.getState().chatPanel.value;
  const messageNumber = messagesArray.length;
  const lastMessage = messagesArray[messageNumber - 1];
  const messageFromId = lastMessage.group_id;
  const chat = await indexdb?.chats.get({ id: messageFromId });
  // group 数据可能更新
  if (chat) {
    if (currentChat && chat.id === currentChat.id) {
      store.dispatch(addMessage(messagesArray));
    } else {
      chat.unread_count += messageNumber;
      chat.active_time = lastMessage.created_at;
    }
    if (updateGroup) {
      const group = await indexdb?.groups.get(messageFromId);
      if (group) {
        chat.name = group.name;
        chat.users = group.members;
      }
    }
    chat.last_message = lastMessage;
    await indexdb?.chats.update(chat.id, chat);
    store.dispatch(updateChat(chat));
    store.dispatch(updateCurrentChat(chat));
    if (callback) {
      callback(chat);
    }
  } else {
    const { code, data } = await request<GroupRow>(`groups/${messageFromId}`);
    if (code || !data) return;
    const newChat: IndexdbChatsRow = {
      id: messageFromId,
      name: data.name,
      type: ChatType.GROUP,
      users: data.members,
      unread_count: messageNumber,
      last_message: lastMessage,
      active_time: lastMessage.created_at,
      created_at: Date.now(),
    };
    await indexdb?.chats.add(newChat).catch((chatError) => {
      console.log('paki chatError', chatError);
    });
    store.dispatch(addChat(newChat));
    if (callback) {
      callback(newChat);
    }
  }
};

export default handleNewGroupMessages;
