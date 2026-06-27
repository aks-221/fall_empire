export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      allocation_history: {
        Row: {
          action: string
          actor_email: string | null
          actor_id: string | null
          allocation_id: string | null
          created_at: string
          id: string
          snapshot: Json | null
        }
        Insert: {
          action: string
          actor_email?: string | null
          actor_id?: string | null
          allocation_id?: string | null
          created_at?: string
          id?: string
          snapshot?: Json | null
        }
        Update: {
          action?: string
          actor_email?: string | null
          actor_id?: string | null
          allocation_id?: string | null
          created_at?: string
          id?: string
          snapshot?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "allocation_history_allocation_id_fkey"
            columns: ["allocation_id"]
            isOneToOne: false
            referencedRelation: "allocations"
            referencedColumns: ["id"]
          },
        ]
      }
      allocations: {
        Row: {
          color: string | null
          created_at: string
          focus: string | null
          id: string
          label: string
          sort_order: number
          source_note: string | null
          source_url: string | null
          status: string
          updated_at: string
          updated_by: string | null
          weight: number | null
        }
        Insert: {
          color?: string | null
          created_at?: string
          focus?: string | null
          id?: string
          label: string
          sort_order?: number
          source_note?: string | null
          source_url?: string | null
          status?: string
          updated_at?: string
          updated_by?: string | null
          weight?: number | null
        }
        Update: {
          color?: string | null
          created_at?: string
          focus?: string | null
          id?: string
          label?: string
          sort_order?: number
          source_note?: string | null
          source_url?: string | null
          status?: string
          updated_at?: string
          updated_by?: string | null
          weight?: number | null
        }
        Relationships: []
      }
      articles: {
        Row: {
          author_id: string | null
          body: string | null
          category: string | null
          cover_url: string | null
          created_at: string
          excerpt: string | null
          id: string
          published_at: string | null
          search_tsv: unknown
          slug: string
          status: string
          title: string
          updated_at: string
        }
        Insert: {
          author_id?: string | null
          body?: string | null
          category?: string | null
          cover_url?: string | null
          created_at?: string
          excerpt?: string | null
          id?: string
          published_at?: string | null
          search_tsv?: unknown
          slug: string
          status?: string
          title: string
          updated_at?: string
        }
        Update: {
          author_id?: string | null
          body?: string | null
          category?: string | null
          cover_url?: string | null
          created_at?: string
          excerpt?: string | null
          id?: string
          published_at?: string | null
          search_tsv?: unknown
          slug?: string
          status?: string
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      brvm_snapshots: {
        Row: {
          created_at: string
          fetched_at: string
          id: string
          message: string
          quotes: Json
          reference_url: string
          source: string
        }
        Insert: {
          created_at?: string
          fetched_at?: string
          id?: string
          message: string
          quotes?: Json
          reference_url: string
          source: string
        }
        Update: {
          created_at?: string
          fetched_at?: string
          id?: string
          message?: string
          quotes?: Json
          reference_url?: string
          source?: string
        }
        Relationships: []
      }
      contact_messages: {
        Row: {
          company: string | null
          created_at: string
          email: string
          id: string
          message: string
          name: string
          phone: string | null
          reference: string
          status: string
        }
        Insert: {
          company?: string | null
          created_at?: string
          email: string
          id?: string
          message: string
          name: string
          phone?: string | null
          reference?: string
          status?: string
        }
        Update: {
          company?: string | null
          created_at?: string
          email?: string
          id?: string
          message?: string
          name?: string
          phone?: string | null
          reference?: string
          status?: string
        }
        Relationships: []
      }
      email_logs: {
        Row: {
          created_at: string
          error: string | null
          id: string
          kind: Database["public"]["Enums"]["email_kind"]
          metadata: Json
          provider_id: string | null
          reference: string
          sent_at: string | null
          status: Database["public"]["Enums"]["email_status"]
          subject: string
          to_email: string
        }
        Insert: {
          created_at?: string
          error?: string | null
          id?: string
          kind: Database["public"]["Enums"]["email_kind"]
          metadata?: Json
          provider_id?: string | null
          reference: string
          sent_at?: string | null
          status?: Database["public"]["Enums"]["email_status"]
          subject: string
          to_email: string
        }
        Update: {
          created_at?: string
          error?: string | null
          id?: string
          kind?: Database["public"]["Enums"]["email_kind"]
          metadata?: Json
          provider_id?: string | null
          reference?: string
          sent_at?: string | null
          status?: Database["public"]["Enums"]["email_status"]
          subject?: string
          to_email?: string
        }
        Relationships: []
      }
      platforms: {
        Row: {
          android_url: string | null
          audience: string | null
          color: string | null
          created_at: string
          description: string | null
          features: string[] | null
          id: string
          ios_url: string | null
          last_activity_at: string | null
          last_release_at: string | null
          logo_url: string | null
          name: string
          release_notes: string | null
          slug: string
          sort_order: number
          status: string
          tagline: string | null
          tech_stack: string[] | null
          updated_at: string
          users_count: number
          web_url: string | null
        }
        Insert: {
          android_url?: string | null
          audience?: string | null
          color?: string | null
          created_at?: string
          description?: string | null
          features?: string[] | null
          id?: string
          ios_url?: string | null
          last_activity_at?: string | null
          last_release_at?: string | null
          logo_url?: string | null
          name: string
          release_notes?: string | null
          slug: string
          sort_order?: number
          status?: string
          tagline?: string | null
          tech_stack?: string[] | null
          updated_at?: string
          users_count?: number
          web_url?: string | null
        }
        Update: {
          android_url?: string | null
          audience?: string | null
          color?: string | null
          created_at?: string
          description?: string | null
          features?: string[] | null
          id?: string
          ios_url?: string | null
          last_activity_at?: string | null
          last_release_at?: string | null
          logo_url?: string | null
          name?: string
          release_notes?: string | null
          slug?: string
          sort_order?: number
          status?: string
          tagline?: string | null
          tech_stack?: string[] | null
          updated_at?: string
          users_count?: number
          web_url?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          display_name: string | null
          id: string
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          display_name?: string | null
          id: string
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          display_name?: string | null
          id?: string
          updated_at?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      claim_first_admin: { Args: never; Returns: boolean }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      notify_admin_email: { Args: never; Returns: string }
      search_articles: {
        Args: { _limit?: number; _query: string }
        Returns: {
          category: string
          cover_url: string
          excerpt: string
          id: string
          published_at: string
          rank: number
          slug: string
          title: string
        }[]
      }
    }
    Enums: {
      app_role: "admin" | "editor"
      email_kind:
        | "contact_receipt"
        | "publication"
        | "allocation_publication"
        | "article_publication"
      email_status: "pending" | "sent" | "failed" | "disabled"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "editor"],
      email_kind: [
        "contact_receipt",
        "publication",
        "allocation_publication",
        "article_publication",
      ],
      email_status: ["pending", "sent", "failed", "disabled"],
    },
  },
} as const
