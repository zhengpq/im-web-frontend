import { RootState } from '../store';

export const profileIdSelector = (state: RootState) => {
  return state.profile.value.id;
};
