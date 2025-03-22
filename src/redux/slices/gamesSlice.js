
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  games: [], // List of games user has played
  achievements: {}, // Achievements per game (key: gameId)
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
    setAchievements: (state, action) => {
      const { gameId, achievements } = action.payload;
      state.achievements[gameId] = achievements;
    },
    setLegacyTrophies: (state, action) => {
      state.legacyTrophies = action.payload;
    },
    markTrophyAsLegacy: (state, action) => {
      const { gameId, trophyId, isLegacy } = action.payload;
      
      // Update the trophy in the games array
      const gameIndex = state.games.findIndex(game => game.id === gameId);
      if (gameIndex >= 0 && state.games[gameIndex].trophies) {
        const trophyIndex = state.games[gameIndex].trophies.findIndex(
          trophy => trophy.id === trophyId
        );
        
        if (trophyIndex >= 0) {
          state.games[gameIndex].trophies[trophyIndex].isLegacy = isLegacy;
        }
      }
      
      // Update the trophy in achievements
      if (state.achievements[gameId]) {
        const trophyIndex = state.achievements[gameId].findIndex(
          trophy => trophy.id === trophyId
        );
        
        if (trophyIndex >= 0) {
          state.achievements[gameId][trophyIndex].isLegacy = isLegacy;
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
      const { gameId, trophyId, isPinned } = action.payload;
      
      // Update the trophy in the games array
      const gameIndex = state.games.findIndex(game => game.id === gameId);
      if (gameIndex >= 0 && state.games[gameIndex].trophies) {
        const trophyIndex = state.games[gameIndex].trophies.findIndex(
          trophy => trophy.id === trophyId
        );
        
        if (trophyIndex >= 0) {
          state.games[gameIndex].trophies[trophyIndex].isPinned = isPinned;
        }
      }
    },
  },
});

export const { 
  fetchGamesStart, 
  fetchGamesSuccess, 
  fetchGamesFailure, 
  setAchievements,
  setLegacyTrophies,
  markTrophyAsLegacy,
  updateTrophyFilters,
  pinTrophy
} = gamesSlice.actions;

export default gamesSlice.reducer;
