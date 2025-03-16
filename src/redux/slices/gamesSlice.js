
import { createSlice } from "@reduxjs/toolkit";

/**
 * Initial state for the games slice
 * Contains user's games, achievements, loading state, and error info
 */
const initialState = {
  games: [], // List of games user has played
  achievements: {}, // Achievements per game (key: gameId)
  loading: false,
  error: null,
};

/**
 * Games slice
 * Manages game-related state in the Redux store
 */
const gamesSlice = createSlice({
  name: "games",
  initialState,
  reducers: {
    /**
     * Sets loading state to true when fetching games starts
     */
    fetchGamesStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    /**
     * Updates games state with fetched data when successful
     */
    fetchGamesSuccess: (state, action) => {
      state.games = action.payload;
      state.loading = false;
    },
    /**
     * Sets error state when fetching games fails
     */
    fetchGamesFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    /**
     * Updates achievements for a specific game
     */
    setAchievements: (state, action) => {
      const { gameId, achievements } = action.payload;
      state.achievements[gameId] = achievements;
    },
  },
});

// Export action creators
export const { fetchGamesStart, fetchGamesSuccess, fetchGamesFailure, setAchievements } =
  gamesSlice.actions;

// Export reducer
export default gamesSlice.reducer;
