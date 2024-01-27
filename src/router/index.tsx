import React, { lazy, Suspense } from 'react';
import { type RouteObject, createBrowserRouter, redirect } from 'react-router-dom';
import SignUp from '../pages/sign-up/index';
import SignIn from '../pages/sign-in/index';
import Home from '../pages/home';
import request from '../common/request';
import ChatSkeleton from '@/components/chat-skeleton';

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

const Main = lazy(() => import('@/pages/main'));
const ChatIndex = lazy(() => import('@/pages/main/chats'));
const FriendsBook = lazy(() => import('@/pages/main/friends'));
const SettingIndex = lazy(() => import('@/pages/main/setting'));

export const router: RouteObject[] = [
  {
    path: '/',
    element: <Home></Home>,
    loader: redirectLoader,
    children: [{}],
  },
  {
    path: '/main',
    element: (
      <Suspense fallback={<ChatSkeleton></ChatSkeleton>}>
        <Main></Main>
      </Suspense>
    ),
    children: [
      {
        path: '/main/chats',
        element: (
          <Suspense fallback={<ChatSkeleton></ChatSkeleton>}>
            <ChatIndex></ChatIndex>
          </Suspense>
        ),
      },
      {
        path: '/main/friends',
        element: (
          <Suspense fallback={<ChatSkeleton></ChatSkeleton>}>
            <FriendsBook></FriendsBook>
          </Suspense>
        ),
      },
      {
        path: '/main/setting',
        element: (
          <Suspense fallback={<ChatSkeleton></ChatSkeleton>}>
            <SettingIndex></SettingIndex>
          </Suspense>
        ),
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
