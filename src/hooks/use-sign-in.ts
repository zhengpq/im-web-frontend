import React from 'react';
import crypto from 'crypto-js';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import request from '@/common/request';
import { User } from '@/types/user';
import { createIndexdb } from '@/common/indexdb';
import { initData } from '@/init';
import { initProfile } from '@/redux/reducer/profile';
import socketConnect from '@/common/socket-connect';

const useSignIn = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const signIn = async (username: string, password: string) => {
    const hashedPassword = crypto.SHA256(password).toString();
    const { data } = await request<User>({
      url: 'auth/login',
      method: 'post',
      data: {
        username,
        password: hashedPassword,
      },
    });
    if (data !== null) {
      const indexdb = createIndexdb(data.id);
      if (indexdb) {
        await initData(indexdb);
      }
      socketConnect(data.id);
      navigate('/main');
      dispatch(initProfile(data));
    }
  };
  return {
    signIn,
  };
};

export default useSignIn;
