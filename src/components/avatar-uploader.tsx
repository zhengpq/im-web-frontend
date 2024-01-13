import { Form, type FormInstance, Upload, type UploadProps, message } from 'antd';
import ImgCrop from 'antd-img-crop';
import { PlusOutlined } from '@ant-design/icons';
import React from 'react';
import { type RcFile, type UploadChangeParam, type UploadFile } from 'antd/es/upload';
import { UserFieldType } from '@/types/sign-up';
import {
  avatarMaxSize,
  avatarRatio,
  avatarRules,
  avatarTypes,
  checkoutImage,
} from '@/rules/avatar-rules';
import { BASE_URL } from '@/const/api';

interface IAvatarProps {
  form: FormInstance;
  className?: string;
}

async function loadImage(file: RcFile) {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const image = new Image();
    image.src = URL.createObjectURL(file);
    image.onload = () => {
      resolve(image);
    };
    image.onerror = (error) => {
      reject(error);
    };
  });
}

const AvatarUploader: React.FC<IAvatarProps> = ({ form, className }) => {
  const avatarValue = Form.useWatch('avatar', form);

  const handleImageChange: UploadProps['onChange'] = (info: UploadChangeParam<UploadFile>) => {
    if (info.file.status === 'done') {
      if (info && !info.file.response.data.code) {
        const avatarUrl = info.file.response.data.url;
        // 因为后端编译需要时间，这里延迟保证一定能够拿到文件
        form.setFieldsValue({
          avatar: avatarUrl,
        });
      }
    }
  };
  const handleBeforeCrop = async (file: RcFile) => {
    let result = true;
    const { size } = file;
    const image = await loadImage(file);
    const { width, height } = image;
    if (size > avatarMaxSize) {
      result = false;
    }
    if (Math.abs(width / height - avatarRatio) < 0.001) {
      result = false;
    }
    return result;
  };

  // eslint-disable-next-line
  // const hasContent = !!avatarValue?.file?.response?.data?.url;
  return (
    <Form.Item<UserFieldType>
      name="avatar"
      style={{ marginBottom: '0px' }}
      className={`${className}`}
      rules={avatarRules}
    >
      <ImgCrop
        aspect={avatarRatio}
        quality={1}
        rotationSlider
        showReset
        beforeCrop={handleBeforeCrop}
      >
        <Upload
          name="image"
          accept={avatarTypes.join(',')}
          listType="picture-card"
          showUploadList={false}
          beforeUpload={async (file) => {
            await checkoutImage(file);
          }}
          action={`${BASE_URL}/upload/image`}
          onChange={handleImageChange}
        >
          {avatarValue ? (
            <img className="w-full h-full object-cover rounded-8" src={avatarValue} alt="" />
          ) : (
            <div>
              <PlusOutlined />
              <div
                style={{
                  marginTop: 8,
                }}
              >
                Upload
              </div>
            </div>
          )}
        </Upload>
      </ImgCrop>
    </Form.Item>
  );
};

export default AvatarUploader;
