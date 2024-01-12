import React from 'react';
import { getIndexdb } from '@/common/indexdb';

const useLoadFriendMessages = () => {
  const loadMessages = async (
    users: [string, string],
    pageSize: number,
    messagesNumber: number,
  ) => {
    const indexdb = getIndexdb();
    if (!indexdb) return [];
    const [user1, user2] = users;
    const newMessages = await indexdb.friendMessages
      .orderBy('created_at')
      .reverse()
      .filter((item) => {
        return (
          (item.sender_id === user1 && item.receiver_id === user2) ||
          (item.receiver_id === user1 && item.sender_id === user2)
        );
      })
      .offset(messagesNumber)
      .limit(pageSize)
      .toArray();
    return newMessages;
  };
  return {
    loadMessages,
  };
};

export default useLoadFriendMessages;
