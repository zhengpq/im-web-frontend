import React from 'react';
import { useSelector } from 'react-redux';
import { List } from 'antd';
import Chat from './chat';
import { selectAllChats } from '@/redux/reducer/chat-list';

const ChatList: React.FC = () => {
  const chatList = useSelector(selectAllChats);

  return (
    <div>
      <List
        split={false}
        dataSource={chatList}
        renderItem={(item) => {
          return (
            <List.Item style={{ padding: 0 }}>
              <Chat key={item.id} {...item}></Chat>
            </List.Item>
          );
        }}
      ></List>
    </div>
  );
};

export default ChatList;
