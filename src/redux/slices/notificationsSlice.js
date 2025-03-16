
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { supabase } from "@/integrations/supabase/client";

/**
 * Async thunk for fetching notifications data from Supabase
 * @param userId - The ID of the user whose notifications to fetch
 */
export const fetchNotificationsData = createAsyncThunk(
  "notifications/fetchNotificationsData",
  async (userId, { rejectWithValue }) => {
    try {
      // Fetch notifications from Supabase
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('recipient_id', userId)
        .order('created_at', { ascending: false });
        
      if (error) throw error;
      
      return data || [];
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

/**
 * Initial state for the notifications slice
 */
const initialState = {
  notifications: [],  // List of notifications
  loading: false,     // Loading state for async operations
  error: null,        // Error state for async operations
};

/**
 * Notifications slice
 * Manages notification-related state in the Redux store
 */
const notificationsSlice = createSlice({
  name: "notifications",
  initialState,
  reducers: {
    /**
     * Sets the notifications array with new data
     */
    setNotifications: (state, action) => {
      state.notifications = action.payload;
      state.loading = false;
      state.error = null;
    },
    /**
     * Adds a new notification to the array
     */
    addNotification: (state, action) => {
      state.notifications.push(action.payload);
    },
    /**
     * Removes a notification by ID
     */
    removeNotification: (state, action) => {
      state.notifications = state.notifications.filter(
        (notif) => notif.id !== action.payload
      );
    },
    /**
     * Clears all notifications
     */
    clearNotifications: (state) => {
      state.notifications = [];
    },
    /**
     * Sets loading state to true when fetching notifications starts
     */
    fetchNotificationsStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    /**
     * Sets error state when fetching notifications fails
     */
    fetchNotificationsFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Handle the pending state of fetchNotificationsData
      .addCase(fetchNotificationsData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      // Handle the fulfilled state of fetchNotificationsData
      .addCase(fetchNotificationsData.fulfilled, (state, action) => {
        state.notifications = action.payload;
        state.loading = false;
      })
      // Handle the rejected state of fetchNotificationsData
      .addCase(fetchNotificationsData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

// Export action creators
export const { 
  setNotifications, 
  addNotification, 
  removeNotification, 
  clearNotifications,
  fetchNotificationsStart,
  fetchNotificationsFailure
} = notificationsSlice.actions;

// Export reducer
export default notificationsSlice.reducer;
