
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { supabase } from '@/integrations/supabase/client';

interface Game {
  id: string;
  title: string;
  platform: string;
  image_url: string | null;
  created_at: string;
}

interface UserGame {
  id: string;
  user_id: string;
  game_id: string;
  status: string;
  completion_percentage: number;
  created_at: string;
  game: Game;
}

interface GamesState {
  userGames: UserGame[];
  allGames: Game[];
  isLoading: boolean;
  error: string | null;
}

const initialState: GamesState = {
  userGames: [],
  allGames: [],
  isLoading: false,
  error: null,
};

export const fetchUserGames = createAsyncThunk(
  'games/fetchUserGames',
  async (userId: string, { rejectWithValue }) => {
    try {
      const { data, error } = await supabase
        .from('user_games')
        .select(`
          *,
          game:game_id(*)
        `)
        .eq('user_id', userId);
      
      if (error) throw error;
      return data as UserGame[];
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchAllGames = createAsyncThunk(
  'games/fetchAllGames',
  async (_, { rejectWithValue }) => {
    try {
      const { data, error } = await supabase
        .from('games')
        .select('*');
      
      if (error) throw error;
      return data as Game[];
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const addUserGame = createAsyncThunk(
  'games/addUserGame',
  async ({ userId, gameId }: { userId: string; gameId: string }, { rejectWithValue }) => {
    try {
      const { data, error } = await supabase
        .from('user_games')
        .insert([
          { user_id: userId, game_id: gameId }
        ])
        .select(`
          *,
          game:game_id(*)
        `)
        .single();
      
      if (error) throw error;
      return data as UserGame;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateUserGame = createAsyncThunk(
  'games/updateUserGame',
  async ({ 
    id, 
    status, 
    completion_percentage 
  }: { 
    id: string; 
    status?: string; 
    completion_percentage?: number 
  }, { rejectWithValue }) => {
    try {
      const updates: any = {};
      if (status !== undefined) updates.status = status;
      if (completion_percentage !== undefined) updates.completion_percentage = completion_percentage;
      
      const { data, error } = await supabase
        .from('user_games')
        .update(updates)
        .eq('id', id)
        .select(`
          *,
          game:game_id(*)
        `)
        .single();
      
      if (error) throw error;
      return data as UserGame;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

const gamesSlice = createSlice({
  name: 'games',
  initialState,
  reducers: {
    clearGames: (state) => {
      state.userGames = [];
      state.allGames = [];
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch User Games
      .addCase(fetchUserGames.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchUserGames.fulfilled, (state, action) => {
        state.isLoading = false;
        state.userGames = action.payload;
      })
      .addCase(fetchUserGames.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Fetch All Games
      .addCase(fetchAllGames.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchAllGames.fulfilled, (state, action) => {
        state.isLoading = false;
        state.allGames = action.payload;
      })
      .addCase(fetchAllGames.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Add User Game
      .addCase(addUserGame.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(addUserGame.fulfilled, (state, action) => {
        state.isLoading = false;
        state.userGames.push(action.payload);
      })
      .addCase(addUserGame.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Update User Game
      .addCase(updateUserGame.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateUserGame.fulfilled, (state, action) => {
        state.isLoading = false;
        const index = state.userGames.findIndex(game => game.id === action.payload.id);
        if (index !== -1) {
          state.userGames[index] = action.payload;
        }
      })
      .addCase(updateUserGame.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearGames } = gamesSlice.actions;
export default gamesSlice.reducer;
