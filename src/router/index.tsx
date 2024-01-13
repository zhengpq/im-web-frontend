import React from 'react';
import { type RouteObject, createBrowserRouter, redirect } from 'react-router-dom';
import SignUp from '../pages/sign-up/index';
import SignIn from '../pages/sign-in/index';
import Home from '../pages/home';
import Main from '../pages/main';
import request from '../common/request';
import ChatIndex from '@/pages/main/chats';
import FriendsBook from '@/pages/main/friends';
import SettingIndex from '@/pages/main/setting';

const redirectLoader = async () => {
  try {
    const data = await request({
      url: 'auth/profile',
      method: 'get',
    });
    if (data !== null) {
      return redirect('/main');
    }
    return null;
  } catch (error) {
    return null;
  }
};

export const router: RouteObject[] = [
  {
    path: '/',
    element: <Home></Home>,
    loader: redirectLoader,
    children: [{}],
  },
  {
    path: '/main',
    element: <Main></Main>,
    children: [
      {
        path: '/main/chats',
        element: <ChatIndex></ChatIndex>,
      },
      {
        path: '/main/friends',
        element: <FriendsBook></FriendsBook>,
      },
      {
        path: '/main/setting',
        element: <SettingIndex></SettingIndex>,
      },
    ],
  },
  {
    path: '/sign-up',
    element: <SignUp></SignUp>,
    loader: redirectLoader,
    children: [{}],
  },
  {
    path: '/sign-in',
    element: <SignIn></SignIn>,
    loader: redirectLoader,
    children: [{}],
  },
];

const browserRouter = createBrowserRouter(router);

export default browserRouter;
