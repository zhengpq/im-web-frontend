import { MessageType } from '@/types';
import { type MessageData } from '@/types/friend';

export const messageFormat = (message: MessageData | null) => {
  if (!message) return '';
  const { type, content } = message;
  let result = content;
  if (type === MessageType.IMAGE) {
    result = '[图片]';
  }
  if (type === MessageType.FILE) {
    result = '文件';
  }
  return result;
};
