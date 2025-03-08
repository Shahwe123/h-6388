
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { supabase } from '@/integrations/supabase/client';

interface Profile {
  id: string;
  username: string;
  display_name: string;
  avatar_url: string | null;
}

interface Friendship {
  id: string;
  user_id: string;
  friend_id: string;
  status: string;
  created_at: string;
  friend: Profile;
}

interface FriendsState {
  friends: Friendship[];
  pendingRequests: Friendship[];
  isLoading: boolean;
  error: string | null;
}

const initialState: FriendsState = {
  friends: [],
  pendingRequests: [],
  isLoading: false,
  error: null,
};

export const fetchFriends = createAsyncThunk(
  'friends/fetchFriends',
  async (userId: string, { rejectWithValue }) => {
    try {
      // Get confirmed friends where user is the requester
      const { data: outgoingFriends, error: outgoingError } = await supabase
        .from('friendships')
        .select(`
          *,
          friend:friend_id(id, username, display_name, avatar_url)
        `)
        .eq('user_id', userId)
        .eq('status', 'accepted');
      
      if (outgoingError) throw outgoingError;

      // Get confirmed friends where user is the recipient
      const { data: incomingFriends, error: incomingError } = await supabase
        .from('friendships')
        .select(`
          *,
          friend:user_id(id, username, display_name, avatar_url)
        `)
        .eq('friend_id', userId)
        .eq('status', 'accepted');
      
      if (incomingError) throw incomingError;

      // Combine both sets
      const allFriends = [
        ...(outgoingFriends || []),
        ...((incomingFriends || []).map(f => ({
          ...f,
          user_id: f.friend_id,
          friend_id: f.user_id
        })))
      ];
      
      return allFriends as Friendship[];
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchPendingRequests = createAsyncThunk(
  'friends/fetchPendingRequests',
  async (userId: string, { rejectWithValue }) => {
    try {
      // Get pending requests sent to the user
      const { data, error } = await supabase
        .from('friendships')
        .select(`
          *,
          friend:user_id(id, username, display_name, avatar_url)
        `)
        .eq('friend_id', userId)
        .eq('status', 'pending');
      
      if (error) throw error;
      
      return data as Friendship[];
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const sendFriendRequest = createAsyncThunk(
  'friends/sendFriendRequest',
  async ({ userId, friendId }: { userId: string; friendId: string }, { rejectWithValue }) => {
    try {
      const { data, error } = await supabase
        .from('friendships')
        .insert([
          { user_id: userId, friend_id: friendId }
        ])
        .select(`
          *,
          friend:friend_id(id, username, display_name, avatar_url)
        `)
        .single();
      
      if (error) throw error;
      return data as Friendship;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const acceptFriendRequest = createAsyncThunk(
  'friends/acceptFriendRequest',
  async (requestId: string, { rejectWithValue }) => {
    try {
      const { data, error } = await supabase
        .from('friendships')
        .update({ status: 'accepted' })
        .eq('id', requestId)
        .select(`
          *,
          friend:user_id(id, username, display_name, avatar_url)
        `)
        .single();
      
      if (error) throw error;
      return data as Friendship;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const rejectFriendRequest = createAsyncThunk(
  'friends/rejectFriendRequest',
  async (requestId: string, { rejectWithValue }) => {
    try {
      const { error } = await supabase
        .from('friendships')
        .delete()
        .eq('id', requestId);
      
      if (error) throw error;
      return requestId;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

const friendsSlice = createSlice({
  name: 'friends',
  initialState,
  reducers: {
    clearFriends: (state) => {
      state.friends = [];
      state.pendingRequests = [];
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Friends
      .addCase(fetchFriends.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchFriends.fulfilled, (state, action) => {
        state.isLoading = false;
        state.friends = action.payload;
      })
      .addCase(fetchFriends.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Fetch Pending Requests
      .addCase(fetchPendingRequests.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchPendingRequests.fulfilled, (state, action) => {
        state.isLoading = false;
        state.pendingRequests = action.payload;
      })
      .addCase(fetchPendingRequests.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Send Friend Request
      .addCase(sendFriendRequest.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(sendFriendRequest.fulfilled, (state) => {
        state.isLoading = false;
        // The sent request isn't stored in state since the user isn't the recipient
      })
      .addCase(sendFriendRequest.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Accept Friend Request
      .addCase(acceptFriendRequest.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(acceptFriendRequest.fulfilled, (state, action) => {
        state.isLoading = false;
        state.friends.push(action.payload);
        state.pendingRequests = state.pendingRequests.filter(
          request => request.id !== action.payload.id
        );
      })
      .addCase(acceptFriendRequest.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Reject Friend Request
      .addCase(rejectFriendRequest.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(rejectFriendRequest.fulfilled, (state, action) => {
        state.isLoading = false;
        state.pendingRequests = state.pendingRequests.filter(
          request => request.id !== action.payload
        );
      })
      .addCase(rejectFriendRequest.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearFriends } = friendsSlice.actions;
export default friendsSlice.reducer;
