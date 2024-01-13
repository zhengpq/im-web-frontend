import Dexie, { Table } from 'dexie';
import {
  IndexdbChatsRow,
  IndexdbFriendMessagesRow,
  IndexdbFriendRequestsRow,
  IndexdbFriendsRow,
  IndexdbGroupMessagesRow,
  IndexdbGroupsRow,
  IndexdbUersRow,
} from '@/types/indexdb';

const databaseIndexes = {
  users: 'id, username, avatar, offline_time, created_at, updated_at',
  friendRequests: 'id, sender_id, receiver_id, message, status, created_at, updated_at',
  friends: 'id, user_id, friend_id, username, avatar, deleted, created_at, updated_at',
  groups: 'id, name, description, members, created_at, updated_at',
  friendMessages:
    'id, ack_id, sender_id, receiver_id, type, content, state, created_at, updated_at',
  groupMessages:
    'id, ack_id, group_id, sender_id, type, update_type, content, state, created_at, updated_at',
  chats: 'id, name, type, users, unread_count, latest_message, active_time, created_at',
};

export class DexieClass extends Dexie {
  users!: Table<IndexdbUersRow, string>;

  friendRequests!: Table<IndexdbFriendRequestsRow, string>;

  friends!: Table<IndexdbFriendsRow, string>;

  groups!: Table<IndexdbGroupsRow, string>;

  friendMessages!: Table<IndexdbFriendMessagesRow, string>;

  groupMessages!: Table<IndexdbGroupMessagesRow, string>;

  chats!: Table<IndexdbChatsRow, string>;

  constructor(key: string) {
    super(key);
    this.version(6).stores(databaseIndexes);
  }
}

let indexdb: DexieClass | null = null;

export const createIndexdb = (key: string) => {
  indexdb = new DexieClass(key);
  return indexdb;
};

export const getIndexdb = () => {
  return indexdb;
};
