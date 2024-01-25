import React from 'react';
import { useSelector } from 'react-redux';
import { type RootState } from '../redux/store';
import Avatar from './avatar';

const User: React.FC = () => {
  const { avatar } = useSelector((state: RootState) => state.profile.value);

  // const popContent = (
  //   <div>
  //     <div className="">
  //       <img src={avatar} className="w-80 h-80 rounded-6" alt="" />
  //       <div className="text-neutral-950">{username}</div>
  //     </div>
  //   </div>
  // );
  // return (
  //   <div>
  //     <Popover trigger="click" arrow={false} placement="rightTop" content={popContent}>
  //       <img src={avatar} className="w-48 h-48 rounded-6" alt="" />
  //     </Popover>
  //   </div>
  // );
  return <Avatar size={48} avatar={avatar}></Avatar>;
};

export default User;
