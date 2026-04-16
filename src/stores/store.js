// File cấu hình chung dùng cho toàn bộ dự án
import { configureStore } from "@reduxjs/toolkit";
import { teamSlice } from "./features/teamSlice";
import { matchSlice } from "./features/matchSlice";
import { playerSlice } from "./features/playerSlice";
import { tournamentSlice } from "./features/tournamentSlice";
import { meSlice } from "./features/meSlice";
import { authSlice } from "./features/authSlice";
export const store = configureStore({
  reducer: {
    auth: authSlice.reducer,
    me: meSlice.reducer,
    players: playerSlice.reducer,
    teams: teamSlice.reducer,
    matches: matchSlice.reducer,
    tournaments: tournamentSlice.reducer,
  },
});
