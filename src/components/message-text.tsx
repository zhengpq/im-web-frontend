import React from 'react';

interface MessageTextProps {
  value: string;
}

const MessageText: React.FC<MessageTextProps> = ({ value }) => {
  console.log('paki', value.indexOf('\n'));
  return <div className="whitespace-pre-wrap text-sm">{value}</div>;
};

export default MessageText;
