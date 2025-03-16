
import { createSlice } from "@reduxjs/toolkit";
import storage from 'redux-persist/lib/storage';

/**
 * Initial state for the user slice
 * Contains user authentication state and details
 */
const initialState = {
  user: null, // Stores user details
  isAuthenticated: false,
  loading: false,
  error: null,
};

/**
 * User slice
 * Manages user-related state in the Redux store
 * Handles login, registration, logout, and profile updates
 */
const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    // 🔹 LOGIN ACTIONS
    /**
     * Sets loading state to true when login starts
     */
    loginStart: (state) => {
        state.loading = true;
        state.error = null;
      },
    /**
     * Updates user state when login is successful
     */
    loginSuccess: (state, action) => {
        state.user = action.payload;
        state.isAuthenticated = true;
        state.loading = false;
      },
    /**
     * Sets error state when login fails
     */
    loginFailure: (state, action) => {
        state.loading = false;
        state.error = action.payload;
      },

    // 🔹 REGISTRATION ACTIONS
    /**
     * Sets loading state to true when registration starts
     */
    registerStart: (state) => {
        state.loading = true;
        state.error = null;
      },
    /**
     * Updates user state when registration is successful
     */
    registerSuccess: (state, action) => {
        state.user = action.payload;
        state.isAuthenticated = true;
        state.loading = false;
      },
    /**
     * Sets error state when registration fails
     */
    registerFailure: (state, action) => {
        state.loading = false;
        state.error = action.payload;
      },

    // 🔹 LOGOUT ACTION
    /**
     * Clears user state and authentication when user logs out
     * Also clears persisted state from storage
     */
    logout: (state) => {
        state.user = null;
        state.isAuthenticated = false;
        // Remove dispatch() call since it's not available in reducer
        storage.removeItem('persist:root'); // Clear persisted data
        localStorage.removeItem('persist:root')
      },

    // 🔹 UPDATE USER ACTION
    /**
     * Updates user profile information
     */
    updateUser: (state, action) => {
        state.user = { ...state.user, ...action.payload };
      },
  },
});

// Export action creators
export const {
    loginStart,
    loginSuccess,
    loginFailure,
    registerStart,
    registerSuccess,
    registerFailure,
    logout,
    updateUser,
  } = userSlice.actions;

// Export reducer
export default userSlice.reducer;
