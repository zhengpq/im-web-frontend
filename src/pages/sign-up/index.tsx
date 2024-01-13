import React from 'react';
import { Button, Form, Input, message } from 'antd';
import crypto from 'crypto-js';
import { type Rule } from 'antd/es/form';
import { Link } from 'react-router-dom';
import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { type User } from '@/types/user';
import request from '../../common/request';
import { UserFieldType } from '@/types/sign-up';
import AvatarUploader from '@/components/avatar-uploader';
import { avatarRules } from '@/rules/avatar-rules';
import { usernameRules } from '@/rules/username-rules';
import { passwordRules } from '@/rules/password-rules';
import useSignIn from '@/hooks/use-sign-in';

type ValidateRule = Record<string, Rule[]>;

const validateRules: ValidateRule = {
  avatar: avatarRules,
  username: usernameRules,
  password: passwordRules,
};

const SignUp: React.FC = () => {
  const [form] = Form.useForm();
  const { signIn } = useSignIn();

  const onFinish = async (values: UserFieldType) => {
    const { username, password, avatar } = values;
    const hashedPassword = crypto.SHA256(password).toString();
    const { data } = await request<User>({
      url: 'users/create',
      method: 'post',
      data: {
        avatar,
        username,
        password: hashedPassword,
      },
    });
    if (data !== null) {
      await message.success({
        content: '注册成功！',
        duration: 1,
      });
      await signIn(username, password);
    }
  };

  const onFinishFailed = (errorInfo: any) => {
    console.log('Failed:', errorInfo);
  };

  return (
    <div className="flex items-center justify-center w-screen h-screen flex-col">
      <Form
        name="sign-up"
        form={form}
        style={{
          width: 400,
        }}
        initialValues={{
          remember: true,
        }}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        autoComplete="off"
        className="w-full"
      >
        <div className="flex justify-center mb-24">
          <AvatarUploader form={form}></AvatarUploader>
        </div>
        <Form.Item<UserFieldType> name="username" rules={validateRules.username}>
          <Input prefix={<UserOutlined className="text-tp-gray-700" />} placeholder="设置用户名" />
        </Form.Item>
        <Form.Item<UserFieldType>
          style={{ marginBottom: '12px' }}
          name="password"
          rules={validateRules.password}
        >
          <Input.Password
            prefix={<LockOutlined className="text-tp-gray-700"></LockOutlined>}
            placeholder="设置密码"
          />
        </Form.Item>
        <Form.Item>
          <div className="flex items-center justify-between text-xs">
            <Link to="/sign-in">已经有账户了，直接去登录</Link>
          </div>
        </Form.Item>
        <Form.Item>
          <Button className="w-full" type="primary" htmlType="submit">
            注册
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default SignUp;
