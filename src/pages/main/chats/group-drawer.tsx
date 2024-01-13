import { Button, Divider, Drawer, List, Modal } from 'antd';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import GroupMembers from '../friends/group-members';
import { GroupMember, GroupMemberRoleType } from '@/types/group';
import { getIndexdb } from '@/common/indexdb';
import { initMessageList, updateChat } from '@/redux/reducer/chat-panel';
import socket from '@/socket';
import { SOCKET_EVENT_DISBAND_GROUP, SOCKET_EVENT_QUIT_GROUP } from '@/const/socket-event';
import useDisbandGroup from '@/hooks/use-disband-group';
import useQuitGroup from '@/hooks/use-quit-group';

const { confirm } = Modal;

interface GroupDrawerProps {
  open: boolean;
  onClose?: () => void;
}

const commonButtonStyle: React.CSSProperties = {
  width: '100%',
  height: '100%',
  borderRadius: 0,
};

const commonListItemStyle: React.CSSProperties = {
  padding: 0,
  height: '56px',
};

const GroupDrawer: React.FC<GroupDrawerProps> = ({ open, onClose }) => {
  const dispatch = useDispatch();
  const currentChat = useSelector((state: RootState) => state.chatPanel.value.currentChat);
  const profile = useSelector((state: RootState) => state.profile.value);
  const groups = useSelector((state: RootState) => state.groups.value);
  const { disbandGroup } = useDisbandGroup();
  const { quitGroup } = useQuitGroup();
  const group = groups.find((item) => item.id === currentChat?.id);
  const role = group?.members.find((item) => item.id === profile.id)?.role;
  let groupMembers: GroupMember[] = [];
  if (group) {
    groupMembers = group.members;
  }
  const handleClearGroupMessages = () => {
    confirm({
      content: (
        <div className="mb-24">
          清空群聊天记录之后将无法找回先前的聊天记录，请再次确定是否删除群聊天记录。
        </div>
      ),
      okText: '确定',
      cancelText: '取消',
      styles: {
        body: { paddingTop: '16px' },
      },
      onOk: async () => {
        const indexdb = getIndexdb();
        if (!indexdb || !group) return;
        await indexdb.groupMessages.where({ group_id: group.id }).delete();
        dispatch(initMessageList([]));
        const count = await indexdb.groupMessages.where({ group_id: group?.id }).count();
        if (count === 0) {
          const chat = await indexdb.chats.get(group.id);
          if (chat) {
            if (chat.last_message) {
              chat.last_message.content = '';
            }
            await indexdb.chats.update(chat.id, chat);
            dispatch(updateChat(chat));
          }
        }
      },
    });
  };
  const handleQuitGroup = () => {
    if (!group) return;
    const content = <div className="mb-24">确定退出当前群聊吗</div>;
    quitGroup(group.id, content);
  };
  const handleDisbandGroup = () => {
    if (!group) return;
    const content = <div className="mb-24">确定要解散当前群聊吗</div>;
    disbandGroup(group.id, content);
  };
  return (
    <Drawer
      placement="right"
      closable={false}
      open={open}
      getContainer={false}
      className="pt-80"
      onClose={() => {
        if (onClose) onClose();
      }}
      rootStyle={{
        zIndex: 900,
      }}
      styles={{
        body: {
          backgroundColor: '#F8FAFF',
          padding: '24px 0px 0px 0px',
        },
        mask: {
          backgroundColor: 'transparent',
        },
      }}
    >
      <div className="w-full h-full flex flex-col">
        <div className="w-full flex-none px-24">
          <div className="text-base font-semibold text-tp-gray-900">群聊名称</div>
          <div className="text-sm text-tp-gray-800 mt-4">{currentChat?.name}</div>
        </div>
        <div className="px-24">
          <Divider className="max-w-full flex-none" style={{ margin: '16px 0px' }}></Divider>
        </div>
        <div className="w-full flex-1 flex flex-col max-h-full overflow-y-auto px-24">
          <div className="text-base font-semibold text-tp-gray-900 flex-none pb-16">群成员</div>
          <div>
            <GroupMembers group={group} members={groupMembers} className="mt-16"></GroupMembers>
          </div>
        </div>
        <div className="flex-none">
          <Divider style={{ margin: 0 }}></Divider>
          <List>
            <List.Item style={commonListItemStyle}>
              <Button
                onClick={handleClearGroupMessages}
                danger
                type="text"
                style={commonButtonStyle}
              >
                清空聊天记录
              </Button>
            </List.Item>
            {role && role === GroupMemberRoleType.MEMBER && (
              <List.Item style={commonListItemStyle}>
                <Button onClick={handleQuitGroup} danger type="text" style={commonButtonStyle}>
                  退出群聊
                </Button>
              </List.Item>
            )}
            {role && role === GroupMemberRoleType.MANAGER && (
              <List.Item style={commonListItemStyle}>
                <Button danger onClick={handleDisbandGroup} type="text" style={commonButtonStyle}>
                  解散群聊
                </Button>
              </List.Item>
            )}
          </List>
        </div>
      </div>
    </Drawer>
  );
};

export default GroupDrawer;
