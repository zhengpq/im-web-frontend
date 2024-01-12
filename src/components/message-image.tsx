import { Image } from 'antd';
import React from 'react';
import { imagePlaceholder } from '@/const/common';

interface MessageImageProps {
  value: string;
}

const MessageImage: React.FC<MessageImageProps> = ({ value }) => {
  return (
    <Image
      height={100}
      src={value}
      fallback={imagePlaceholder}
      placeholder={imagePlaceholder}
    ></Image>
  );
};

export default MessageImage;
