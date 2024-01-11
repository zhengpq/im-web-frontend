import { Badge } from 'antd';
import React from 'react';

interface BadgeWrapProps {
  count: number;
  style?: React.CSSProperties;
  color?: string;
  className?: string;
}

const BadgeWrap: React.FC<BadgeWrapProps> = ({
  count,
  style,
  color = 'var(--primary-color)',
  className,
}) => {
  return (
    <div className={className} style={style}>
      <Badge
        dot={false}
        showZero={false}
        style={{ height: '18px', lineHeight: '18px', minWidth: '18px' }}
        color={color}
        overflowCount={100}
        count={count}
      ></Badge>
    </div>
  );
};

export default BadgeWrap;
