import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import InfiniteScroll from 'react-infinite-scroll-component';
import { Spin } from 'antd';
import { type RootState } from '@/redux/store';
import { initMessageList } from '@/redux/reducer/chat-panel';
import { MessageAvatarPoi } from '@/types';
import { IndexdbGroupMessagesRow } from '@/types/indexdb';
import UpdateMessage from '@/components/update-message';
import GroupMessage from './group-message';
import useMessageListScroll from '@/hooks/use-message-list-scroll';
import useLoadGroupMessages from '@/hooks/use-load-group-messages';
import useGetContainerHeight from '@/hooks/use-get-container-height';

const GroupMessagesList = () => {
  const [hasMore, setHasMore] = useState(true);
  const dispatch = useDispatch();
  const profile = useSelector((state: RootState) => state.profile.value);
  const { currentChat, chatList, messageList } = useSelector(
    (state: RootState) => state.chatPanel.value,
  );
  const { loadMessages } = useLoadGroupMessages();
  const messageListRef = useRef<HTMLDivElement>(null);
  const containerHeight = useGetContainerHeight(messageListRef.current);
  // 一次加载两屏
  const pageSize = (containerHeight / 44 || 10) * 2;

  const chat = useMemo(() => {
    return { ...chatList.find((item) => item.id === currentChat?.id) };
  }, [currentChat, chatList]);

  const handleLoadMore = () => {
    if (!currentChat) return;
    loadMessages(currentChat.id, pageSize, messageList.length)
      .then((value: IndexdbGroupMessagesRow[]) => {
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
    loadMessages(currentChat.id, pageSize, messageList.length)
      .then((value: IndexdbGroupMessagesRow[]) => {
        dispatch(initMessageList(value));
      })
      .catch((error) => {});
  }, [currentChat, pageSize, messageList]);
  return (
    <div
      className="flex-1 w-full overflow-y-auto py-24 flex flex-col-reverse"
      id="groupMessageList"
      ref={messageListRef}
    >
      <InfiniteScroll
        key={currentChat?.id}
        dataLength={messageList.length}
        next={handleLoadMore}
        style={{
          display: 'flex',
          flexDirection: 'column-reverse',
          padding: '0 24px',
          overflow: 'hidden',
        }}
        inverse={true}
        hasMore={hasMore && messageList.length > 0}
        loader={
          <div className="flex items-center justify-center">
            <Spin></Spin>
          </div>
        }
        scrollableTarget="groupMessageList"
        pullDownToRefresh
        refreshFunction={handleLoadMore}
      >
        {(messageList as IndexdbGroupMessagesRow[]).map((item) => {
          if (!item) return null;
          if (!item.content) {
            return null;
          }
          if (item.update_type) {
            return <UpdateMessage key={item.id} {...item}></UpdateMessage>;
          }
          const isCurrentUser = item.sender_id === profile.id;
          const avatarPoi = isCurrentUser ? MessageAvatarPoi.RIGHT : MessageAvatarPoi.LEFT;
          const userData = isCurrentUser
            ? profile
            : chat?.users?.find((user) => user.id === item.sender_id);
          return (
            <GroupMessage
              className="mb-24"
              avatarPoi={avatarPoi}
              avatar={userData?.avatar}
              username={isCurrentUser ? '' : userData?.username}
              message={item}
              key={item.id !== '' ? item.id : item.ack_id}
            ></GroupMessage>
          );
        })}
      </InfiniteScroll>
    </div>
  );
};

export default GroupMessagesList;
