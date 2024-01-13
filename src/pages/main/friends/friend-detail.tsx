import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Button, Divider, Modal } from 'antd';
import { ChatCircleDots, Trash } from 'phosphor-react';
import { RootState } from '@/redux/store';
import Avatar from '@/components/avatar';
import socket from '@/socket';
import { SOCKET_EVENT_DELETE_FRIEND } from '@/const/socket-event';
import useStartChat from '@/hooks/use-start-chat';
import { ChatType } from '@/types/chat-panel';
import useFriendDiff from '@/hooks/use-friend-diff';
import { getIndexdb } from '@/common/indexdb';

interface FriendDetailProps {
  id: string;
}

const commonButonStyle: React.CSSProperties = {
  width: '160px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
};

const FriendDetail: React.FC<FriendDetailProps> = ({ id }) => {
  const friends = useSelector((state: RootState) => state.friends.value);
  const profile = useSelector((state: RootState) => state.profile.value);
  const { startChat } = useStartChat();
  const { friendDiff } = useFriendDiff();
  const indexdb = getIndexdb();
  const friend = friends.find((item) => item.id === id);

  const handleDeleteFriend = () => {
    if (!friend) return;
    Modal.confirm({
      content: '确定删除好友吗？',
      cancelText: '取消',
      okText: '确定',
      onOk: async () => {
        socket.emit(SOCKET_EVENT_DELETE_FRIEND, {
          from: profile.id,
          to: friend.friend_id,
          data: {
            user_id: profile.id,
            friend_id: friend.friend_id,
          },
        });
      },
    });
  };

  const handleStartChat = () => {
    if (!friend) return;
    const users = [friend];
    startChat(friend.friend_id, friend.username, users, ChatType.FRIEND);
  };

  const judgeFriendExist = async () => {
    const data = await friendDiff(id, profile.id);
    if (!data) {
      const localFriend = await indexdb?.friends.get(id);
      if (localFriend) {
        indexdb?.friends.delete(id);
      }
    }
  };

  useEffect(() => {
    judgeFriendExist();
  }, [id, profile.id]);

  let content = null;
  if (friend) {
    content = (
      <div className="px-24 pt-60 flex justify-center">
        <div className="flex flex-col items-start justify-center w-fit">
          <div className="flex items-center text-base font-semibold">
            <Avatar size={48} className="mr-16" avatar={friend.avatar}></Avatar>
            <div>{friend.username}</div>
          </div>
          <Divider></Divider>
          <div className="flex items-center w-full justify-center">
            <Button style={commonButonStyle} className="mr-12" onClick={handleStartChat}>
              <div className="flex items-center">
                <ChatCircleDots className="mr-4" size={18} weight="regular"></ChatCircleDots>
                发消息
              </div>
            </Button>
            <Button style={commonButonStyle} type="text" onClick={handleDeleteFriend}>
              <div className="flex items-center">
                <Trash className="mr-4" size={18} weight="regular"></Trash>
                删除好友
              </div>
            </Button>
          </div>
        </div>
      </div>
    );
  }
  return <div>{content}</div>;
};

export default FriendDetail;
