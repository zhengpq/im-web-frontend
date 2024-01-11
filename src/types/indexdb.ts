// import { MessageType } from 'antd/es/message/interface';
import { MessageState, MessageType } from '.';
import { ChatType } from './chat-panel';
import { FriendRequestRow, FriendRow } from './friend';
import { GroupMember, GroupRow, GroupUpdateType } from './group';
import { User } from './user';

export type IndexdbFriendRequestsRow = FriendRequestRow;

export type IndexdbFriendsRow = FriendRow;

export type IndexdbGroupsRow = GroupRow;

export type IndexdbUersRow = User;

export interface IndexdbFriendMessagesRow {
  id?: string;
  ack_id: string;
  sender_id: string;
  receiver_id: string;
  type: MessageType;
  content: string;
  state?: MessageState;
  created_at: number;
  updated_at?: number;
}

export interface IndexdbGroupMessagesRow {
  id?: string;
  ack_id: string;
  sender_id: string;
  group_id: string;
  type: MessageType;
  content: string;
  state?: MessageState;
  update_type?: GroupUpdateType;
  created_at: number;
  updated_at?: number;
}

export interface IndexdbChatsRow {
  // friend 或者 group 的id
  id: string;
  name: string;
  type: ChatType;
  users: Array<FriendRow | GroupMember>;
  unread_count: number;
  last_message: IndexdbGroupMessagesRow | IndexdbFriendMessagesRow | null;
  active_time: number;
  created_at: number;
}
