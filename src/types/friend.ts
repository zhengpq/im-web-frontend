// export type FriendRequestStatus = 0 | 1 | -1;
import { MessageState, MessageType } from '.';

export enum FriendRequestStatus {
  SENDING = 'SENDING',
  REJECT = 'REJECT',
  RECEIVED = 'RECEIVED',
}

export enum FriendDeleted {
  DELETED = 1,
  NOT_DELETED = 0,
}

export interface FriendRequestRow {
  id: string;
  sender_id: string;
  receiver_id: string;
  message: string;
  status: FriendRequestStatus;
  created_at: number;
  updated_at: number;
}

export interface FriendRow {
  id: string;
  user_id: string;
  friend_id: string;
  username: string;
  avatar: string;
  deleted: FriendDeleted;
  created_at: number;
  updated_at: number;
}

export interface FriendDeletedData {
  user_id: string;
  friend_id: string;
}

export type FriendRequestData = FriendRequestRow | null;

interface FriendSocketData {
  from: string;
  to: string;
}

export interface FriendRequestFinishData {
  data: FriendRequestRow | null;
  from: string;
  to: string;
}

export interface FriendReceiveFinishData {
  friend: FriendRow;
  request_id: string;
}

export type FriendRejectFinishData = {
  data: {
    request_id: string;
  };
} & FriendSocketData;

export type FriendDeleteFinishData = Omit<FriendRow, 'id'>;

export interface MessageData {
  type: MessageType;
  content: string;
}

export interface FriendChatListItem {
  user_id: string;
  username: string;
  avatar: string;
  unread_count: number;
  last_message: FriendMessageRow;
  latest_message_time: number;
}

export interface FriendMessageRow {
  id: string;
  ack_id: string;
  sender_id: string;
  receiver_id: string;
  type: MessageType;
  content: string;
  state?: MessageState;
  created_at: number;
  updated_at: number;
}

export interface FriendNewMessageRow {
  user_id: string;
  messages: FriendMessageRow[];
}
