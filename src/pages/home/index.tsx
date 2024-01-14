import React from 'react';
import { Button } from 'antd';
import { Link } from 'react-router-dom';
import Background from '../../images/home-page-bg.jpg';

const commonStyle = {
  transition: 'all .2s ease-in',
};

const Home: React.FC = () => {
  return (
    <div className="flex items-center justify-center w-screen h-screen">
      <div className="absolute w-full h-full">
        <img className="w-full h-full object-cover" src={Background} alt="" />
      </div>
      <div className="flex items-center relative z-10">
        <Link to="/sign-up">
          <div
            className="w-240 relative h-48 text-white text-base font-semibold flex items-center justify-center rounded-8 mr-36 border-white overflow-hidden border-[1px] border-solid hover:border-2 hover:text-lg"
            style={commonStyle}
          >
            <div
              className="absolute w-full h-full bg-white opacity-0 hover:opacity-20"
              style={commonStyle}
            ></div>
            <div>注册账户</div>
          </div>
        </Link>
        <Link to="/sign-in">
          <div
            className="w-240 h-48 relative text-white text-base font-semibold flex items-center justify-center rounded-8 border-white overflow-hidden border-[1px] border-solid hover:border-2 hover:text-lg"
            style={commonStyle}
          >
            <div
              className="absolute w-full h-full bg-white opacity-0 hover:opacity-20"
              style={commonStyle}
            ></div>
            <div>登录账户</div>
          </div>
        </Link>
      </div>
    </div>
  );
};

export default Home;
