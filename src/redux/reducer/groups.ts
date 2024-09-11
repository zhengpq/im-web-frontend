import { type PayloadAction, createSlice, createEntityAdapter } from '@reduxjs/toolkit';
import { type GroupRow } from '@/types/group';
import { type RootState } from '../store';

export const groupAdapter = createEntityAdapter<GroupRow>({
  sortComparer: (a, b) => a.created_at - b.created_at,
});

export const groupsSlice = createSlice({
  name: 'groups',
  initialState: groupAdapter.getInitialState(),
  reducers: {
    clearGroupsState(state) {
      groupAdapter.removeAll(state);
    },
    initGroups(state, action: PayloadAction<GroupRow[]>) {
      groupAdapter.setAll(state, action.payload);
    },
    addGroup(state, action: PayloadAction<GroupRow | GroupRow[]>) {
      if (Array.isArray(action.payload)) {
        groupAdapter.addMany(state, action.payload);
      } else {
        groupAdapter.addOne(state, action.payload);
      }
    },
    deleteGroup(state, action: PayloadAction<string>) {
      groupAdapter.removeOne(state, action.payload);
    },
    updateGroup(state, action: PayloadAction<GroupRow>) {
      groupAdapter.updateOne(state, {
        id: action.payload.id,
        changes: action.payload,
      });
    },
  },
});

export const {
  selectById: selectGroupById,
  selectAll: selectAllGroups,
  selectEntities: selectGroupEntities,
  selectIds: selectFriendsIds,
  selectTotal: selectFriendsTotal,
} = groupAdapter.getSelectors((state: RootState) => state.groups);

export const { initGroups, clearGroupsState, addGroup, deleteGroup, updateGroup } =
  groupsSlice.actions;

export default groupsSlice.reducer;
