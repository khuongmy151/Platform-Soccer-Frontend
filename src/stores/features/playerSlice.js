import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  items: [],
};
export const playerSlice = createSlice({
  name: "players",
  initialState,
  reducers: {
    setPlayers: (state, action) => {
      state.items = action.payload;
    },
  },
});
export const { setPlayers } = playerSlice.actions;
