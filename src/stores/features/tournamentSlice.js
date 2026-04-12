import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  items: [],
};
export const tournamentSlice = createSlice({
  name: "tournaments",
  initialState,
  reducers: {
    setTournaments: (state, action) => {
      state.items = action.payload;
    },
  },
});
export const { setTournaments } = tournamentSlice.actions;
