import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { getIndexdb } from '@/common/indexdb';
import uuidv4 from '@/utils/uuid';
import { MessageState, MessageType } from '@/types';
import { ChatType } from '@/types/chat-panel';
import { addTempMessage, updateChat } from '@/redux/reducer/chat-panel';

const useCreateTempMessage = () => {
  const dispatch = useDispatch();
  const { currentChat } = useSelector((state: RootState) => state.chatPanel.value);
  const profile = useSelector((state: RootState) => state.profile.value);
  const indexdb = getIndexdb();
  const createTempMessage = async (content: string, messageType: MessageType) => {
    let result = null;
    if (!currentChat) return result;
    const uuid = uuidv4();
    const messageData: any = {
      id: uuid,
      ack_id: uuid,
      sender_id: profile.id,
      type: messageType,
      state: MessageState.SENDING,
      content,
      created_at: Date.now(),
    };
    const chat = await indexdb?.chats.get(currentChat.id);
    if (!chat) return result;
    const chatCopy = { ...chat };
    if (currentChat.type === ChatType.FRIEND) {
      messageData.receiver_id = currentChat.id;
      try {
        await indexdb?.friendMessages.add(messageData);
      } catch (error) {
        console.error(error);
        return result;
      }
    }
    if (currentChat.type === ChatType.GROUP) {
      messageData.group_id = currentChat.id;
      try {
        await indexdb?.groupMessages.add(messageData);
      } catch (error) {
        console.error(error);
        return result;
      }
    }
    dispatch(addTempMessage(messageData));
    result = messageData;
    chatCopy.last_message = messageData;
    await indexdb?.chats.update(chat.id, chatCopy);
    dispatch(updateChat(chatCopy));
    return result;
  };

  return {
    createTempMessage,
  };
};

export default useCreateTempMessage;
