
import { createSlice } from "@reduxjs/toolkit";
import { calculateNormalizedScore } from "../types/game";

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
      // Process games to add normalized scores
      const games = action.payload.map(game => {
        if (game.trophies && game.trophies.length > 0) {
          // Set platform-specific weights based on trophy counts
          if (!game.platformAchievementWeight) {
            // Determine weight based on platform and trophy count
            switch (game.platform?.toLowerCase()) {
              case 'playstation':
                game.platformAchievementWeight = 1.0;
                break;
              case 'xbox':
                game.platformAchievementWeight = 1.2;
                break;
              case 'steam':
                // Steam often has many more achievements
                game.platformAchievementWeight = game.trophies.length > 100 ? 2.0 : 
                                               game.trophies.length > 50 ? 1.5 : 1.2;
                break;
              default:
                game.platformAchievementWeight = 1.0;
            }
          }
          
          // Calculate normalized score
          game.normalizedScore = calculateNormalizedScore(game);
        }
        return game;
      });
      
      state.games = games;
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
