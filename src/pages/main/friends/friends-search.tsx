import { Dropdown, Input } from 'antd';
import React, { type SyntheticEvent, useCallback, useState, useEffect } from 'react';
import debounce from 'lodash/debounce';
import { useSelector } from 'react-redux';
import { MagnifyingGlass, User as UserIcon } from 'phosphor-react';
import FriendsBookUser from './friends-search-item';
import { type RootState } from '@/redux/store';
import { type User } from '@/types/user';
import request from '@/common/request';

interface FriendsBookSearchProps {
  className?: string;
}

const FriendsSearch: React.FC<FriendsBookSearchProps> = ({ className }) => {
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
      },
      200,
      { leading: true, trailing: true },
    ),
    [userId],
  );

  useEffect(() => {
    let flag = true;
    if (!inputValue) return;
    request<User[]>({
      url: `/users/search/${inputValue}`,
      method: 'get',
      params: {
        user_id: userId,
      },
    })
      .then(({ data }) => {
        if (!flag) return;
        if (data !== null) {
          setSearchResult(data);
        } else {
          setSearchResult([]);
        }
      })
      .catch((error) => {
        console.error(error);
      });
    return () => {
      flag = false;
    };
  }, [inputValue]);

  return (
    <div className={className}>
      <Dropdown
        open={isDropdownVisible}
        trigger={['click']}
        onOpenChange={handleOpenChange}
        dropdownRender={() => {
          return (
            <div className="bg-white shado rounded-4 text-tp-gray-700 text-sm shadow-1">
              {inputValue === '' && (
                <div className="p-16">
                  <div className="text-center py-24 flex flex-col justify-center items-center">
                    <MagnifyingGlass className="text-gray-700 mb-12" size={28} weight="light" />
                    <div>请输入用户名进行搜索</div>
                  </div>
                </div>
              )}
              {searchResult.length === 0 && inputValue !== '' && (
                <div className="p-16">
                  <div className="text-center py-24 flex flex-col items-center justify-center">
                    <UserIcon size={28} className="text-gray-700 mb-12" weight="light" />
                    未找到相关用户
                  </div>
                </div>
              )}
              {searchResult.length !== 0 && inputValue !== '' && (
                <div className="py-16">
                  {searchResult.map((item: User) => (
                    <FriendsBookUser key={item.id} {...item}></FriendsBookUser>
                  ))}
                </div>
              )}
            </div>
          );
        }}
      >
        <Input
          suffix={<MagnifyingGlass color="var(--transparent-gray-700)" size={18}></MagnifyingGlass>}
          style={{
            backgroundColor: 'white',
          }}
          onFocus={handleFocus}
          onBlur={handleBlur}
          onChange={handleInputChange}
          placeholder="输入用户名搜索新朋友"
        ></Input>
      </Dropdown>
    </div>
  );
};

export default FriendsSearch;
