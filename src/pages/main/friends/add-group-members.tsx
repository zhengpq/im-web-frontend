import React, { useState } from 'react';
import { Button, Checkbox, Modal, Space } from 'antd';
import { useSelector } from 'react-redux';
import { XCircle } from 'phosphor-react';
import { FriendRow } from '@/types/friend';
import { RootState } from '@/redux/store';
import Avatar from '@/components/avatar';
import { GroupRow } from '@/types/group';
import socket from '@/socket';
import { SOCKET_EVENT_ADD_GROUP_MEMBERS } from '@/const/socket-event';

interface AddGroupMembersProps {
  group: GroupRow;
  visible?: boolean;
  onCancel?: () => void;
  onConfirm?: () => void;
}

const AddGroupMembers: React.FC<AddGroupMembersProps> = ({
  group,
  visible,
  onCancel,
  onConfirm,
}) => {
  const [chosenFriends, setChosenFriends] = useState<FriendRow[]>([]);
  const profile = useSelector((state: RootState) => state.profile.value);
  const friends = useSelector((state: RootState) => state.friends.value);
  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    }
  };
  const handleChoseFriend = (id: string) => {
    const index = chosenFriends.findIndex((item) => item.id === id);
    if (index === -1) {
      const newFriend = friends.find((item) => item.id === id);
      if (newFriend) {
        chosenFriends.push(newFriend);
      }
    } else {
      chosenFriends.splice(index, 1);
    }
    setChosenFriends([...chosenFriends]);
  };
  const handleDelete = (id: string) => {
    const index = chosenFriends.findIndex((item) => item.id === id);
    if (index !== -1) {
      chosenFriends.splice(index, 1);
      setChosenFriends([...chosenFriends]);
    }
  };
  const handleConfirm = () => {
    const newMembers = chosenFriends.map((item) => item.friend_id);
    socket.emit(SOCKET_EVENT_ADD_GROUP_MEMBERS, {
      from: profile.id,
      to: '',
      data: {
        group_id: group.id,
        user_ids: newMembers,
      },
    });
    if (onConfirm) {
      onConfirm();
    }
  };
  let friendsToShow = friends;
  if (group) {
    friendsToShow = friends.filter((item) => {
      return group.members.findIndex((member) => member.id === item.friend_id) === -1;
    });
  }
  return (
    <Modal
      open={visible}
      title=""
      closeIcon={null}
      maskClosable={false}
      footer={null}
      style={{ maxWidth: 'none', padding: 0 }}
      wrapClassName="p-0"
      onCancel={handleCancel}
      width={848}
    >
      <div className="w-[800px] h-[600px] flex">
        <div className="flex-none flex flex-col" style={{ width: 'calc(((100% - 1px) / 5) * 2)' }}>
          <div className="pr-24 overflow-y-scroll flex-1 max-h-full">
            {friendsToShow.length > 0 ? (
              friendsToShow.map((item) => {
                return (
                  <div
                    key={item.id}
                    className="flex items-center rounded-4 p-12 cursor-pointer hover:bg-tp-gray-100 active:bg-stone-100"
                    onClick={() => {
                      handleChoseFriend(item.id);
                    }}
                  >
                    <Checkbox
                      checked={chosenFriends.findIndex((friend) => friend.id === item.id) !== -1}
                      className="mr-12"
                    ></Checkbox>
                    <div className="flex items-center ml-12 text-sm text-tp-gray-800 font-bold">
                      <Avatar size={32} avatar={item.avatar}></Avatar>
                      <div className="ml-12">{item.username}</div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="w-full h-full flex justify-center items-center text-base font-bold text-tp-gray-700">
                无符合条件的朋友
              </div>
            )}
          </div>
        </div>
        <div
          className="flex-none flex flex-col relative"
          style={{ width: 'calc(((100% - 1px) / 5) * 3)' }}
        >
          <div className="w-1 h-[640px] absolute -top-20 left-0 bg-tp-gray-100"></div>
          <div className="flex-1 w-full pl-24">
            <div className="flex items-center justify-between pb-16">
              <div className="text-base font-medium text-tp-gray-800">请选择需要添加的好友</div>
              <div className="flex items-center text-sm text-tp-gray-700">
                <div>已选好友</div>
                <div className="mx-4 font-bold text-primary">{chosenFriends.length}</div>
                <div>人</div>
              </div>
            </div>
            <div className="h-full overflow-y-scroll">
              {chosenFriends.length > 0 && (
                <Space className="p-16 flex-wrap" size="middle">
                  {chosenFriends.map((item) => {
                    return (
                      <div className="relative" key={item.id}>
                        <XCircle
                          onClick={() => {
                            handleDelete(item.id);
                          }}
                          className="absolute -top-[9px] -right-[9px] z-10 cursor-pointer"
                          color="var(--transparent-gray-700)"
                          size={18}
                          weight="fill"
                        ></XCircle>
                        <Avatar size={56} avatar={item.avatar}></Avatar>
                      </div>
                    );
                  })}
                </Space>
              )}
              {chosenFriends.length === 0 && (
                <div className="w-full flex h-full justify-center items-center text-base font-bold text-tp-gray-700">
                  请先选择好友
                </div>
              )}
            </div>
          </div>
          <div className="flex-none flex items-center justify-center px-24 pt-20">
            <Button className="w-120" type="text" onClick={handleCancel}>
              取消
            </Button>
            <Button
              className="ml-12 w-120"
              type="primary"
              disabled={chosenFriends.length === 0}
              onClick={handleConfirm}
            >
              添加
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default AddGroupMembers;
