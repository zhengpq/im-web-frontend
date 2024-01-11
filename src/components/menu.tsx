import React from 'react';
import { type MenuItem, type MenusKey } from '@/types/menus';

export interface MenuProps {
  value?: string | null;
  items?: MenuItem[];
  onChange?: (value: MenusKey) => void;
}

const Menu: React.FC<MenuProps> = ({ value, items, onChange }) => {
  if (items === undefined) return null;
  const handleClick = (key: MenusKey) => {
    if (onChange) {
      onChange(key);
    }
  };
  return (
    <div>
      {items.map((item) => {
        return (
          <div
            key={item.key}
            className={`${value === item.key ? 'text-primary' : 'text-neutral-500'}`}
            onClick={() => {
              handleClick(item.key);
            }}
          >
            {item.content}
          </div>
        );
      })}
    </div>
  );
};

export default Menu;
