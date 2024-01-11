import { type PayloadAction, createSlice } from '@reduxjs/toolkit';
import { type GroupRow } from '@/types/group';

interface GroupsState {
  value: GroupRow[];
}

export const initialGroupsState: GroupsState = {
  value: [],
};

export const groupsSlice = createSlice({
  name: 'groups',
  initialState: initialGroupsState,
  reducers: {
    clearGroupsState(state) {
      state.value = initialGroupsState.value;
    },
    initGroups(state, action: PayloadAction<GroupRow[]>) {
      state.value = action.payload;
    },
    addGroup(state, action: PayloadAction<GroupRow | GroupRow[]>) {
      if (Array.isArray(action.payload)) {
        state.value.unshift(...action.payload);
      } else {
        state.value.unshift(action.payload);
      }
    },
    deleteGroup(state, action: PayloadAction<string>) {
      const index = state.value.findIndex((item) => item.id === action.payload);
      if (index !== -1) {
        state.value.splice(index, 1);
      }
    },
    updateGroup(state, action: PayloadAction<GroupRow>) {
      const index = state.value.findIndex((item) => item.id === action.payload.id);
      if (index !== -1) {
        state.value[index] = action.payload;
      }
    },
  },
});

export const { initGroups, clearGroupsState, addGroup, deleteGroup, updateGroup } =
  groupsSlice.actions;

export default groupsSlice.reducer;
