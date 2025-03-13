
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { supabase } from "@/integrations/supabase/client";

export const fetchFriendsData = createAsyncThunk(
  "friends/fetchFriendsData",
  async (userId, { rejectWithValue }) => {
    try {
      // Fetch friends data
      const { data, error } = await supabase
        .from('friends')
        .select('user_id, friend_id, created_at')
        .eq('user_id', userId);
        
      if (error) throw error;
      
      if (!data || data.length === 0) {
        return [];
      }
      
      const friendIds = data.map(item => item.friend_id);
      
      // Fetch user data for friends
      const { data: userData, error: userError } = await supabase
        .from('profiles')
        .select('id, username, avatar_url')
        .in('id', friendIds);
        
      if (userError) throw userError;
      
      // Format friends data - ensure avatar_url is properly included
      const formattedFriends = data.map(item => {
        const user = userData?.find(p => p.id === item.friend_id);
        return {
          id: `${item.user_id}-${item.friend_id}`,
          friend: {
            id: user?.id || '',
            username: user?.username || 'Unknown User',
            avatar_url: user?.avatar_url || null
          }
        };
      }).filter(friend => friend.friend.id !== '');
      
      return formattedFriends;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const initialState = {
  friends: [],
  loading: false,
  error: null,
};

const friendsSlice = createSlice({
  name: "friends",
  initialState,
  reducers: {
    fetchFriendsStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchFriendsSuccess: (state, action) => {
      state.friends = action.payload;
      state.loading = false;
    },
    fetchFriendsFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    addFriend: (state, action) => {
      state.friends.push(action.payload);
    },
    removeFriend: (state, action) => {
      state.friends = state.friends.filter(
        friend => friend.friend.id !== action.payload
      );
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchFriendsData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFriendsData.fulfilled, (state, action) => {
        state.friends = action.payload;
        state.loading = false;
      })
      .addCase(fetchFriendsData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { 
  fetchFriendsStart, 
  fetchFriendsSuccess, 
  fetchFriendsFailure, 
  addFriend,
  removeFriend 
} = friendsSlice.actions;

export default friendsSlice.reducer;
