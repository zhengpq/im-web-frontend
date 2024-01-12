import React from 'react';
import { Button, Popover } from 'antd';
import data from '@emoji-mart/data';
import Picker from '@emoji-mart/react';
import { Smiley } from 'phosphor-react';

interface EmojiData {
  id: string;
  keywords: string[];
  name: string;
  native: string;
  shortcodes: string;
  unified: string;
}

interface EmojiProps {
  disabled?: boolean;
  onSelect?: (value: string) => void;
}

const Emoji: React.FC<EmojiProps> = ({ disabled, onSelect }) => {
  const handleEmojiSelect = (value: EmojiData) => {
    if (onSelect) {
      const { native } = value;
      console.log('paki emoji', value);
      onSelect(native);
    }
  };
  return (
    <div>
      <Popover
        trigger="click"
        placement="top"
        content={
          <Picker
            data={data}
            locale="zh"
            previewPosition="none"
            onEmojiSelect={handleEmojiSelect}
          />
        }
      >
        <Button
          type="text"
          disabled={disabled}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '32px',
            height: '32px',
            padding: 0,
            color: 'var(--transparent-gray-900)',
          }}
        >
          <Smiley className={disabled ? 'text-tp-gray-600' : 'text-tp-gray-800'} size={24}></Smiley>
        </Button>
      </Popover>
    </div>
  );
};

export default Emoji;
