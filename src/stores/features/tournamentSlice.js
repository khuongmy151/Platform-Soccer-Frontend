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
    createTournament: (state, action) => {
      state.items.push(action.payload);
    },
    updateTournament: (state, action) => {
      state.items = state.items.filter(
        (value) => value.id !== action.payload.id
      );
      state.items.push(action.payload);
    },
    deleteTournament: (state, action) => {
      state.items = state.items.filter((value) => value.id !== action.payload);
    },
  },
});
export const {
  setTournaments,
  createTournament,
  updateTournament,
  deleteTournament,
} = tournamentSlice.actions;
