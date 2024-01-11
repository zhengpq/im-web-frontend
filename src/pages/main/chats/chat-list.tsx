import React from 'react';
import { useSelector } from 'react-redux';
import { List } from 'antd';
import Chat from './chat';
import { type RootState } from '@/redux/store';

const ChatList: React.FC = () => {
  const chatList = useSelector((state: RootState) => state.chatPanel.value.chatList);
  const chatFinal = [...chatList];
  chatFinal.sort((a, b) => b.active_time - a.active_time);

  return (
    <div>
      <List
        split={false}
        dataSource={chatFinal}
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
