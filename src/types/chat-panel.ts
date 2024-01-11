import { type FriendChatListItem } from './friend';
import { type GroupChatListItem } from './group';

export enum ChatType {
  FRIEND = 'FRIEND',
  GROUP = 'GROUP',
}

export interface ChatListItem {
  type: ChatType;
  id: string;
  unread_count: number;
  latest_message_time: number;
  data: FriendChatListItem | GroupChatListItem;
}
