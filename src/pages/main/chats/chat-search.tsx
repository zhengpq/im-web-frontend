import { Dropdown, Input, Popover } from 'antd';
import React, { type SyntheticEvent, useCallback, useState } from 'react';
import debounce from 'lodash/debounce';
import { useSelector } from 'react-redux';
import { MagnifyingGlass } from 'phosphor-react';
import { type RootState } from '@/redux/store';
import { type User } from '@/types/user';
import request from '@/common/request';

interface ChatSearchProps {
  className?: string;
}

const ChatSearch: React.FC<ChatSearchProps> = ({ className }) => {
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [searchResult, setSearchResult] = useState<User[]>([]);
  const [isFocus, setIsFocus] = useState(false);
  const userId = useSelector((state: RootState) => state.profile.value.id);

  const handleFocus = () => {
    setIsFocus(true);
  };

  const handleBlur = () => {
    setIsFocus(false);
  };

  const handleOpenChange = (value: boolean) => {
    if (!value && !isFocus) {
      setIsDropdownVisible(false);
    }
    if (value) {
      setIsDropdownVisible(true);
    }
  };
  const handleInputChange = useCallback(
    debounce(
      async (event: SyntheticEvent<HTMLInputElement>) => {
        const keyword = event.currentTarget.value;
        setInputValue(keyword);
        const { data } = await request<User[]>({
          url: `/users/search/${keyword}`,
          method: 'get',
          params: {
            exclude: [userId],
          },
        });
        if (data !== null) {
          setSearchResult(data);
        } else {
          setSearchResult([]);
        }
      },
      200,
      { leading: true, trailing: true },
    ),
    [userId],
  );

  return (
    <div className={className}>
      <Dropdown
        open={isDropdownVisible}
        trigger={['click']}
        onOpenChange={handleOpenChange}
        dropdownRender={() => {
          return (
            <div className="bg-white rounded-4 p-16">
              {inputValue === '' && <div>输入内容搜索聊天记录</div>}
              {searchResult.length === 0 && inputValue !== '' && <div>未找到相关内容</div>}
            </div>
          );
        }}
      >
        <div>
          <Popover content="功能建设中..." placement="right">
            <Input
              disabled
              suffix={
                <MagnifyingGlass color="var(--transparent-gray-700)" size={18}></MagnifyingGlass>
              }
              onFocus={handleFocus}
              onBlur={handleBlur}
              onChange={handleInputChange}
              placeholder="输入内容搜索聊天记录"
            ></Input>
          </Popover>
        </div>
      </Dropdown>
    </div>
  );
};

export default ChatSearch;
