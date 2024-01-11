import React, { type KeyboardEventHandler, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { Input } from 'antd';
import { type RootState } from '@/redux/store';
import ImageUploader from '@/components/image-uploader';
import Emoji from '@/components/emoji';
import { type ImageUploaderData, MessageType } from '@/types';
import useCreateTempMessage from '@/hooks/use-create-temp-message';
import useSendMessage from '@/hooks/use-send-message';

interface EditorProps {
  disabled?: boolean;
}

const Editor: React.FC<EditorProps> = ({ disabled }) => {
  const { currentChat } = useSelector((state: RootState) => state.chatPanel.value);
  const { createTempMessage } = useCreateTempMessage();
  const { sendMessage } = useSendMessage();
  const [textareaValue, setTextareaValue] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const handleSendMessage = async (content: string, messageType: MessageType) => {
    const tempMessage = await createTempMessage(content, messageType);
    if (!currentChat) return;
    if (!tempMessage) return;
    sendMessage(currentChat, tempMessage);
    setTextareaValue('');
  };
  const handleKeyDown: KeyboardEventHandler<HTMLTextAreaElement> = async (event) => {
    if (textareaRef.current === null) return;
    const { key, shiftKey } = event;
    // shift + enter 是换行，只有 enter 是发送
    if (key === 'Enter') {
      if (!shiftKey) {
        event.preventDefault();
        handleSendMessage(textareaValue, MessageType.TEXT);
        textareaRef.current.value = '';
      }
    }
  };
  const handleChange: React.ChangeEventHandler<HTMLTextAreaElement> = (event) => {
    const { value } = event.target;
    setTextareaValue(value);
  };
  const handleSelectEmoji = (value: string) => {
    setTextareaValue(`${textareaValue}${value}`);
  };
  return (
    <div className="w-full h-full flex flex-col">
      <div className="flex items-center w-full flex-none -ml-4 py-8">
        <ImageUploader chat={currentChat} disabled={disabled}></ImageUploader>
        <Emoji disabled={disabled} onSelect={handleSelectEmoji}></Emoji>
      </div>
      <Input.TextArea
        disabled={disabled}
        value={textareaValue}
        ref={textareaRef}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        style={{ resize: 'none' }}
        className="w-full h-full flex-1 resize-none"
        bordered={false}
      ></Input.TextArea>
    </div>
  );
};

export default Editor;
