import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { Divider, List } from 'antd';
import FriendsSearch from './friends-search';
import Friend from './friend';
import ListCard from '@/components/list-card';
import BadgeWrap from '@/components/badge-wrap';
import CreateGroup from './create-group';
import Group from './group';
import { FriendRequestStatus } from '@/types/friend';
import FriendRequestList from './friend-request-list';
import { ChatType } from '@/types/chat-panel';
import FriendDetail from './friend-detail';
import GroupDetail from './group-detail';
import EmptyChat from '@/components/empty-chat';
import { selectAllFriends } from '@/redux/reducer/friends';
import { selectAllGroups } from '@/redux/reducer/groups';
import { selectAllFriendRequests } from '@/redux/reducer/friend-request';

const FRIEND_REQUESTS_ID = 'friend-requests';

const FriendsBook: React.FC = () => {
  const friendRequests = useSelector(selectAllFriendRequests);
  const friends = useSelector(selectAllFriends);
  const groups = useSelector(selectAllGroups);

  const [currentFriend, setCurrentFriend] = useState('');
  const [currentFriendType, setCurrentFriendType] = useState<ChatType | null>(null);

  const handleClickListItem = (type: ChatType | null, id: string) => {
    setCurrentFriend(id);
    setCurrentFriendType(type);
  };

  const friendsSorted = [...friends].sort((a, b) => b.created_at - a.created_at);
  const groupsSorted = [...groups].sort((a, b) => b.created_at - a.created_at);

  const content = (
    <>
      <div className="px-16">
        <Divider style={{ marginTop: '0' }}></Divider>
      </div>
      <div className="text-base font-bold text-tp-gray-900 mb-16 px-16">好友</div>
      <List
        split={false}
        dataSource={friendsSorted}
        renderItem={(item) => {
          return (
            <List.Item
              onClick={() => {
                handleClickListItem(ChatType.FRIEND, item.id);
              }}
              style={{ padding: 0 }}
            >
              <ListCard>
                <Friend key={item.id} {...item}></Friend>
              </ListCard>
            </List.Item>
          );
        }}
      ></List>
      <div className="px-16">
        <Divider></Divider>
      </div>
      <div className="text-base font-bold text-tp-gray-900 mb-16 px-16">群聊</div>
      <List
        split={false}
        dataSource={groupsSorted}
        renderItem={(item) => {
          return (
            <List.Item
              onClick={() => {
                handleClickListItem(ChatType.GROUP, item.id);
              }}
              style={{ padding: 0 }}
            >
              <ListCard>
                <Group key={item.id} {...item}></Group>
              </ListCard>
            </List.Item>
          );
        }}
      ></List>
    </>
  );
  const newFriendCount = friendRequests.filter(
    (item) => item?.status === FriendRequestStatus.SENDING,
  ).length;

  return (
    <>
      <div className="w-[400px] bg-list flex flex-col pr-1 flex-none h-full shadow-1-r-inset-tp-gray-100">
        <div className="py-24 px-16 w-full flex-none shadow-1-b-inset-tp-gray-200 flex items-center justify-normal">
          <FriendsSearch className="flex-1 mr-4"></FriendsSearch>
          <CreateGroup></CreateGroup>
        </div>
        <div className="flex-1 overflow-y-auto">
          <List>
            <List.Item
              style={{ padding: '0' }}
              onClick={() => {
                handleClickListItem(null, FRIEND_REQUESTS_ID);
              }}
            >
              <ListCard>
                <div className="p-16 h-76 flex items-center justify-between">
                  <div className="text-base font-bold text-tp-gray-900">新朋友</div>
                  {newFriendCount > 0 && <BadgeWrap count={newFriendCount}></BadgeWrap>}
                </div>
              </ListCard>
            </List.Item>
          </List>
          {content}
        </div>
      </div>
      <div className="flex-1 bg-panel h-full overflow-y-auto">
        {currentFriendType === null && currentFriend === FRIEND_REQUESTS_ID && (
          <FriendRequestList></FriendRequestList>
        )}
        {currentFriendType === ChatType.FRIEND && <FriendDetail id={currentFriend}></FriendDetail>}
        {currentFriendType === ChatType.GROUP && <GroupDetail id={currentFriend}></GroupDetail>}
        {!currentFriend && <EmptyChat></EmptyChat>}
      </div>
    </>
  );
};

export default FriendsBook;
