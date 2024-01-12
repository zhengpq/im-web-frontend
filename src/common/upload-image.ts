import { type ImageUploaderData } from '@/types';
import request from './request';
import { base64ToBlob } from '@/utils/base64-to-Blob';

const uploadImage = async (file: File | null | string) => {
  if (!file) {
    return null;
  }
  const formData = new FormData();
  if (typeof file === 'string') {
    const blobData = base64ToBlob(file);
    if (!blobData) return null;
    const { blob } = blobData;
    formData.append('image', blob);
  } else {
    formData.append('image', file);
  }
  const { data } = await request<ImageUploaderData>({
    url: '/upload/image',
    method: 'post',
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    data: formData,
  });
  return data;
};

export default uploadImage;
