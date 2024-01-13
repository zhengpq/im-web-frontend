import React from 'react';
import { ChatCircleDots, Users, GearSix } from 'phosphor-react';
import { MenusKey } from '@/types/menus';

export const MENUS_CHATS_PATH = '/main/chats';
export const MENUS_FRIENDS_PATH = '/main/friends';
export const MENUS_SETTING_PATH = '/main/setting';

const iconSize = 24;

export const MENUS = [
  [
    {
      key: MenusKey.CHATS,
      path: MENUS_CHATS_PATH,
      icon: <ChatCircleDots size={iconSize} />,
    },
    {
      key: MenusKey.FRIENDS,
      path: MENUS_FRIENDS_PATH,
      icon: <Users size={iconSize} />,
    },
  ],
  [
    {
      key: MenusKey.SETTINR,
      path: MENUS_SETTING_PATH,
      icon: <GearSix size={iconSize} />,
    },
  ],
];
