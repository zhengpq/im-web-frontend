import React, { useMemo } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button, Divider } from 'antd';
import { useSelector } from 'react-redux';
import User from '@/components/user';
import LogOutButton from './log-out-button';
import { MENUS } from '@/const/menus';
import { RootState } from '@/redux/store';
import { FriendRequestStatus } from '@/types/friend';
import { MenusKey } from '@/types/menus';
import BadgeWrap from '@/components/badge-wrap';

interface SidebarProps {
  className?: string;
}

const Sidebar: React.FC<SidebarProps> = ({ className }) => {
  const { pathname } = useLocation();
  const friendRequests = useSelector((state: RootState) => state.friendRequest.value);
  const { chatList } = useSelector((state: RootState) => state.chatPanel.value);
  const commonStyle: React.CSSProperties = useMemo(() => {
    return {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: '40px',
      height: '40px',
      padding: '0px',
    };
  }, []);
  // 新朋友请求
  const newFriendsCount = friendRequests.filter(
    (item) => item?.status === FriendRequestStatus.SENDING,
  ).length;

  // 新信息总数
  const newMessagesCount = chatList.reduce((a, b) => a + b.unread_count, 0);

  return (
    <div
      className={`flex-none w-[100px] shadow-1-r-inset-tp-gray-100 h-full p-16 sha flex flex-col items-center justify-between ${className}`}
    >
      <div>
        <User></User>
        <div className="mt-24">
          {MENUS.map((subMenu, index) => {
            return (
              <>
                {subMenu.map(({ key, path, icon }) => {
                  const active = pathname === path;
                  return (
                    <div className="mt-24 flex justify-center relative" key={key}>
                      <Link key={key} to={path}>
                        {key === MenusKey.FRIENDS && newFriendsCount > 0 && (
                          <BadgeWrap
                            color="var(--red)"
                            className="absolute top-0 right-0 z-10 transform translate-x-1/2 -translate-y-1/2"
                            count={newFriendsCount}
                          ></BadgeWrap>
                        )}
                        {key === MenusKey.CHATS && newMessagesCount > 0 && (
                          <BadgeWrap
                            color="var(--red)"
                            className="absolute top-0 right-0 z-10 transform translate-x-1/2 -translate-y-1/2"
                            count={newMessagesCount}
                          ></BadgeWrap>
                        )}
                        <div
                          className={`${
                            active ? 'bg-primary text-white' : 'text-tp-gray-900'
                          } rounded-10 w-40 h-40 relative `}
                        >
                          <Button
                            type="text"
                            style={{
                              ...commonStyle,
                              color: active ? 'white' : 'var(--transparent-gray-900)',
                            }}
                          >
                            {icon}
                          </Button>
                        </div>
                      </Link>
                    </div>
                  );
                })}
                {index !== MENUS.length - 1 && <Divider className="mt-24"></Divider>}
              </>
            );
          })}
        </div>
      </div>
      <LogOutButton></LogOutButton>
    </div>
  );
};

export default Sidebar;
