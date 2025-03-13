import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./slices/userSlice";
import gamesReducer from "./slices/gamesSlice";
import friendsReducer from "./slices/friendsSlice";
import notificationsReducer from "./slices/notificationsSlice";

const store = configureStore({
  reducer: {
    user: userReducer,
    games: gamesReducer,
    friends: friendsReducer,
    notifications: notificationsReducer,
  },
});

export default store;
