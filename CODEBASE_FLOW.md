
# PlatinumPath Codebase Flow Documentation

This document provides a high-level overview of the application flow in PlatinumPath, explaining how different components interact and what happens during key user actions.

## Table of Contents
- [Authentication Flow](#authentication-flow)
- [Navigation and Routing](#navigation-and-routing)
- [Data Management](#data-management)
- [Profile Management](#profile-management)
- [Friends System](#friends-system)
- [Notifications System](#notifications-system)

## Authentication Flow

### User Login Process
1. **Initial Entry**:
   - User navigates to the `/auth` route
   - The `Auth.tsx` component renders with the login form as default

2. **Login Submission**:
   - User enters credentials in `LoginForm.tsx`
   - When form is submitted, the `handleSignIn` function is triggered
   - Redux action `loginStart()` is dispatched to set loading state
   - Supabase `auth.signInWithPassword()` is called with email and password

3. **Authentication Success**:
   - On successful authentication, Redux action `loginSuccess(data)` is dispatched
   - The user session is stored in Redux state
   - A toast notification confirms successful login
   - User is redirected to `/profile` via React Router's `navigate`

4. **Authentication Failure**:
   - If authentication fails, Redux action `loginFailure(error.message)` is dispatched
   - Error message is displayed via toast notification

5. **App-wide Effects**:
   - `Navbar.tsx` updates to show authenticated navigation options
   - Protected routes become accessible
   - User's notification data is fetched via `fetchNotificationsData()`
   - Realtime subscriptions are established for notifications and friends

### User Registration Process
1. **Form Submission**:
   - User fills registration form in `RegisterForm.tsx`
   - Redux action `registerStart()` is dispatched
   - Supabase `auth.signUp()` is called with email, password, and username

2. **Registration Success**:
   - Database trigger `on_auth_user_created` automatically creates a profile entry
   - Redux action `registerSuccess(data)` stores user session
   - Toast notification confirms successful registration
   - User is redirected to `/profile`

3. **Registration Failure**:
   - Redux action `registerFailure(error.message)` is dispatched
   - Error message is displayed in toast notification

### User Logout Process
1. **Logout Initiated**:
   - User clicks "Sign Out" in `Navbar.tsx`
   - `handleSignOut()` function calls Supabase `auth.signOut()`

2. **Logout Effects**:
   - On successful logout, Redux store is cleared with `dispatch(logout())`
   - localStorage/persist storage is cleared
   - User is redirected to `/auth`
   - Toast notification confirms successful sign out

## Navigation and Routing

### Route Protection
1. **Protected Routes**:
   - Routes like `/profile`, `/friends`, `/settings`, `/link-accounts` are wrapped in `<AuthRequired>` component
   - `AuthRequired.tsx` checks for active Supabase session
   - If no session is found, user is redirected to `/auth`
   - Original location is saved for redirect after login

2. **Public Routes**:
   - Routes like `/`, `/beta`, `/auth`, `/leaderboard` are accessible to all users
   - The authentication page (`/auth`) redirects authenticated users to `/profile`

### Navbar Behavior
1. **State-Based Rendering**:
   - `Navbar.tsx` renders different navigation links based on authentication state
   - Uses `NavLinks.tsx` to generate appropriate links
   - Authenticated users see Profile, Friends, Leaderboard, Link Accounts, and Settings
   - Unauthenticated users see Home and Sign In

2. **Mobile Responsiveness**:
   - `MobileMenu.tsx` provides a collapsible menu for smaller screens
   - Toggle button in `Navbar.tsx` controls visibility
   - Includes all the same navigation options as desktop

3. **Special Case - Home Page**:
   - The home page (`/`) uses its own `Header.tsx` instead of `Navbar.tsx`
   - This is handled by the `NavbarWrapper` component in `App.tsx`

## Data Management

### Redux State Management
1. **Store Configuration**:
   - Redux store in `store.js` combines multiple slices
   - `redux-persist` maintains state across page refreshes
   - The store structure includes:
     - `user`: Authentication state and user details
     - `games`: Game-related data
     - `friends`: Friends list and requests
     - `notifications`: User notifications

2. **User Slice Flow**:
   - `userSlice.js` handles all user authentication state
   - Login/register/logout actions update the global state
   - Components like `Navbar.tsx` and `Profile.tsx` react to these state changes

3. **Data Initialization**:
   - `useInitializeData` hook in `App.tsx` loads initial data when user logs in
   - Fetches friends and notifications data
   - Sets up realtime subscriptions for data updates

### Supabase Realtime Subscriptions
1. **Notifications Channel**:
   - Created in `Navbar.tsx` and `useInitializeData.tsx`
   - Listens for INSERT, DELETE, and UPDATE events on notifications table
   - Updates Redux store when new notifications arrive
   - Sets unread indicator in the UI

2. **Friends Channel**:
   - Listens for changes to the friends table
   - Triggers a refresh of friends data on changes
   - Updates UI components that display friend data

## Profile Management

1. **Profile Data Loading**:
   - When user navigates to `/profile`
   - `Profile.tsx` component fetches profile data from Supabase
   - Data includes personal information and linked gaming accounts

2. **Profile Editing**:
   - Profile updates in `Settings.tsx` are sent to Supabase
   - On successful update, Redux action `updateUser()` is dispatched
   - UI reflects changes immediately
   - Toast notification confirms successful update

3. **Gaming Platform Integration**:
   - In `/link-accounts`, users can connect gaming platforms
   - When platforms are linked, profile data is updated
   - Connected accounts appear in `LinkedAccounts` component

## Friends System

1. **Friends List Loading**:
   - `useFriends` hook fetches friend relationships from Supabase
   - Friend profiles are retrieved and formatted for display
   - `FriendsList.tsx` renders the list with profile details

2. **Friend Request Flow**:
   - User searches for others in `UserSearch.tsx`
   - Send request action creates entry in friends_requests table
   - Notification is created for recipient
   - Realtime subscription notifies recipient

3. **Request Acceptance**:
   - Recipient accepts request through notification or friends page
   - New entries created in friends table (bidirectional relationship)
   - Friends list updates through realtime subscription
   - Request is removed from friends_requests table

## Notifications System

1. **Notification Loading**:
   - When user logs in, notifications are fetched via Redux action
   - `NotificationButton.tsx` displays count of unread notifications
   - `NotificationsDropdown.tsx` shows list of notifications

2. **Notification Creation**:
   - New notifications are created by backend operations
   - Friend requests, achievements, etc. trigger notification creation
   - Realtime subscription in `Navbar.tsx` receives notification

3. **Notification Interaction**:
   - Clicking notification marks it as read
   - Action-based notifications (like friend requests) include interaction buttons
   - Clearing notifications removes them from database

4. **Unread Indicators**:
   - Unread notifications trigger visual indicator on bell icon
   - Opening notifications dropdown marks all as read
   - State is managed in `Navbar.tsx` component
