import React, { useState } from 'react';
import { Button, Checkbox, Form, Input, Modal, Space } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { useSelector } from 'react-redux';
import { MagnifyingGlass, XCircle } from 'phosphor-react';
import { type RootState } from '@/redux/store';
import { GroupMemberRoleType } from '@/types/group';
import socket from '@/socket';
import { SOCKET_EVENT_CREATE_GROUP } from '@/const/socket-event';
import Avatar from '@/components/avatar';
import { type FriendRow } from '@/types/friend';
import { GROUP_HELLO_MESSAGE } from '@/const/message';
import { minGroupMembersCount } from '@/const/group';

type FieldType = {
  groupName: string;
  firstMessage?: string;
};

const formInitialValues = {
  groupName: '',
  firstMessage: GROUP_HELLO_MESSAGE,
};

const CreateGroup = () => {
  const [visible, setVisible] = useState(false);
  const [chosenFriends, setChosenFriends] = useState<FriendRow[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [formValue, setFormValue] = useState(formInitialValues);
  const friends = useSelector((state: RootState) => state.friends.value);
  const profile = useSelector((state: RootState) => state.profile);
  const [form] = Form.useForm();

  const handleCancel = () => {
    setChosenFriends([]);
    setFormValue(formInitialValues);
    setVisible(false);
    form.resetFields();
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

  const handleSearch: React.ChangeEventHandler<HTMLInputElement> = (event) => {
    const { value } = event.currentTarget;
    setInputValue(value);
  };

  const handleValuesChange = (changedValues: any, allValues: any) => {
    setFormValue(allValues);
  };

  const handleConfirm = () => {
    const members = chosenFriends.map((item) => ({
      id: item.friend_id,
      role: GroupMemberRoleType.MEMBER,
    }));
    members.push({
      id: profile.value.id,
      role: GroupMemberRoleType.MANAGER,
    });
    socket.emit(SOCKET_EVENT_CREATE_GROUP, {
      from: profile.value.id,
      to: '',
      data: {
        name: formValue.groupName,
        description: '',
        first_message: formValue.firstMessage,
        members,
      },
    });
    setVisible(false);
  };

  let friendsToShow = friends;
  if (inputValue !== '') {
    friendsToShow = friends.filter((item) => item.username.includes(inputValue));
  }

  return (
    <>
      <Button
        type="text"
        style={{ color: 'var(--transparent-gray-800)' }}
        onClick={() => {
          setVisible(true);
        }}
        icon={<PlusOutlined></PlusOutlined>}
      ></Button>
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
          <div
            className="flex-none flex flex-col"
            style={{ width: 'calc(((100% - 1px) / 5) * 2)' }}
          >
            <div className="py-12 pl-12 pr-24">
              <Input
                suffix={
                  <MagnifyingGlass color="var(--transparent-gray-700)" size={18}></MagnifyingGlass>
                }
                onChange={handleSearch}
                placeholder="输入用户名搜索朋友"
              ></Input>
            </div>
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
                  无搜索结果
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
                <div className="text-base font-medium text-tp-gray-800">发起群聊</div>
                <div className="flex items-center text-sm text-tp-gray-700">
                  <div>已选好友</div>
                  <div className="mx-4 font-bold text-primary">{chosenFriends.length}</div>
                  <div>人</div>
                </div>
              </div>
              <div className="h-200 overflow-y-scroll">
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
                  <div className="w-full flex h-200 justify-center items-center text-base font-bold text-tp-gray-700">
                    请先选择好友
                  </div>
                )}
              </div>
              <div className="text-base font-medium py-16 text-tp-gray-800">群信息</div>
              <div>
                <Form
                  form={form}
                  initialValues={{ groupName: '', firstMessage: GROUP_HELLO_MESSAGE }}
                  onValuesChange={handleValuesChange}
                  labelCol={{
                    span: 4,
                  }}
                >
                  <Form.Item<FieldType>
                    label="群名"
                    name="groupName"
                    rules={[{ required: true, message: '请填写群名' }]}
                  >
                    <Input placeholder="请输入群名"></Input>
                  </Form.Item>
                  <Form.Item<FieldType>
                    label="打招呼"
                    name="firstMessage"
                    rules={[{ required: true, message: '请输入一句话跟大家打招呼' }]}
                  >
                    <Input.TextArea
                      style={{ height: '80px' }}
                      placeholder="输入一句话与群里的成员打招呼"
                    ></Input.TextArea>
                  </Form.Item>
                </Form>
              </div>
            </div>
            <div className="flex-none flex items-center justify-center px-24 pt-20">
              <Button className="w-120" type="text" onClick={handleCancel}>
                取消
              </Button>
              <Button
                className="ml-12 w-120"
                type="primary"
                disabled={
                  chosenFriends.length < minGroupMembersCount - 1 ||
                  formValue.groupName === '' ||
                  formValue.firstMessage === ''
                }
                onClick={handleConfirm}
              >
                创建
              </Button>
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default CreateGroup;
