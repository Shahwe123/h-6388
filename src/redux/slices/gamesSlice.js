
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  games: [], // List of games user has played
  platforms: [], // Available gaming platforms
  gamePlatforms: [], // Game-platform combinations
  achievements: {}, // Achievements per game (key: gamePlatformId)
  loading: false,
  error: null
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
    setPlatforms: (state, action) => {
      state.platforms = action.payload;
    },
    setGamePlatforms: (state, action) => {
      state.gamePlatforms = action.payload;
    },
    setAchievements: (state, action) => {
      const { gamePlatformId, achievements } = action.payload;
      state.achievements[gamePlatformId] = achievements;
    },
    pinTrophy: (state, action) => {
      const { gamePlatformId, trophyId, isPinned } = action.payload;
      
      // Update the trophy isPinned property in the game
      const game = state.games.find(g => g.gamePlatformId === gamePlatformId);
      if (game && game.trophies) {
        const trophy = game.trophies.find(t => t.id === trophyId);
        if (trophy) {
          trophy.isPinned = isPinned;
        }
      }
    }
  },
});

export const { 
  fetchGamesStart, 
  fetchGamesSuccess, 
  fetchGamesFailure, 
  setPlatforms,
  setGamePlatforms,
  setAchievements,
  pinTrophy
} = gamesSlice.actions;

export default gamesSlice.reducer;
