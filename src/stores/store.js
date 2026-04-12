// File cấu hình chung dùng cho toàn bộ dự án
import { configureStore } from "@reduxjs/toolkit";
import { teamSlice } from "./features/teamSlice";
import { userSlice } from "./features/userSlice";
import { matchSlice } from "./features/matchSlice";
import { playerSlice } from "./features/playerSlice";
import { tournamentSlice } from "./features/tournamentSlice";
export const store = configureStore({
  reducer: {
    user: userSlice.reducer,
    players: playerSlice.reducer,
    teams: teamSlice.reducer,
    matches: matchSlice.reducer,
    tournaments: tournamentSlice.reducer,
  },
});
