import React from 'react';
import ChatPanel from './chat-panel';
import ChatSearch from './chat-search';
import ChatList from './chat-list';

const ChatIndex: React.FC = () => {
  return (
    <>
      <div className="w-[400px] bg-list flex flex-col flex-none h-screen shadow-1-r-inset-tp-gray-100">
        <div className="py-24 px-16 flex items-center w-full shadow-1-b-inset-tp-gray-200">
          <ChatSearch className="flex-1 mr-8"></ChatSearch>
        </div>
        <div className="py-24 pr-1 flex-1 h-full overflow-y-scroll">
          <ChatList></ChatList>
        </div>
      </div>
      <div className="flex-1 bg-panel h-full">
        <ChatPanel></ChatPanel>
      </div>
    </>
  );
};

export default ChatIndex;
