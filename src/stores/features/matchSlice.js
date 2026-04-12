import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  items: [],
};
export const matchSlice = createSlice({
  name: "matches",
  initialState,
  reducers: {
    setMatches: (state, action) => {
      state.items = action.payload;
    },
  },
});
export const { setMatches } = matchSlice.actions;
