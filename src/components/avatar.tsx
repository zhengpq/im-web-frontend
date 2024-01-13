import React from 'react';
import { Avatar as AntAvatar } from 'antd';

interface AvatarData {
  avatar?: string | string[];
  size?: number;
  className?: string;
}

const Avatar: React.FC<AvatarData> = ({ avatar = '', size = 44, className }) => {
  if (Array.isArray(avatar)) {
    const avatarsFinal = avatar.slice(0, 8);
    let AvatarSize = '100%';
    if (avatarsFinal.length > 4) {
      AvatarSize = '33.33%';
    } else if (avatar.length > 1) {
      AvatarSize = '50%';
    }
    return (
      <div
        className={`flex content-center justify-center flex-wrap-reverse bg-white shadow-1-tp-gray-100 rounded-4 overflow-hidden ${className}`}
        style={{ width: `${size}px`, height: `${size}px` }}
      >
        {avatar.map((item) => (
          <AntAvatar
            key={item}
            shape="square"
            style={{ width: AvatarSize, height: AvatarSize, flex: 'none' }}
            src={item}
          ></AntAvatar>
        ))}
      </div>
    );
  }
  return (
    <div
      className={`flex content-center justify-center flex-wrap-reverse bg-white shadow-1-tp-gray-100 rounded-4 overflow-hidden ${className}`}
      style={{ width: `${size}px`, height: `${size}px` }}
    >
      <AntAvatar
        shape="square"
        style={{ width: '100%', height: '100%', flex: 'none' }}
        src={avatar}
      ></AntAvatar>
    </div>
  );
};

export default Avatar;
