import React from 'react';
import { getIndexdb } from '@/common/indexdb';

const useLoadGroupMessages = () => {
  const loadMessages = async (groupId: string, pageSize: number, messagesNumber: number) => {
    const indexdb = getIndexdb();
    if (!indexdb) return [];
    const newMessages = await indexdb.groupMessages
      .orderBy('created_at')
      .reverse()
      .filter((item) => item.group_id === groupId)
      .offset(messagesNumber)
      .limit(pageSize)
      .toArray();
    return newMessages;
  };
  return {
    loadMessages,
  };
};

export default useLoadGroupMessages;
