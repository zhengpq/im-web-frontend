import { MessageState, MessageType } from '.';
import { User } from './user';

export enum GroupMemberRoleType {
  MANAGER = 'MANAGER',
  MEMBER = 'MEMBER',
}

export interface GroupMember extends User {
  role: GroupMemberRoleType;
}

export interface GroupRow {
  id: string;
  name: string;
  description?: string;
  members: GroupMember[];
  created_at: number;
  updated_at: number;
}

export interface CreateGroupData {
  group: GroupRow;
  first_message: GroupMessageRow;
}

export enum GroupUpdateType {
  ADD_NEW_MEMBERS = 'ADD_NEW_MEMBERS',
  DELETE_MEMBER = 'DELETE_MEMBER',
  UPDATE_NAME = 'UPDATE_NAME',
  QUIT_GROUP = 'QUIT_GROUP',
  DISBAND_GROUP = 'DISBAND_GROUP',
}

export interface GroupMessageRow {
  id: string;
  ack_id: string;
  group_id: string;
  sender_id: string;
  type: MessageType;
  content: string;
  state?: MessageState;
  created_at: number;
  updated_at: number;
}

export interface GroupChatListItem {
  group: GroupRow;
  unread_count: number;
  last_message: GroupMessageRow;
  latest_message_time: number;
}

export interface GroupNewMessageRow {
  user_id: string;
  messages: GroupMessageRow[];
}

export interface GroupAddNewMembers {
  group_data: GroupRow;
  new_users: GroupMember[];
}

export interface GroupDeleteNewMembers {
  group_data: GroupRow;
  deleted_users: string[];
}
