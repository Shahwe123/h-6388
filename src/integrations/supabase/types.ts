export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      achievements: {
        Row: {
          created_at: string | null
          description: string | null
          game_id: number
          icon_url: string | null
          id: number
          locked_icon_url: string | null
          name: string
          platform: string
          platform_api_name: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          game_id: number
          icon_url?: string | null
          id?: number
          locked_icon_url?: string | null
          name: string
          platform: string
          platform_api_name: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          game_id?: number
          icon_url?: string | null
          id?: number
          locked_icon_url?: string | null
          name?: string
          platform?: string
          platform_api_name?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "achievements_game_id_fkey"
            columns: ["game_id"]
            isOneToOne: false
            referencedRelation: "games"
            referencedColumns: ["id"]
          },
        ]
      }
      friends: {
        Row: {
          created_at: string
          friend_id: string
          id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          friend_id: string
          id?: string
          user_id: string
        }
        Update: {
          created_at?: string
          friend_id?: string
          id?: string
          user_id?: string
        }
        Relationships: []
      }
      games: {
        Row: {
          created_at: string | null
          icon_url: string | null
          id: number
          name: string
          playstation_id: string | null
          steam_app_id: number | null
          updated_at: string | null
          xbox_id: string | null
        }
        Insert: {
          created_at?: string | null
          icon_url?: string | null
          id?: number
          name: string
          playstation_id?: string | null
          steam_app_id?: number | null
          updated_at?: string | null
          xbox_id?: string | null
        }
        Update: {
          created_at?: string | null
          icon_url?: string | null
          id?: number
          name?: string
          playstation_id?: string | null
          steam_app_id?: number | null
          updated_at?: string | null
          xbox_id?: string | null
        }
        Relationships: []
      }
      notifications: {
        Row: {
          created_at: string
          id: string
          message: string | null
          read: boolean
          recipient_id: string
          sender_id: string | null
          sender_username: string | null
          type: string
        }
        Insert: {
          created_at?: string
          id?: string
          message?: string | null
          read?: boolean
          recipient_id: string
          sender_id?: string | null
          sender_username?: string | null
          type: string
        }
        Update: {
          created_at?: string
          id?: string
          message?: string | null
          read?: boolean
          recipient_id?: string
          sender_id?: string | null
          sender_username?: string | null
          type?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          bio: string | null
          cover_url: string | null
          created_at: string
          email: string
          id: string
          is_private: boolean | null
          playstation_username: string | null
          steam_games: Json | null
          steam_id: string | null
          username: string
          xbox_gamertag: string | null
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          cover_url?: string | null
          created_at?: string
          email: string
          id: string
          is_private?: boolean | null
          playstation_username?: string | null
          steam_games?: Json | null
          steam_id?: string | null
          username: string
          xbox_gamertag?: string | null
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          cover_url?: string | null
          created_at?: string
          email?: string
          id?: string
          is_private?: boolean | null
          playstation_username?: string | null
          steam_games?: Json | null
          steam_id?: string | null
          username?: string
          xbox_gamertag?: string | null
        }
        Relationships: []
      }
      user_achievements: {
        Row: {
          achievement_id: number
          created_at: string | null
          id: number
          unlock_time: string | null
          unlocked: boolean
          updated_at: string | null
          user_id: string
        }
        Insert: {
          achievement_id: number
          created_at?: string | null
          id?: number
          unlock_time?: string | null
          unlocked?: boolean
          updated_at?: string | null
          user_id: string
        }
        Update: {
          achievement_id?: number
          created_at?: string | null
          id?: number
          unlock_time?: string | null
          unlocked?: boolean
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_achievements_achievement_id_fkey"
            columns: ["achievement_id"]
            isOneToOne: false
            referencedRelation: "achievements"
            referencedColumns: ["id"]
          },
        ]
      }
      user_games: {
        Row: {
          game_id: number
          platform_name: string
          user_id: string
        }
        Insert: {
          game_id: number
          platform_name: string
          user_id: string
        }
        Update: {
          game_id?: number
          platform_name?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_games_game_id_fkey"
            columns: ["game_id"]
            isOneToOne: false
            referencedRelation: "games"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_games_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      users: {
        Row: {
          avatar_url: string | null
          bio: string | null
          cover_url: string | null
          created_at: string | null
          email: string
          id: string
          is_private: boolean | null
          username: string
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          cover_url?: string | null
          created_at?: string | null
          email: string
          id: string
          is_private?: boolean | null
          username: string
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          cover_url?: string | null
          created_at?: string | null
          email?: string
          id?: string
          is_private?: boolean | null
          username?: string
        }
        Relationships: []
      }
      waitlist: {
        Row: {
          created_at: string
          email: string
          id: string
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
