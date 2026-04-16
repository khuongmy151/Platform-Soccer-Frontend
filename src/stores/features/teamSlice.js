import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  items: [],
};
export const teamSlice = createSlice({
  name: "teams",
  initialState,
  reducers: {
    setTeams: (state, action) => {
      state.items = action.payload;
    },
    addTeam: (state, action) => {
      state.items.unshift(action.payload);
    },
    deleteTeam: (state, action) => {
      state.items = state.items.filter((value) => value.id !== action.payload);
    },
    updateTeam: (state, action) => {
      state.items = state.items.filter(
        (value) => value.id !== action.payload.id
      );
      state.items.push(action.payload);
    },
  },
});
export const { setTeams, addTeam, deleteTeam, updateTeam } = teamSlice.actions;
