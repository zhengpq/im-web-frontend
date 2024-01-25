import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { FRIEND_SEND_MESSAGE_DISABLED_MESSAGE } from '@/const/message';
import FriendMessagesList from './friend-messages-list';
import Editor from './editor';
import { getIndexdb } from '@/common/indexdb';
import useFriendDiff from '@/hooks/use-friend-diff';

const FriendChatPanel: React.FC = () => {
  const { friendDiff } = useFriendDiff();
  const [disabled, setDisabled] = useState(false);
  const [disabledMessage, setDisabledMessage] = useState('');
  const { currentChat } = useSelector((state: RootState) => state.chatPanel.value);
  const profile = useSelector((state: RootState) => state.profile.value);
  const friends = useSelector((state: RootState) => state.friends.value);
  const indexdb = getIndexdb();
  if (!currentChat) {
    return null;
  }

  const friend = friends.find((item) => item.friend_id === currentChat.id);

  const judgeFriendExist = async () => {
    const data = await friendDiff(currentChat.id, profile.id);
    if (!data) {
      setDisabled(true);
      setDisabledMessage(FRIEND_SEND_MESSAGE_DISABLED_MESSAGE);
      const localFriend = await indexdb?.friends.get(currentChat.id);
      if (localFriend) {
        indexdb?.friends.delete(currentChat.id);
      }
    }
  };

  useEffect(() => {
    judgeFriendExist();
  }, [currentChat.id]);

  useEffect(() => {
    if (!friend) {
      setDisabled(false);
      setDisabledMessage(FRIEND_SEND_MESSAGE_DISABLED_MESSAGE);
    }
  }, [friend, currentChat.id]);
  return (
    <div className="w-full h-screen flex flex-col">
      <div className="p-24  relative z-[1000] flex-none h-80 flex items-center justify-between w-full text-lg font-bold bg-panelheader shadow-1-b-inset-tp-gray-200">
        <div>
          {currentChat.name}
          {disabled && <div className="text-red mt-4 font-normal text-xs">{disabledMessage}</div>}
        </div>
      </div>
      <FriendMessagesList></FriendMessagesList>
      <div
        className="max-h-1/2 px-16 pb-16 min-h-1/4 flex-none w-full border-solid border-t-[1px] border-t-neutral-200 border-l-0 border-r-0 border-b-0"
        style={{ height: '20vh' }}
      >
        <Editor disabled={disabled}></Editor>
      </div>
    </div>
  );
};

export default FriendChatPanel;
