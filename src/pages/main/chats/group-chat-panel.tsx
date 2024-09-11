import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button } from 'antd';
import { DotsThree } from 'phosphor-react';
import isEqual from 'lodash/isEqual';
import { type RootState } from '@/redux/store';
import Editor from './editor';
import GroupMessagesList from './group-message-list';
import { GROUP_SEND_MESSAGE_DISABLED_MESSAGE } from '@/const/message';
import GroupDrawer from './group-drawer';
import ChatNameEditor from './chat-name-editor';
import { GroupMember, GroupMemberRoleType } from '@/types/group';
import socket from '@/socket';
import { SOCKET_EVENT_UPDATE_GROUP_NAME } from '@/const/socket-event';
import { getIndexdb } from '@/common/indexdb';
import { initCurrentChat, updateCurrentChat } from '@/redux/reducer/chat-panel';
import request from '@/common/request';
import { selectAllGroups } from '@/redux/reducer/groups';
import { updateChat } from '@/redux/reducer/chat-list';

const GroupChatPanel: React.FC = () => {
  const [disabled, setDisabled] = useState(false);
  const [disabledMessage, setDisabledMessage] = useState('');
  const dispatch = useDispatch();
  const profile = useSelector((state: RootState) => state.profile.value);
  const currentChat = useSelector((state: RootState) => state.chatPanel.value.currentChat);
  const groups = useSelector(selectAllGroups);
  const indexdb = getIndexdb();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  if (!currentChat) {
    return null;
  }
  let role = GroupMemberRoleType.MEMBER;
  const group = groups.find((item) => item.id === currentChat.id);
  if (group) {
    role = group.members.find((item) => item.id === profile.id)?.role as GroupMemberRoleType;
  }
  const handleShowDrawer = () => {
    setIsDrawerOpen(!isDrawerOpen);
  };
  const handleChangeGroupName = (value: string) => {
    socket.emit(SOCKET_EVENT_UPDATE_GROUP_NAME, {
      from: profile.id,
      to: '',
      data: {
        group_id: currentChat.id,
        group_name: value,
      },
    });
  };
  const judgeGroupExit = () => {
    request<GroupMember>({
      url: 'groupmembers/exist',
      params: {
        group_id: currentChat.id,
        user_id: profile.id,
      },
    }).then((value) => {
      const { data } = value;
      if (!data) {
        setDisabled(true);
        setDisabledMessage(GROUP_SEND_MESSAGE_DISABLED_MESSAGE);
      } else {
        setDisabled(false);
        setDisabledMessage('');
      }
    });
  };
  useEffect(() => {
    judgeGroupExit();
  }, [currentChat.id]);

  useEffect(() => {
    if (group) {
      setDisabled(false);
      setDisabledMessage('');
    } else {
      setDisabled(true);
      setDisabledMessage(GROUP_SEND_MESSAGE_DISABLED_MESSAGE);
    }
    indexdb?.chats.get(currentChat.id).then(async (chatValue) => {
      if (!chatValue || !group) return;
      const chatCopy = {
        ...chatValue,
      };
      chatCopy.name = group.name;
      chatCopy.users = group.members;
      if (!isEqual(chatCopy, chatValue)) {
        await indexdb.chats.update(currentChat.id, chatCopy);
        dispatch(updateChat(chatCopy));
        dispatch(updateCurrentChat(chatCopy));
        dispatch(initCurrentChat(chatCopy));
      }
    });
  }, [group, currentChat.id]);
  return (
    <div className="w-full h-screen flex flex-col">
      <div
        onClick={() => {
          if (isDrawerOpen) {
            setIsDrawerOpen(false);
          }
        }}
        className="p-24  relative z-[1000] flex-none h-80 flex items-center justify-between w-full text-lg font-bold bg-panelheader shadow-1-b-inset-tp-gray-200"
      >
        <div>
          <ChatNameEditor
            editable={role === GroupMemberRoleType.MANAGER}
            value={currentChat.name}
            onConfirm={handleChangeGroupName}
          ></ChatNameEditor>
          {disabled && <div className="text-red mt-4 font-normal text-xs">{disabledMessage}</div>}
        </div>
        <Button
          style={{ height: '32px', padding: 0, width: '32px', border: 'none' }}
          type="text"
          className="flex items-center justify-center"
          onClick={handleShowDrawer}
        >
          <DotsThree className="text-tp-gray-800" size={32} weight="bold" />
        </Button>
      </div>
      <GroupMessagesList></GroupMessagesList>
      <div
        className="max-h-1/2 px-16 pb-16 min-h-1/4 flex-none w-full border-solid border-t-[1px] border-t-neutral-200 border-l-0 border-r-0 border-b-0"
        style={{ height: '20vh' }}
      >
        <Editor disabled={disabled}></Editor>
      </div>
      <GroupDrawer
        open={isDrawerOpen}
        onClose={() => {
          setIsDrawerOpen(false);
        }}
      ></GroupDrawer>
    </div>
  );
};

export default GroupChatPanel;
