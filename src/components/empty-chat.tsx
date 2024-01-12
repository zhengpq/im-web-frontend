import { ChatsCircle } from 'phosphor-react';
import React from 'react';

const EmptyChat: React.FC = () => {
  return (
    <div className="w-full h-full flex items-center justify-center">
      <ChatsCircle size={60} weight="light" className="text-gray-700"></ChatsCircle>
    </div>
  );
};

export default EmptyChat;
