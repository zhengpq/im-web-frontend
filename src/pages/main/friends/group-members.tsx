import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { Plus, XCircle } from 'phosphor-react';
import { Button, Col, Modal, Row } from 'antd';
import { GroupMember, GroupMemberRoleType, GroupRow } from '@/types/group';
import { RootState } from '@/redux/store';
import Avatar from '@/components/avatar';
import AddGroupMembers from './add-group-members';
import { minGroupMembersCount } from '@/const/group';
import socket from '@/socket';
import { SOCKET_EVENT_DELETE_GROUP_MEMBERS } from '@/const/socket-event';

const { confirm } = Modal;

interface GroupMembersData {
  group?: GroupRow;
  members: GroupMember[];
  hasAddButton?: boolean;
  className?: string;
}

const GroupMembers: React.FC<GroupMembersData> = ({
  group,
  members,
  className,
  hasAddButton = true,
}) => {
  const [isAddModalVisible, setIsAddModalVisible] = useState(false);
  const profile = useSelector((state: RootState) => state.profile.value);
  const role = members.find((item) => item.id === profile.id)?.role;
  const handleDeleteMember = (member: GroupMember) => {
    confirm({
      content: <div className="mb-24">确定要将 {member.username} 移除群聊吗</div>,
      okText: '确定',
      cancelText: '取消',
      styles: {
        body: { paddingTop: '16px' },
      },
      onOk: async () => {
        socket.emit(SOCKET_EVENT_DELETE_GROUP_MEMBERS, {
          from: profile.id,
          to: '',
          data: {
            group_id: group?.id,
            user_ids: [member.id],
          },
        });
      },
    });
  };
  const handleOpenAddModal = () => {
    setIsAddModalVisible(true);
  };
  let content = null;
  if (group) {
    content = (
      <>
        <div className={`${className}`}>
          <Row gutter={[16, 16]}>
            {members.map((member) => {
              return (
                <Col span={4} key={member.id}>
                  <div className="relative">
                    {role === GroupMemberRoleType.MANAGER &&
                      members.length > minGroupMembersCount &&
                      member.id !== profile.id && (
                        <XCircle
                          className="absolute -top-8 -right-8 text-tp-gray-700 z-10"
                          size={16}
                          weight="fill"
                          onClick={() => {
                            handleDeleteMember(member);
                          }}
                        />
                      )}
                    <Avatar avatar={member.avatar}></Avatar>
                  </div>
                </Col>
              );
            })}
            {hasAddButton && (
              <Col span={4}>
                <Button
                  style={{
                    width: '100%',
                    height: '100%',
                    padding: 0,
                    borderRadius: '4px',
                    display: 'flex',
                    border: 'none',
                  }}
                  className="shadow-1-gray-200 flex items-center justify-center"
                  type="text"
                  onClick={handleOpenAddModal}
                >
                  <Plus className="text-gray-500" size={20}></Plus>
                </Button>
              </Col>
            )}
          </Row>
        </div>
        <AddGroupMembers
          group={group}
          visible={isAddModalVisible}
          onCancel={() => {
            setIsAddModalVisible(false);
          }}
          onConfirm={() => {
            setIsAddModalVisible(false);
          }}
        ></AddGroupMembers>
      </>
    );
  }
  return <>{content}</>;
};

export default GroupMembers;
