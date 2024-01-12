import { Button, Modal } from 'antd';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { SignOut } from 'phosphor-react';
import { initProfile, initialProfileState } from '../../redux/reducer/profile';
import request from '../../common/request';
import useLogOut from '@/hooks/use-log-out';

const SignOutButton: React.FC = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const { initState } = useLogOut();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleQuite = () => {
    setIsModalVisible(true);
  };
  const handleCancel = () => {
    setIsModalVisible(false);
  };
  const handleOK = async () => {
    dispatch(initProfile(initialProfileState.value));
    const { data } = await request<{ access_token: string }>({
      method: 'post',
      url: '/auth/logout',
    });
    if (data !== null && !data.access_token) {
      // dispatch(initProfile(initialProfileState.value));
      initState();
      setIsModalVisible(false);
      navigate('/');
    }
  };
  return (
    <>
      <Button
        onClick={handleQuite}
        type="text"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '40px',
          height: '40px',
          padding: '0px',
          color: 'var(--transparent-gray-900)',
        }}
      >
        <SignOut size={24}></SignOut>
      </Button>
      <Modal
        open={isModalVisible}
        onCancel={handleCancel}
        onOk={handleOK}
        centered
        cancelText="取消"
        okText="确定"
      >
        <div>确定要退出当前账户吗？</div>
      </Modal>
    </>
  );
};

export default SignOutButton;
