import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import InfiniteScroll from 'react-infinite-scroll-component';
import { Spin } from 'antd';
import { type RootState } from '@/redux/store';
import Message from '@/components/message';
import { MessageAvatarPoi } from '@/types';
import { IndexdbFriendMessagesRow } from '@/types/indexdb';
import useMessageListScroll from '@/hooks/use-message-list-scroll';
import useGetContainerHeight from '@/hooks/use-get-container-height';
import useLoadFriendMessages from '@/hooks/use-load-friend-messages';
import { selectAllChats } from '@/redux/reducer/chat-list';
import { initMessageList, selectAllMessages } from '@/redux/reducer/message-list';

const FriendMessagesList = () => {
  const [hasMore, setHasMore] = useState(true);
  const dispatch = useDispatch();
  const { id: userId, avatar: userAvatar } = useSelector((state: RootState) => state.profile.value);
  const { currentChat } = useSelector((state: RootState) => state.chatPanel.value);
  const chatList = useSelector(selectAllChats);
  const messageList = useSelector(selectAllMessages);
  const { loadMessages } = useLoadFriendMessages();
  const messageListRef = useRef<HTMLDivElement>(null);
  const containerHeight = useGetContainerHeight(messageListRef.current);
  // 一次加载两屏
  const pageSize = (containerHeight / 44 || 10) * 2;

  const chat = useMemo(() => {
    return chatList.find((item) => item.id === currentChat?.id);
  }, [currentChat, chatList]);

  const handleLoadMore = () => {
    if (!currentChat) return;
    loadMessages([userId, currentChat.id], pageSize, messageList.length)
      .then((value: IndexdbFriendMessagesRow[]) => {
        if (value.length === 0) {
          setHasMore(false);
          return;
        }
        dispatch(initMessageList([...messageList, ...value] as any));
      })
      .catch((error) => {
        console.error('加载更多列表失败', error);
      });
  };

  useMessageListScroll(messageListRef.current);

  useEffect(() => {
    setHasMore(true);
  }, [currentChat?.id]);

  useEffect(() => {
    if (!currentChat || messageList.length > 0) return;
    loadMessages([userId, currentChat.id], pageSize, messageList.length)
      .then((value: IndexdbFriendMessagesRow[]) => {
        dispatch(initMessageList(value));
      })
      .catch((error) => {
        console.error('获取消息列表失败', error);
      });
  }, [currentChat, pageSize, messageList]);
  return (
    <div
      className="flex-1 w-full overflow-y-auto flex flex-col-reverse py-24"
      id="friendMessageList"
      ref={messageListRef}
    >
      <InfiniteScroll
        dataLength={messageList.length}
        next={handleLoadMore}
        style={{
          display: 'flex',
          flexDirection: 'column-reverse',
          padding: '0 24px',
          overflow: 'hidden',
        }}
        inverse={true} //
        hasMore={hasMore && messageList.length > 0}
        loader={
          <div className="flex items-center justify-center">
            <Spin></Spin>
          </div>
        }
        scrollableTarget="friendMessageList"
      >
        {(messageList as IndexdbFriendMessagesRow[]).map((item) => {
          const isCurrentUser = item.sender_id === userId;
          const avatarPoi = isCurrentUser ? MessageAvatarPoi.RIGHT : MessageAvatarPoi.LEFT;
          const avatar = isCurrentUser ? userAvatar : chat?.users[0].avatar;
          return (
            <Message
              className="mb-24"
              key={item.id !== '' ? item.id : item.ack_id}
              avatarPoi={avatarPoi}
              avatar={avatar}
              message={item}
            ></Message>
          );
        })}
      </InfiniteScroll>
    </div>
  );
};

export default FriendMessagesList;
