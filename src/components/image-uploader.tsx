import { Button } from 'antd';
import { Image } from 'phosphor-react';
import React, { useRef } from 'react';
import uploadImage from '@/common/upload-image';
import { MessageType, type ImageUploaderData } from '@/types';
import { IndexdbChatsRow } from '@/types/indexdb';
import useCreateTempMessage from '@/hooks/use-create-temp-message';
import useSendMessage from '@/hooks/use-send-message';

interface ImageUploaderProps {
  chat: IndexdbChatsRow | null;
  disabled?: boolean;
  onChange?: (value: ImageUploaderData | null) => void;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ chat, disabled, onChange }) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const { createTempMessage } = useCreateTempMessage();
  const { sendMessage } = useSendMessage();

  const handleUpload = () => {
    inputRef.current?.click();
  };

  const handleFileChange: React.ChangeEventHandler<HTMLInputElement> = async (event) => {
    if (event.target.files !== null) {
      const file = event.target.files[0];
      if (!file || !chat) return;
      const reader = new FileReader();
      reader.onload = async (loadEvent: ProgressEvent<FileReader>) => {
        if (!loadEvent.target) return;
        const base64Image = loadEvent.target.result as string;
        if (!base64Image) return;
        const tempMessage = await createTempMessage(base64Image, MessageType.IMAGE);
        if (!tempMessage) return;
        uploadImage(file)
          .then((response) => {
            if (response) {
              const tempMessageCopy = { ...tempMessage };
              tempMessageCopy.content = response.url;
              sendMessage(chat, tempMessageCopy);
            }
          })
          .catch((error) => {
            console.error(error);
          });
      };
      reader.readAsDataURL(file);
    }
  };
  return (
    <div className="relative">
      <input
        onChange={handleFileChange}
        ref={inputRef}
        disabled={disabled}
        type="file"
        accept="image/*"
        className="absolute w-0 h-0 opacity-0"
      />
      <Button
        disabled={disabled}
        onClick={handleUpload}
        type="text"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '32px',
          height: '32px',
          padding: 0,
          color: 'var(--transparent-gray-900)',
        }}
      >
        <Image className={disabled ? 'text-tp-gray-600' : 'text-tp-gray-800'} size={24}></Image>
      </Button>
    </div>
  );
};

export default ImageUploader;
