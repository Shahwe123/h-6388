
/**
 * Interface defining the structure of a user profile
 * Contains personal information and linked gaming accounts
 */
export interface Profile {
  id: string;                     // Unique identifier for the user
  username: string;               // User's display name
  bio?: string;                   // User's biography (optional)
  avatar_url?: string;            // URL to user's profile picture (optional)
  cover_url?: string;             // URL to user's profile cover image (optional)
  steam_id?: string;              // Steam platform ID (optional)
  xbox_gamertag?: string;         // Xbox platform username (optional)
  playstation_username?: string;  // PlayStation platform username (optional)
  is_private?: boolean;           // Whether the profile is private (optional)
}
