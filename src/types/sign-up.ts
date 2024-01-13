import { UploadChangeParam, UploadFile } from 'antd/es/upload';

export interface UserFieldType {
  avatar: UploadChangeParam<UploadFile>;
  username: string;
  password: string;
}
