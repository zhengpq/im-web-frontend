import { Rule } from 'antd/es/form';

export const passwordRules: Rule[] = [
  {
    required: true,
    message: '密码不能为空',
  },
  {
    type: 'string',
    pattern: /^(?=.*[a-zA-Z])(?=.*\d)\S{8,}$/,
    message: '同时包含数字、字母，且长度在8位以上',
  },
];
