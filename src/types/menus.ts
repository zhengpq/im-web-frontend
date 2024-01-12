export enum MenusKey {
  CHATS = 'CHAT',
  FRIENDS = 'FRIENDS',
  SETTINR = 'SETTINR',
}

export interface MenuItem {
  key: MenusKey;
  content: React.ReactNode;
}
