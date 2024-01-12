import { message } from 'antd';
import { matchPath } from 'react-router-dom';
import browserRouter from '@/router';

// 部分页面不用进行身份验证
const filterPath = ['sign-up', 'sign-in'];

// 401，对于非登录时的请求如果验证失败，用户需要重新登陆
const authError = () => {
  const pathMatch = matchPath('/:path', window.location.pathname);
  if (
    (pathMatch && filterPath.includes(pathMatch.params.path!)) ||
    window.location.pathname === '/'
  )
    return;
  message.info('登录态已失效，请重新登陆', () => {
    browserRouter.navigate('/sign-in');
  });
};

// 1000
const authNoUser = (errorMessage?: string) => {
  message.error(errorMessage);
};

// 1001
const authPasswordError = (errorMessage?: string) => {
  message.error(errorMessage);
};

const ErrorHandlerMap = {
  401: authError,
  1000: authNoUser,
  1001: authPasswordError,
};

export default ErrorHandlerMap;
