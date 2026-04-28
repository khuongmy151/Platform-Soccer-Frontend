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
    startMatch: (state, action) => {
      const matchId = action.payload;
      const match = state.items.find((m) => m.id === matchId);
      if (match) {
        match._userStarted = true;
      }
    },
  },
});
export const { setMatches, startMatch } = matchSlice.actions;
