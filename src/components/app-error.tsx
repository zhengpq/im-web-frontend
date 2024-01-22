import { Result } from 'antd';
import React from 'react';

const AppError: React.FC = () => {
  return (
    <div className="flex items-center justify-center">
      <Result
        status="403"
        title="出错了！"
        subTitle="哦喔，好像有地方出错了，重新刷新试试"
      ></Result>
    </div>
  );
};

export default AppError;
