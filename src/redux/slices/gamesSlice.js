import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  games: [], // List of games user has played
  achievements: {}, // Achievements per game (key: gameId)
  loading: false,
  error: null,
};

const gamesSlice = createSlice({
  name: "games",
  initialState,
  reducers: {
    fetchGamesStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchGamesSuccess: (state, action) => {
      state.games = action.payload;
      state.loading = false;
    },
    fetchGamesFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    setAchievements: (state, action) => {
      const { gameId, achievements } = action.payload;
      state.achievements[gameId] = achievements;
    },
  },
});

export const { fetchGamesStart, fetchGamesSuccess, fetchGamesFailure, setAchievements } =
  gamesSlice.actions;
export default gamesSlice.reducer;
