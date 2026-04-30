import { createSlice } from "@reduxjs/toolkit";

// Key lưu vào localStorage để persist trạng thái LIVE qua navigation
const LS_KEY = "soccer_started_matches";

function getStartedIds() {
  try {
    return JSON.parse(localStorage.getItem(LS_KEY) || "[]");
  } catch {
    return [];
  }
}

function saveStartedId(matchId) {
  const ids = getStartedIds();
  if (!ids.includes(matchId)) {
    ids.push(matchId);
    localStorage.setItem(LS_KEY, JSON.stringify(ids));
  }
}

function removeStartedId(matchId) {
  const ids = getStartedIds().filter((id) => id !== matchId);
  localStorage.setItem(LS_KEY, JSON.stringify(ids));
}

const initialState = {
  items: [],
};

export const matchSlice = createSlice({
  name: "matches",
  initialState,
  reducers: {
    setMatches: (state, action) => {
      // Khi load lại từ API, phục hồi _userStarted từ localStorage
      const startedIds = getStartedIds();
      state.items = action.payload.map((m) => ({
        ...m,
        _userStarted: startedIds.includes(m.id),
      }));
    },
    startMatch: (state, action) => {
      const matchId = action.payload;
      // Lưu vào localStorage để persist qua navigation
      saveStartedId(matchId);
      const match = state.items.find((m) => m.id === matchId);
      if (match) {
        match._userStarted = true;
      }
    },
    finishMatch: (state, action) => {
      const matchId = action.payload;
      // Khi finish, xóa khỏi localStorage (không còn là LIVE nữa)
      removeStartedId(matchId);
      const match = state.items.find((m) => m.id === matchId);
      if (match) {
        match._userStarted = false;
        match.ended_at = new Date().toISOString();
      }
    },
  },
});

export const { setMatches, startMatch, finishMatch } = matchSlice.actions;
