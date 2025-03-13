import { createSlice } from "@reduxjs/toolkit";

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
  },
});

export const { fetchFriendsStart, fetchFriendsSuccess, fetchFriendsFailure, addFriend } =
  friendsSlice.actions;
export default friendsSlice.reducer;
