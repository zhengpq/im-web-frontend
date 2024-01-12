import React from 'react';
import { Button, Divider, Form, Input, message } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';
import EmptyChat from '@/components/empty-chat';
import AvatarUploader from '@/components/avatar-uploader';
import { UserFieldType } from '@/types/sign-up';
import { usernameRules } from '@/rules/username-rules';
import { RootState } from '@/redux/store';
import request from '@/common/request';
import { User } from '@/types/user';
import { initProfile } from '@/redux/reducer/profile';
import { USER_INFO_UPDATE_FAILED, USER_INFO_UPDATE_SUCCESS } from '@/const/message';

const SettingIndex: React.FC = () => {
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const profile = useSelector((state: RootState) => state.profile.value);
  const fields = [
    {
      name: 'avatar',
      value: profile.avatar,
    },
    {
      name: 'username',
      value: profile.username,
    },
  ];
  const handleSubmit = async (values: UserFieldType) => {
    const { username, avatar } = values;
    const { data } = await request<User>({
      url: 'users/update',
      method: 'post',
      data: {
        user_id: profile.id,
        data: {
          avatar,
          username,
        },
      },
    });
    if (data) {
      message.success(USER_INFO_UPDATE_SUCCESS);
      dispatch(initProfile(data));
    }
  };
  const handleFailed = () => {
    message.error(USER_INFO_UPDATE_FAILED);
  };
  return (
    <>
      <div className="w-[400px] bg-list flex flex-col flex-none h-screen shadow-1-r-inset-tp-gray-100">
        <div className="p-24">
          <Form
            form={form}
            name="change-profile"
            initialValues={{
              remember: true,
            }}
            fields={fields}
            onFinish={handleSubmit}
            onFinishFailed={handleFailed}
            autoComplete="off"
            className="w-full"
          >
            <div>
              <div className="flex justify-center">
                <AvatarUploader form={form}></AvatarUploader>
              </div>
              <Divider></Divider>
              <Form.Item<UserFieldType> name="username" rules={usernameRules}>
                <Input
                  prefix={<UserOutlined className="text-tp-gray-700 text-lg mr-8" />}
                  bordered={false}
                  placeholder="设置用户名"
                />
              </Form.Item>
              <Divider></Divider>
              <Form.Item>
                <Button className="w-full" type="default" htmlType="submit">
                  提交修改
                </Button>
              </Form.Item>
            </div>
          </Form>
        </div>
      </div>
      <div className="flex-1 bg-panel h-full">
        <EmptyChat></EmptyChat>
      </div>
    </>
  );
};

export default SettingIndex;
