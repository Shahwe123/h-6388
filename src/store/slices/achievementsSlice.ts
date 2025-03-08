
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { supabase } from '@/integrations/supabase/client';

interface Achievement {
  id: string;
  game_id: string;
  title: string;
  description: string | null;
  image_url: string | null;
  points: number;
  created_at: string;
}

interface UserAchievement {
  id: string;
  user_id: string;
  achievement_id: string;
  unlocked_at: string;
  achievement: Achievement;
}

interface AchievementsState {
  userAchievements: UserAchievement[];
  isLoading: boolean;
  error: string | null;
}

const initialState: AchievementsState = {
  userAchievements: [],
  isLoading: false,
  error: null,
};

export const fetchUserAchievements = createAsyncThunk(
  'achievements/fetchUserAchievements',
  async (userId: string, { rejectWithValue }) => {
    try {
      const { data, error } = await supabase
        .from('user_achievements')
        .select(`
          *,
          achievement:achievement_id(*)
        `)
        .eq('user_id', userId);
      
      if (error) throw error;
      return data as UserAchievement[];
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const unlockAchievement = createAsyncThunk(
  'achievements/unlockAchievement',
  async ({ userId, achievementId }: { userId: string; achievementId: string }, { rejectWithValue }) => {
    try {
      const { data, error } = await supabase
        .from('user_achievements')
        .insert([
          { user_id: userId, achievement_id: achievementId }
        ])
        .select(`
          *,
          achievement:achievement_id(*)
        `)
        .single();
      
      if (error) throw error;
      return data as UserAchievement;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

const achievementsSlice = createSlice({
  name: 'achievements',
  initialState,
  reducers: {
    clearAchievements: (state) => {
      state.userAchievements = [];
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch User Achievements
      .addCase(fetchUserAchievements.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchUserAchievements.fulfilled, (state, action) => {
        state.isLoading = false;
        state.userAchievements = action.payload;
      })
      .addCase(fetchUserAchievements.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Unlock Achievement
      .addCase(unlockAchievement.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(unlockAchievement.fulfilled, (state, action) => {
        state.isLoading = false;
        state.userAchievements.push(action.payload);
      })
      .addCase(unlockAchievement.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearAchievements } = achievementsSlice.actions;
export default achievementsSlice.reducer;
