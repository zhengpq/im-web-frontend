import React from 'react';
import { Button } from 'antd';
import { Link } from 'react-router-dom';

const Home: React.FC = () => {
  return (
    <div className="flex items-center justify-center w-screen h-screen">
      <div className="flex items-center">
        <Link to="/sign-up">
          <Button type="primary" className="mr-16">
            注册账户
          </Button>
        </Link>
        <Link to="/sign-in">
          <Button>登录账户</Button>
        </Link>
      </div>
    </div>
  );
};

export default Home;
