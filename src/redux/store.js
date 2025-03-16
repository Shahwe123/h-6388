
import userReducer from "./slices/userSlice";
import gamesReducer from "./slices/gamesSlice";
import friendsReducer from "./slices/friendsSlice";
import notificationsReducer from "./slices/notificationsSlice";
import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage'; // Uses localStorage
import { combineReducers } from 'redux';

/**
 * Combine all reducers into a single root reducer
 */
const appReducer = combineReducers({
    user: userReducer,
    games: gamesReducer,
    friends: friendsReducer,
    notifications: notificationsReducer,
  });

/**
 * Configuration for Redux persist
 * Defines how Redux state should be persisted to localStorage
 */
const persistConfig = {
    key: "root",
    storage,
  };

/**
 * Create a persisted reducer that will save state to localStorage
 */
const persistedReducer = persistReducer(persistConfig, appReducer);

/**
 * Root reducer with additional reset state functionality
 * Allows resetting the entire state to initial values
 */
export const rootReducer = (state, action) => {
    if (action.type === 'RESET_STATE') {
      return appReducer(undefined, action);  // Reset state to initial values
    }
    return appReducer(state, action);
  };

// Alternative non-persisted store configuration (commented out)
// const store = configureStore({
//   reducer: {
    // user: userReducer,
    // games: gamesReducer,
    // friends: friendsReducer,
    // notifications: notificationsReducer,
//   },
// });

/**
 * Configure Redux store with persisted reducer
 */
const store = configureStore({
    reducer: persistedReducer,
    });

/**
 * Create persistor for managing the persistence process
 */
export const persistor = persistStore(store);

/**
 * Export the Redux store as the default export
 */
export default store;
