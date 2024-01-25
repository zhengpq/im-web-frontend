import React, { useEffect, useState } from 'react';
import { Button, Popover } from 'antd';
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
  const [nativeData, setNativeData] = useState(null);
  const handleEmojiSelect = (value: EmojiData) => {
    if (onSelect) {
      const { native } = value;
      onSelect(native);
    }
  };
  useEffect(() => {
    fetch('https://cdn.jsdelivr.net/npm/@emoji-mart/data')
      .then(async (value) => {
        const data = await value.json();
        setNativeData(data);
      })
      .catch((error) => {
        console.log('加载表情包数据失败');
        console.error(error);
      });
  }, []);
  return (
    <div>
      <Popover
        trigger="click"
        placement="top"
        content={
          <Picker
            data={nativeData}
            locale="zh"
            previewPosition="none"
            onEmojiSelect={handleEmojiSelect}
          />
        }
      >
        <Button
          type="text"
          disabled={disabled || !nativeData}
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
