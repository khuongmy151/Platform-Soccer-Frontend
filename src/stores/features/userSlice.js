import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  items: [],
};
export const userSlice = createSlice({
  name: "users",
  initialState,
  reducers: {
    setUsers: (state, action) => {
      state.items = action.payload;
    },
  },
});
export const { setUsers } = userSlice.actions;
