import React from 'react';
import { Link } from 'react-router-dom';

const Home: React.FC = () => {
  return (
    <div className="flex items-center justify-center w-screen h-screen overflow-hidden relative">
      <div
        className="absolute z-30"
        style={{
          width: '100vh',
          height: '100vh',
          left: '-50vh',
          bottom: '-50vh',
          transform: 'rotate(24deg)',
        }}
      >
        <div
          className="shape-rectangle"
          style={{
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(2, 0, 0, 0.04)',
            border: '2px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '180px',
          }}
        ></div>
      </div>
      <div className="absolute z-30" style={{ width: '100vh', right: '-50vh', top: '-50vh' }}>
        <svg
          className="w-full shape-circle"
          viewBox="0 0 600 600"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle cx="300" cy="300" r="300" fill="white" fillOpacity="0.04" />
          <circle cx="300" cy="300" r="299.5" stroke="white" strokeOpacity="0.1" />
        </svg>
      </div>
      <div
        className="absolute w-full h-full"
        style={{ background: 'linear-gradient(45deg, #BE2D93, #4593E5)' }}
      ></div>
      <div className="flex items-center relative z-40">
        <Link to="/sign-up" className="mr-36">
          <div className="home-button">
            <div className="home-button-bg"></div>
            <div className="home-button-text">注册账户</div>
          </div>
        </Link>
        <Link to="/sign-in">
          <div className="home-button">
            <div className="home-button-bg"></div>
            <div className="home-button-text">登录账户</div>
          </div>
        </Link>
      </div>
    </div>
  );
};

export default Home;
