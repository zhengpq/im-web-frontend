import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';

const useMessageListScroll = (messageListDom: HTMLDivElement | null, dataFetchingDone = false) => {
  const { messageList } = useSelector((state: RootState) => state.chatPanel.value);

  useEffect(() => {
    if (messageListDom && messageList.length > 0) {
      // 聊天窗口高度
      const messageWindowHeight = messageListDom.clientHeight;
      if (messageListDom.scrollTop > -messageWindowHeight * (2 / 3)) {
        messageListDom.scrollTop = messageListDom.scrollHeight;
      }
    }
  }, [messageList, messageListDom]);
};

export default useMessageListScroll;
