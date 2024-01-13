import { initProfile as initProfileReducer } from '@/redux/reducer/profile';
import { store } from '@/redux/store';
import { User } from '@/types/user';
import { createIndexdb } from '@/common/indexdb';
import request from '@/common/request';
import initData from './init-data';

const initProfile = async () => {
  const { data } = await request<User>({
    url: 'auth/profile',
    method: 'get',
  });
  if (data !== null) {
    store.dispatch(initProfileReducer(data));
    const indexdb = createIndexdb(data.id);
    await initData(indexdb);
  }
};

export default initProfile;
