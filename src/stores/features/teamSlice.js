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
  },
});
export const { setTeams } = teamSlice.actions;
