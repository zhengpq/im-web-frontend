import { Button, Checkbox, Form, Input } from 'antd';
import React from 'react';
import { Link } from 'react-router-dom';
import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { UserFieldType } from '@/types/sign-up';
import useSignIn from '@/hooks/use-sign-in';

type FormType = Omit<UserFieldType, 'avatar'>;

const validateRules = {
  username: [
    {
      required: true,
      message: '用户名不能为空',
    },
  ],
  password: [
    {
      required: true,
      message: '请输入正确密码',
    },
  ],
};

const SignIn: React.FC = () => {
  const { signIn } = useSignIn();
  const handleSubmit = async (values: FormType) => {
    const { username, password } = values;
    await signIn(username, password);
  };
  return (
    <div className="flex items-center justify-center w-screen h-screen">
      <div className="flex flex-col items-center">
        <div className="w-72 h-72 rounded-full flex items-center justify-center bg-primary mb-24">
          <LockOutlined
            style={{ fontSize: '32px', fontWeight: 'bold', color: 'white' }}
          ></LockOutlined>
        </div>
        <Form
          name="sign-in"
          style={{
            width: 400,
            maxWidth: 400,
          }}
          initialValues={{
            remember: true,
          }}
          onFinish={handleSubmit}
          autoComplete="off"
          className="w-full"
        >
          <Form.Item<FormType> name="username" rules={validateRules.username}>
            <Input prefix={<UserOutlined className="text-tp-gray-700" />} placeholder="用户名" />
          </Form.Item>
          <Form.Item<FormType>
            name="password"
            style={{ marginBottom: '12px' }}
            rules={validateRules.password}
          >
            <Input.Password
              prefix={<LockOutlined className="text-tp-gray-700"></LockOutlined>}
              placeholder="密码"
            />
          </Form.Item>
          <Form.Item>
            <div className="flex items-center justify-between text-xs">
              {/* <Form.Item name="remember" valuePropName="checked" noStyle>
                <Checkbox>记住我</Checkbox>
              </Form.Item> */}

              <Link to="/sign-up">没有账户，去注册一个！</Link>
            </div>
          </Form.Item>
          <Form.Item>
            <Button className="w-full" type="primary" htmlType="submit">
              登录
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

export default SignIn;
