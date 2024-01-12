import { message } from 'antd';
import { Rule } from 'antd/es/form';

const avatarTypes = ['image/jpg', 'image/jpeg', 'image/png', 'image/webp'];

export const avatarMaxSize = 1024 * 1024;

export const avatarRatio = 1 / 1;

export const checkoutImage = async (file: File) => {
  if (typeof file === 'string' && file !== '') {
    await Promise.resolve();
    return;
  }
  const messages = [];
  // 检查是否是图片文件
  if (!file.type.startsWith('image/')) {
    messages.push('请选择图片文件');
  }
  // 图片格式只支持 jpg|jpeg|png
  if (!avatarTypes.includes(file.type)) {
    messages.push('只支持 jpg、jpeg 和 png 格式的图片');
  }
  // 图片大小检查
  if (file.size > avatarMaxSize) {
    await message.error('图片大小不能超过 1M');
    messages.push('图片大小不能超过 1M');
  }
  if (messages.length > 0) return Promise.reject(messages.join(';'));
  await Promise.resolve();
};

export const avatarRules: Rule[] = [
  {
    required: true,
    message: '头像不能为空',
  },
  () => ({
    async validator(rule, value: any, callback: any) {
      await checkoutImage(value);
    },
  }),
];
