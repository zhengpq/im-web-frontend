import React from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';
import FriendsBook from './friends';
import ChatIndex from './chats';
import Sidebar from './sidebar';
import SettingIndex from './setting';

const Main: React.FC = () => {
  return (
    <div className="flex w-screen h-screen items-center justify-center">
      <Sidebar></Sidebar>
      <div className="flex-1 flex h-full">
        <Routes>
          <Route path="/" element={<Navigate to="/main/chats"></Navigate>}></Route>
          <Route path="/chats" element={<ChatIndex></ChatIndex>}></Route>
          <Route path="/friends" element={<FriendsBook></FriendsBook>}></Route>
          <Route path="/setting" element={<SettingIndex></SettingIndex>}></Route>
        </Routes>
      </div>
    </div>
  );
};

export default Main;
