
import { createSlice } from "@reduxjs/toolkit";
import storage from 'redux-persist/lib/storage';
const initialState = {
  user: null, // Stores user details
  isAuthenticated: false,
  loading: false,
  error: null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    // 🔹 LOGIN ACTIONS
    loginStart: (state) => {
        state.loading = true;
        state.error = null;
      },
      loginSuccess: (state, action) => {
        state.user = action.payload;
        state.isAuthenticated = true;
        state.loading = false;
      },
      loginFailure: (state, action) => {
        state.loading = false;
        state.error = action.payload;
      },

      // 🔹 REGISTRATION ACTIONS
      registerStart: (state) => {
        state.loading = true;
        state.error = null;
      },
      registerSuccess: (state, action) => {
        state.user = action.payload;
        state.isAuthenticated = true;
        state.loading = false;
      },
      registerFailure: (state, action) => {
        state.loading = false;
        state.error = action.payload;
      },

      // 🔹 LOGOUT ACTION
      logout: (state) => {
        state.user = null;
        state.isAuthenticated = false;
        // Remove dispatch() call since it's not available in reducer
        storage.removeItem('persist:root'); // Clear persisted data
        localStorage.removeItem('persist:root')
      },

      // 🔹 UPDATE USER ACTION
      updateUser: (state, action) => {
        state.user = { ...state.user, ...action.payload };
      },
  },
});

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

export default userSlice.reducer;
