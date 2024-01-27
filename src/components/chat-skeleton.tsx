import { Divider, Skeleton, Space } from 'antd';
import React, { useMemo } from 'react';

const ChatSkeleton: React.FC = () => {
  const cardList = useMemo(() => {
    return Array.from(new Array(20), (_, index) => index);
  }, []);
  const commonStyle = useMemo(() => {
    return { width: '48px', height: '48px', minWidth: '0px' };
  }, []);
  return (
    <>
      <div className="flex w-screen h-screen items-center justify-center">
        <div className="flex-none w-[100px] shadow-1-r-inset-tp-gray-100 bg-white h-full p-16 flex flex-col items-center">
          <Skeleton.Button active style={commonStyle}></Skeleton.Button>
          <Divider></Divider>
          <Space size="large" direction="vertical">
            <Skeleton.Button active style={commonStyle}></Skeleton.Button>
            <Skeleton.Button active style={commonStyle}></Skeleton.Button>
            <Skeleton.Button active style={commonStyle}></Skeleton.Button>
          </Space>
        </div>
        <div className="flex-1 flex h-full">
          <div className="w-[400px] bg-list flex flex-col flex-none h-screen shadow-1-r-inset-tp-gray-100">
            <div className="py-24 px-16 w-full shadow-1-b-inset-tp-gray-200">
              <Skeleton.Button
                active
                style={{ display: 'block', width: '368px', height: '40px' }}
              ></Skeleton.Button>
            </div>
            <div className="py-24 pr-1 flex-1 h-full overflow-hidden">
              {cardList.map((item) => {
                return (
                  <div key={item} className="flex-1 flex items-start min-w-0 px-16 py-24">
                    <Skeleton.Avatar
                      shape="square"
                      active
                      style={{ width: '44px', height: '44px', borderRadius: '4px' }}
                    ></Skeleton.Avatar>
                    <div className="ml-8 flex-1">
                      <Skeleton.Input
                        active
                        style={{ width: '200px', height: '16px' }}
                      ></Skeleton.Input>
                      <Skeleton.Input
                        active
                        style={{ width: '300px', height: '16px' }}
                      ></Skeleton.Input>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          <div className="flex-1 bg-panel h-full"></div>
        </div>
      </div>
    </>
  );
};

export default ChatSkeleton;
