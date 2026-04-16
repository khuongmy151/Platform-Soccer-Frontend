import { createSlice } from "@reduxjs/toolkit";
const initialState = {
  item: "",
};
export const meSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setMe: (state, action) => {
      state.item = action.payload;
    },
  },
});

export const { setMe } = meSlice.actions;
