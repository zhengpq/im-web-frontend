import React, { useState, useEffect } from 'react';
import { Button, Spin } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';
import { MessageAvatarPoi, MessageState, MessageType } from '@/types';
import MessageImage from './message-image';
import Avatar from './avatar';
import { LOADING_START_TIME, TIME_OUT_START_TIME } from '@/const/message';
import { type RootState } from '@/redux/store';
import { IndexdbFriendMessagesRow, IndexdbGroupMessagesRow } from '@/types/indexdb';
import { getIndexdb } from '@/common/indexdb';
import useSendMessage from '@/hooks/use-send-message';
import uploadImage from '@/common/upload-image';
import { changeMessageState } from '@/redux/reducer/message-list';

interface MessageProps {
  username?: string;
  avatar?: string;
  avatarPoi: MessageAvatarPoi;
  message: IndexdbFriendMessagesRow | IndexdbGroupMessagesRow;
  className?: string;
}

const Message: React.FC<MessageProps> = ({
  username,
  avatar,
  avatarPoi = MessageAvatarPoi.LEFT,
  message,
  className,
}) => {
  const dispatch = useDispatch();
  const { sendMessage } = useSendMessage();
  const { currentChat } = useSelector((state: RootState) => state.chatPanel.value);
  const [isStateVisible, setIsStateVisible] = useState(false);
  const { content, type, state, ack_id } = message;
  const indexdb = getIndexdb();

  const handleresend = () => {
    if (!currentChat) return;
    dispatch(changeMessageState({ ackId: ack_id, state: MessageState.SENDING }));
    if (message.type === MessageType.IMAGE) {
      uploadImage(message.content)
        .then((response) => {
          if (response) {
            const tempMessageCopy = { ...message };
            tempMessageCopy.content = response.url;
            sendMessage(currentChat, tempMessageCopy as any);
          }
        })
        .catch((error) => {
          console.error(error);
        });
    } else {
      sendMessage(currentChat, message as any);
    }
  };

  useEffect(() => {
    // 优先使用
    if (state != null) {
      // 对于发送的消息，1s 之后如果没有确定发送成功，进入 loading态，20s 之后显示发送失败
      if (state === MessageState.SENDING) {
        let loadingTimer = 0;
        let timeoutTimer = 0;
        loadingTimer = window.setTimeout(() => {
          setIsStateVisible(true);
          timeoutTimer = window.setTimeout(() => {
            if ('group_id' in message) {
              indexdb?.groupMessages
                .where({ ack_id })
                .modify({ state: MessageState.FAILED })
                .then(() => {
                  dispatch(changeMessageState({ ackId: ack_id, state: MessageState.FAILED }));
                });
            } else {
              indexdb?.friendMessages
                .where({ ack_id })
                .modify({ state: MessageState.FAILED })
                .then(() => {
                  dispatch(changeMessageState({ ackId: ack_id, state: MessageState.FAILED }));
                });
            }
          }, TIME_OUT_START_TIME);
        }, LOADING_START_TIME);
        return () => {
          clearTimeout(timeoutTimer);
          clearTimeout(loadingTimer);
        };
      }
      if (state === MessageState.FAILED) {
        setIsStateVisible(true);
      }
    } else {
      setIsStateVisible(false);
    }
  }, [state, ack_id, dispatch, type]);

  const usernameContent = username ? (
    <div className="text-xs text-tp-gray-700 mb-2">{username}</div>
  ) : null;

  let messageContent = null;
  if (type === MessageType.TEXT) {
    messageContent = (
      <p
        className={`rounded-8 p-12 whitespace-pre-wrap text-sm ${avatarPoi === MessageAvatarPoi.LEFT ? 'bg-white text-tp-gray-900' : 'text-white bg-primary'}`}
      >
        {content}
      </p>
    );
  }
  if (type === MessageType.IMAGE) {
    messageContent = (
      <div className="rounded-4 h-100 overflow-hidden shadow-1-tp-gray-100">
        <MessageImage value={content}></MessageImage>
      </div>
    );
  }

  let statusContent = null;
  if (state === MessageState.SENDING) {
    statusContent = (
      <div className="absolute top-1/2 -translate-y-1/2" style={{ right: 'calc(100% + 4px)' }}>
        <Spin size="small"></Spin>
      </div>
    );
  }
  if (state === MessageState.FAILED) {
    statusContent = (
      <div className="absolute right-0" style={{ top: 'calc(100% + 4px)' }}>
        <div className="whitespace-nowrap flex text-xs items-center text-red">
          <ExclamationCircleOutlined color="var(--red)" />
          <div className="ml-4">发送失败</div>
          <div className="w-1 h-8 bg-tp-gray-100 mx-4 mr-2"></div>
          <Button
            onClick={handleresend}
            danger
            style={{
              fontSize: '12px',
              color: 'var(--red)',
              height: 'fit-content',
              padding: '2px',
              lineHeight: '12px',
            }}
            type="text"
            size="small"
          >
            重新发送
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className={className}>
      {avatarPoi === MessageAvatarPoi.RIGHT && (
        <div className="flex justify-end">
          <div className="flex items-start justify-end max-w-3/5 relative">
            <div className="relative">
              {usernameContent}
              {messageContent}
              {isStateVisible && statusContent}
            </div>
            <Avatar className="ml-8 flex-none" avatar={avatar}></Avatar>
          </div>
        </div>
      )}
      {avatarPoi === MessageAvatarPoi.LEFT && (
        <div className="flex justify-start">
          <div className="flex items-start justify-start max-w-3/5 relative">
            <Avatar className="mr-8 flex-none" avatar={avatar}></Avatar>
            <div className="relative">
              {usernameContent}
              {messageContent}
              {isStateVisible && statusContent}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Message;
