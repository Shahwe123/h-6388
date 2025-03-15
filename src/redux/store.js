
import userReducer from "./slices/userSlice";
import gamesReducer from "./slices/gamesSlice";
import friendsReducer from "./slices/friendsSlice";
import notificationsReducer from "./slices/notificationsSlice";
import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage'; // Uses localStorage
import { combineReducers } from 'redux';

// Combine reducers (if you have more in the future)
const appReducer = combineReducers({
    user: userReducer,
    games: gamesReducer,
    friends: friendsReducer,
    notifications: notificationsReducer,
  });

const persistConfig = {
    key: "root",
    storage,
  };

  // Create a persisted reducer
const persistedReducer = persistReducer(persistConfig, appReducer);
export const rootReducer = (state, action) => {
    if (action.type === 'RESET_STATE') {
      return appReducer(undefined, action);  // Reset state to initial values
    }
    return appReducer(state, action);
  };
// const store = configureStore({
//   reducer: {
    // user: userReducer,
    // games: gamesReducer,
    // friends: friendsReducer,
    // notifications: notificationsReducer,
//   },
// });
// Configure store with persisted reducer
const store = configureStore({
    reducer: persistedReducer,
    });

export const persistor = persistStore(store);
export default store;
