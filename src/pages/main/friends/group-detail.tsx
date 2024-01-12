import React from 'react';
import { useSelector } from 'react-redux';
import { Button, Divider } from 'antd';
import { ChatCircleDots, SignOut, Trash } from 'phosphor-react';
import { RootState } from '@/redux/store';
import Avatar from '@/components/avatar';
import { GroupMemberRoleType } from '@/types/group';
import useStartChat from '@/hooks/use-start-chat';
import { ChatType } from '@/types/chat-panel';
import useDisbandGroup from '@/hooks/use-disband-group';
import useQuitGroup from '@/hooks/use-quit-group';

interface GroupDetailProps {
  id: string;
}

const commonButonStyle: React.CSSProperties = {
  width: '160px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
};

const GroupDetail: React.FC<GroupDetailProps> = ({ id }) => {
  const groups = useSelector((state: RootState) => state.groups.value);
  const profile = useSelector((state: RootState) => state.profile.value);
  const { startChat } = useStartChat();
  const { disbandGroup } = useDisbandGroup();
  const { quitGroup } = useQuitGroup();

  const group = groups.find((item) => item.id === id);

  const handleStartChat = () => {
    if (!group) return;
    const users = group.members;
    startChat(group.id, group.name, users, ChatType.GROUP);
  };

  const handleDisbandGroup = () => {
    if (!group) return;
    const content = <div className="mb-24">确定要解散当前群聊吗</div>;
    disbandGroup(group.id, content);
  };

  const handleQuitGroup = () => {
    if (!group) return;
    const content = <div className="mb-24">确定退出当前群聊吗</div>;
    quitGroup(group.id, content);
  };

  const avatars = group?.members.map((item) => item.avatar);
  let content = null;
  if (group) {
    const role = group.members.find((item) => item.id === profile.id)?.role;
    content = (
      <div className="px-24 pt-60 flex justify-center">
        <div className="flex flex-col items-start justify-center w-fit">
          <div className="flex items-center text-base font-semibold">
            <Avatar size={48} className="mr-16" avatar={avatars}></Avatar>
            <div>{group.name}</div>
          </div>
          <Divider></Divider>
          <div className="flex items-center w-full justify-center">
            <Button onClick={handleStartChat} style={commonButonStyle} className="mr-12">
              <div className="flex items-center">
                <ChatCircleDots className="mr-4" size={18} weight="regular"></ChatCircleDots>
                发消息
              </div>
            </Button>
            {role && role === GroupMemberRoleType.MANAGER && (
              <Button onClick={handleDisbandGroup} style={commonButonStyle} type="text">
                <div className="flex items-center">
                  <Trash className="mr-4" size={18} weight="regular"></Trash>
                  解散群聊
                </div>
              </Button>
            )}
            {role && role === GroupMemberRoleType.MEMBER && (
              <Button onClick={handleQuitGroup} style={commonButonStyle} type="text">
                <div className="flex items-center">
                  <SignOut className="mr-4" size={18} weight="regular"></SignOut>
                  退出群聊
                </div>
              </Button>
            )}
          </div>
        </div>
      </div>
    );
  }
  return <div>{content}</div>;
};

export default GroupDetail;
