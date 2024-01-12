import React from 'react';

interface ListCardProps {
  active?: boolean;
  children?: React.ReactNode;
  className?: string;
}

const ListCard: React.FC<ListCardProps> = ({ active, children, className }) => {
  return (
    <div className={`cursor-pointer w-full hover:bg-panel ${active ? 'bg-panel' : 'bg-list'}`}>
      {children}
    </div>
  );
};

export default ListCard;
