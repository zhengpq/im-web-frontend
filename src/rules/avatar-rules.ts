import { message } from 'antd';
import { Rule } from 'antd/es/form';

export const avatarTypes = ['image/jpg', 'image/jpeg', 'image/png', 'image/webp'];

export const avatarMaxSize = 1024 * 1024;

export const avatarRatio = 1 / 1;

const typeMessage = '请选择图片文件';
const imageTypeMessage = '只支持 jpg、jpeg、png 和 webp 格式的图片';
const imageSizeMessage = '图片大小不能超过 1M';

export const checkoutImage = async (file: File) => {
  if (!file) {
    return Promise.reject();
  }
  if (typeof file === 'string' && file !== '') {
    await Promise.resolve();
    return;
  }
  const errorMessages = [];
  // 检查是否是图片文件
  if (!file.type.startsWith('image/')) {
    await message.info({
      content: typeMessage,
      duration: 1,
    });
    errorMessages.push(typeMessage);
  }
  // 图片格式只支持 jpg|jpeg|png
  if (!avatarTypes.includes(file.type)) {
    await message.error({
      content: imageTypeMessage,
      duration: 1,
    });
    errorMessages.push(imageTypeMessage);
  }
  // 图片大小检查
  if (file.size > avatarMaxSize) {
    await message.error({
      content: imageSizeMessage,
      duration: 1,
    });
    errorMessages.push(imageSizeMessage);
  }
  if (errorMessages.length > 0) return Promise.reject(errorMessages.join(';'));
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
