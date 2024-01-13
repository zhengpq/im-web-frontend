import { type PayloadAction, createSlice } from '@reduxjs/toolkit';
import { User } from '@/types/user';

interface ProfileState {
  value: User;
}

export const initialProfileState: ProfileState = {
  value: {
    id: '',
    username: '',
    avatar: '',
    offline_time: 0,
    created_at: 0,
    updated_at: 0,
  },
};

export const profileSlice = createSlice({
  name: 'profile',
  initialState: initialProfileState,
  reducers: {
    clearProfilestate(state) {
      state.value = initialProfileState.value;
    },
    initProfile(state, action: PayloadAction<User>) {
      state.value = action.payload;
      Object.assign(state, action.payload);
    },
  },
});

export const { initProfile, clearProfilestate } = profileSlice.actions;

export default profileSlice.reducer;
