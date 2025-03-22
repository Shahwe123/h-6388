
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  games: [], // List of games user has played
  platforms: [], // Available gaming platforms
  gamePlatforms: [], // Game-platform combinations
  achievements: {}, // Achievements per game (key: gamePlatformId)
  loading: false,
  error: null,
  legacyTrophies: [], // Special legacy/milestone trophies
  trophyFilters: {
    year: 'all',
    platform: 'all',
    genre: 'all',
    type: 'all',
    rarity: 'all',
    milestones: false
  }
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
    setLegacyTrophies: (state, action) => {
      state.legacyTrophies = action.payload;
    },
    markTrophyAsLegacy: (state, action) => {
      const { gamePlatformId, trophyId, isLegacy } = action.payload;
      
      // Update the trophy in the games array
      const gamePlatformIndex = state.gamePlatforms.findIndex(gp => gp.id === gamePlatformId);
      if (gamePlatformIndex >= 0) {
        const gameIndex = state.games.findIndex(game => game.id === state.gamePlatforms[gamePlatformIndex].gameId);
        if (gameIndex >= 0 && state.games[gameIndex].trophies) {
          const trophyIndex = state.games[gameIndex].trophies.findIndex(
            trophy => trophy.id === trophyId
          );
          
          if (trophyIndex >= 0) {
            state.games[gameIndex].trophies[trophyIndex].isLegacy = isLegacy;
          }
        }
      }
      
      // Update the trophy in achievements
      if (state.achievements[gamePlatformId]) {
        const trophyIndex = state.achievements[gamePlatformId].findIndex(
          trophy => trophy.id === trophyId
        );
        
        if (trophyIndex >= 0) {
          state.achievements[gamePlatformId][trophyIndex].isLegacy = isLegacy;
        }
      }
    },
    updateTrophyFilters: (state, action) => {
      state.trophyFilters = {
        ...state.trophyFilters,
        ...action.payload
      };
    },
    pinTrophy: (state, action) => {
      const { gamePlatformId, trophyId, isPinned } = action.payload;
      
      // Update the trophy in the games array
      const gamePlatformIndex = state.gamePlatforms.findIndex(gp => gp.id === gamePlatformId);
      if (gamePlatformIndex >= 0) {
        const gameIndex = state.games.findIndex(game => game.id === state.gamePlatforms[gamePlatformIndex].gameId);
        if (gameIndex >= 0 && state.games[gameIndex].trophies) {
          const trophyIndex = state.games[gameIndex].trophies.findIndex(
            trophy => trophy.id === trophyId
          );
          
          if (trophyIndex >= 0) {
            state.games[gameIndex].trophies[trophyIndex].isPinned = isPinned;
          }
        }
      }
      
      // Update the trophy in achievements
      if (state.achievements[gamePlatformId]) {
        const trophyIndex = state.achievements[gamePlatformId].findIndex(
          trophy => trophy.id === trophyId
        );
        
        if (trophyIndex >= 0) {
          state.achievements[gamePlatformId][trophyIndex].isPinned = isPinned;
        }
      }
    },
  },
});

export const { 
  fetchGamesStart, 
  fetchGamesSuccess, 
  fetchGamesFailure, 
  setPlatforms,
  setGamePlatforms,
  setAchievements,
  setLegacyTrophies,
  markTrophyAsLegacy,
  updateTrophyFilters,
  pinTrophy
} = gamesSlice.actions;

export default gamesSlice.reducer;
