import { Rule, RuleObject } from 'antd/es/form';
import debounce from 'debounce-promise';
import request from '@/common/request';
import { User } from '@/types/user';
import { store } from '@/redux/store';

export const usernameRules: Rule[] = [
  {
    required: true,
    message: '用户名不能为空',
  },
  {
    type: 'string',
    pattern: /^[\w\u4e00-\u9fa5]{4,16}$/,
    message: '用户名包含字母、数字、下划线和中文字符，长度为4-16个字符',
  },
  () => ({
    validator: debounce(async (_: RuleObject, value: any) => {
      const profile = store.getState().profile.value;
      if (profile.username && value === profile.username) {
        await Promise.resolve();
        return;
      }
      if (value === '') {
        await Promise.resolve();
        return;
      }
      const { data } = await request<User>(`users/username/${value}`);
      if (data) {
        return Promise.reject(new Error('此用户名已经被使用，请换一个'));
      }
      await Promise.resolve();
    }, 150),
  }),
];
