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
    PostgrestVersion: "13.0.4"
  }
  public: {
    Tables: {
      event_analytics: {
        Row: {
          average_match_confidence: number | null
          average_session_time: unknown | null
          bounce_rate: number | null
          conversion_rate: number | null
          created_at: string | null
          event_id: string
          favorites_marked: number | null
          id: string
          peak_usage_hour: number | null
          photos_downloaded: number | null
          photos_shared: number | null
          top_matching_photos: string[] | null
          total_matches_found: number | null
          total_photos_uploaded: number | null
          total_registrations: number | null
          unique_visitors: number | null
          updated_at: string | null
        }
        Insert: {
          average_match_confidence?: number | null
          average_session_time?: unknown | null
          bounce_rate?: number | null
          conversion_rate?: number | null
          created_at?: string | null
          event_id: string
          favorites_marked?: number | null
          id?: string
          peak_usage_hour?: number | null
          photos_downloaded?: number | null
          photos_shared?: number | null
          top_matching_photos?: string[] | null
          total_matches_found?: number | null
          total_photos_uploaded?: number | null
          total_registrations?: number | null
          unique_visitors?: number | null
          updated_at?: string | null
        }
        Update: {
          average_match_confidence?: number | null
          average_session_time?: unknown | null
          bounce_rate?: number | null
          conversion_rate?: number | null
          created_at?: string | null
          event_id?: string
          favorites_marked?: number | null
          id?: string
          peak_usage_hour?: number | null
          photos_downloaded?: number | null
          photos_shared?: number | null
          top_matching_photos?: string[] | null
          total_matches_found?: number | null
          total_photos_uploaded?: number | null
          total_registrations?: number | null
          unique_visitors?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "event_analytics_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: true
            referencedRelation: "event_summary"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "event_analytics_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: true
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
        ]
      }
      event_photos: {
        Row: {
          camera: string | null
          created_at: string | null
          download_count: number | null
          event_id: string
          file_size: number | null
          id: string
          is_featured: boolean | null
          is_public: boolean | null
          location: string | null
          mime_type: string | null
          people_count: number | null
          photographer: string | null
          resolution: string | null
          tags: string[] | null
          timestamp: string | null
          title: string | null
          updated_at: string | null
          url: string
        }
        Insert: {
          camera?: string | null
          created_at?: string | null
          download_count?: number | null
          event_id: string
          file_size?: number | null
          id: string
          is_featured?: boolean | null
          is_public?: boolean | null
          location?: string | null
          mime_type?: string | null
          people_count?: number | null
          photographer?: string | null
          resolution?: string | null
          tags?: string[] | null
          timestamp?: string | null
          title?: string | null
          updated_at?: string | null
          url: string
        }
        Update: {
          camera?: string | null
          created_at?: string | null
          download_count?: number | null
          event_id?: string
          file_size?: number | null
          id?: string
          is_featured?: boolean | null
          is_public?: boolean | null
          location?: string | null
          mime_type?: string | null
          people_count?: number | null
          photographer?: string | null
          resolution?: string | null
          tags?: string[] | null
          timestamp?: string | null
          title?: string | null
          updated_at?: string | null
          url?: string
        }
        Relationships: [
          {
            foreignKeyName: "event_photos_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "event_summary"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "event_photos_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
        ]
      }
      event_users: {
        Row: {
          created_at: string | null
          email: string | null
          event_id: string
          id: string
          last_activity: string | null
          matches_found: number | null
          name: string
          notifications_enabled: boolean | null
          phone_number: string | null
          photos_uploaded: number | null
          preferences: Json | null
          profile_photo_url: string | null
          registration_date: string | null
          status: string | null
          updated_at: string | null
          whatsapp_number: string | null
        }
        Insert: {
          created_at?: string | null
          email?: string | null
          event_id: string
          id: string
          last_activity?: string | null
          matches_found?: number | null
          name: string
          notifications_enabled?: boolean | null
          phone_number?: string | null
          photos_uploaded?: number | null
          preferences?: Json | null
          profile_photo_url?: string | null
          registration_date?: string | null
          status?: string | null
          updated_at?: string | null
          whatsapp_number?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string | null
          event_id?: string
          id?: string
          last_activity?: string | null
          matches_found?: number | null
          name?: string
          notifications_enabled?: boolean | null
          phone_number?: string | null
          photos_uploaded?: number | null
          preferences?: Json | null
          profile_photo_url?: string | null
          registration_date?: string | null
          status?: string | null
          updated_at?: string | null
          whatsapp_number?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "event_users_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "event_summary"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "event_users_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
        ]
      }
      events: {
        Row: {
          created_at: string | null
          date: string
          description: string | null
          id: string
          location: string
          name: string
          registered_users: number | null
          status: string | null
          total_photos: number | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          date: string
          description?: string | null
          id: string
          location: string
          name: string
          registered_users?: number | null
          status?: string | null
          total_photos?: number | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          date?: string
          description?: string | null
          id?: string
          location?: string
          name?: string
          registered_users?: number | null
          status?: string | null
          total_photos?: number | null
          updated_at?: string | null
        }
        Relationships: []
      }
      photo_downloads: {
        Row: {
          created_at: string | null
          download_type: string | null
          id: string
          ip_address: unknown | null
          photo_id: string
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          download_type?: string | null
          id?: string
          ip_address?: unknown | null
          photo_id: string
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          download_type?: string | null
          id?: string
          ip_address?: unknown | null
          photo_id?: string
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "photo_downloads_photo_id_fkey"
            columns: ["photo_id"]
            isOneToOne: false
            referencedRelation: "event_photos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "photo_downloads_photo_id_fkey"
            columns: ["photo_id"]
            isOneToOne: false
            referencedRelation: "photo_details"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "photo_downloads_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "event_users"
            referencedColumns: ["id"]
          },
        ]
      }
      photo_matches: {
        Row: {
          bounding_box: Json | null
          confidence_score: number
          confirmed_by: string | null
          created_at: string | null
          event_id: string
          id: string
          is_confirmed: boolean | null
          match_type: string | null
          photo_id: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          bounding_box?: Json | null
          confidence_score: number
          confirmed_by?: string | null
          created_at?: string | null
          event_id: string
          id?: string
          is_confirmed?: boolean | null
          match_type?: string | null
          photo_id: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          bounding_box?: Json | null
          confidence_score?: number
          confirmed_by?: string | null
          created_at?: string | null
          event_id?: string
          id?: string
          is_confirmed?: boolean | null
          match_type?: string | null
          photo_id?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "photo_matches_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "event_summary"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "photo_matches_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "photo_matches_photo_id_fkey"
            columns: ["photo_id"]
            isOneToOne: false
            referencedRelation: "event_photos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "photo_matches_photo_id_fkey"
            columns: ["photo_id"]
            isOneToOne: false
            referencedRelation: "photo_details"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "photo_matches_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "event_users"
            referencedColumns: ["id"]
          },
        ]
      }
      photographers: {
        Row: {
          bio: string | null
          created_at: string | null
          experience_years: number | null
          id: string
          image_url: string | null
          location: string
          name: string
          portfolio_count: number | null
          price: string
          rating: number | null
          reviews: number | null
          specialization: string
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          bio?: string | null
          created_at?: string | null
          experience_years?: number | null
          id?: string
          image_url?: string | null
          location: string
          name: string
          portfolio_count?: number | null
          price: string
          rating?: number | null
          reviews?: number | null
          specialization: string
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          bio?: string | null
          created_at?: string | null
          experience_years?: number | null
          id?: string
          image_url?: string | null
          location?: string
          name?: string
          portfolio_count?: number | null
          price?: string
          rating?: number | null
          reviews?: number | null
          specialization?: string
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      popular_tags: {
        Row: {
          count: number | null
          created_at: string | null
          event_id: string
          id: string
          tag: string
          trending_score: number | null
          updated_at: string | null
        }
        Insert: {
          count?: number | null
          created_at?: string | null
          event_id: string
          id?: string
          tag: string
          trending_score?: number | null
          updated_at?: string | null
        }
        Update: {
          count?: number | null
          created_at?: string | null
          event_id?: string
          id?: string
          tag?: string
          trending_score?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "popular_tags_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "event_summary"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "popular_tags_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
        ]
      }
      registration_trends: {
        Row: {
          count: number | null
          created_at: string | null
          cumulative_count: number | null
          date: string
          event_id: string
          id: string
          updated_at: string | null
        }
        Insert: {
          count?: number | null
          created_at?: string | null
          cumulative_count?: number | null
          date: string
          event_id: string
          id?: string
          updated_at?: string | null
        }
        Update: {
          count?: number | null
          created_at?: string | null
          cumulative_count?: number | null
          date?: string
          event_id?: string
          id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "registration_trends_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "event_summary"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "registration_trends_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
        ]
      }
      rentals: {
        Row: {
          available: boolean | null
          category: string
          created_at: string | null
          description: string | null
          id: number
          image_url: string | null
          location: string
          name: string
          owner_id: string | null
          price: string
          rating: number | null
          updated_at: string | null
        }
        Insert: {
          available?: boolean | null
          category: string
          created_at?: string | null
          description?: string | null
          id?: number
          image_url?: string | null
          location: string
          name: string
          owner_id?: string | null
          price: string
          rating?: number | null
          updated_at?: string | null
        }
        Update: {
          available?: boolean | null
          category?: string
          created_at?: string | null
          description?: string | null
          id?: number
          image_url?: string | null
          location?: string
          name?: string
          owner_id?: string | null
          price?: string
          rating?: number | null
          updated_at?: string | null
        }
        Relationships: []
      }
      user_demographics: {
        Row: {
          age_group: string
          count: number | null
          created_at: string | null
          event_id: string
          gender: string | null
          gender_count: number | null
          id: string
          updated_at: string | null
        }
        Insert: {
          age_group: string
          count?: number | null
          created_at?: string | null
          event_id: string
          gender?: string | null
          gender_count?: number | null
          id?: string
          updated_at?: string | null
        }
        Update: {
          age_group?: string
          count?: number | null
          created_at?: string | null
          event_id?: string
          gender?: string | null
          gender_count?: number | null
          id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_demographics_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "event_summary"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_demographics_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
        ]
      }
      user_favorites: {
        Row: {
          created_at: string | null
          id: string
          photo_id: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          photo_id: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          photo_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_favorites_photo_id_fkey"
            columns: ["photo_id"]
            isOneToOne: false
            referencedRelation: "event_photos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_favorites_photo_id_fkey"
            columns: ["photo_id"]
            isOneToOne: false
            referencedRelation: "photo_details"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_favorites_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "event_users"
            referencedColumns: ["id"]
          },
        ]
      }
      // New tables for enhanced features
      bookings: {
        Row: {
          assigned_team: Json | null
          budget_max: number | null
          budget_min: number | null
          cancellation_date: string | null
          cancellation_reason: string | null
          contract_url: string | null
          created_at: string | null
          created_by: string | null
          currency: string | null
          customer_id: string
          deposit_amount: number | null
          deposit_paid: boolean | null
          duration_hours: number | null
          event_date: string
          event_time: string | null
          event_type: string
          final_payment_due: string | null
          id: string
          invoice_url: string | null
          location: string
          photographer_id: string
          requirements: string | null
          special_requests: string | null
          status: string | null
          total_amount: number | null
          updated_at: string | null
        }
        Insert: {
          assigned_team?: Json | null
          budget_max?: number | null
          budget_min?: number | null
          cancellation_date?: string | null
          cancellation_reason?: string | null
          contract_url?: string | null
          created_at?: string | null
          created_by?: string | null
          currency?: string | null
          customer_id: string
          deposit_amount?: number | null
          deposit_paid?: boolean | null
          duration_hours?: number | null
          event_date: string
          event_time?: string | null
          event_type: string
          final_payment_due?: string | null
          id?: string
          invoice_url?: string | null
          location: string
          photographer_id: string
          requirements?: string | null
          special_requests?: string | null
          status?: string | null
          total_amount?: number | null
          updated_at?: string | null
        }
        Update: {
          assigned_team?: Json | null
          budget_max?: number | null
          budget_min?: number | null
          cancellation_date?: string | null
          cancellation_reason?: string | null
          contract_url?: string | null
          created_at?: string | null
          created_by?: string | null
          currency?: string | null
          customer_id?: string
          deposit_amount?: number | null
          deposit_paid?: boolean | null
          duration_hours?: number | null
          event_date?: string
          event_time?: string | null
          event_type?: string
          final_payment_due?: string | null
          id?: string
          invoice_url?: string | null
          location?: string
          photographer_id?: string
          requirements?: string | null
          special_requests?: string | null
          status?: string | null
          total_amount?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "bookings_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "event_users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bookings_photographer_id_fkey"
            columns: ["photographer_id"]
            isOneToOne: false
            referencedRelation: "event_users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bookings_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "event_users"
            referencedColumns: ["id"]
          },
        ]
      }
      booking_notes: {
        Row: {
          author_id: string
          booking_id: string
          content: string
          created_at: string | null
          id: string
          is_private: boolean | null
          note_type: string | null
          title: string | null
          updated_at: string | null
        }
        Insert: {
          author_id: string
          booking_id: string
          content: string
          created_at?: string | null
          id?: string
          is_private?: boolean | null
          note_type?: string | null
          title?: string | null
          updated_at?: string | null
        }
        Update: {
          author_id?: string
          booking_id?: string
          content?: string
          created_at?: string | null
          id?: string
          is_private?: boolean | null
          note_type?: string | null
          title?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "booking_notes_booking_id_fkey"
            columns: ["booking_id"]
            isOneToOne: false
            referencedRelation: "bookings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "booking_notes_author_id_fkey"
            columns: ["author_id"]
            isOneToOne: false
            referencedRelation: "event_users"
            referencedColumns: ["id"]
          },
        ]
      }
      chat_messages: {
        Row: {
          chat_id: string
          content: string
          created_at: string | null
          edited_at: string | null
          file_name: string | null
          file_size: number | null
          file_url: string | null
          id: string
          is_edited: boolean | null
          message_type: string | null
          reply_to_id: string | null
          sender_id: string
          updated_at: string | null
        }
        Insert: {
          chat_id: string
          content: string
          created_at?: string | null
          edited_at?: string | null
          file_name?: string | null
          file_size?: number | null
          file_url?: string | null
          id?: string
          is_edited?: boolean | null
          message_type?: string | null
          reply_to_id?: string | null
          sender_id: string
          updated_at?: string | null
        }
        Update: {
          chat_id?: string
          content?: string
          created_at?: string | null
          edited_at?: string | null
          file_name?: string | null
          file_size?: number | null
          file_url?: string | null
          id?: string
          is_edited?: boolean | null
          message_type?: string | null
          reply_to_id?: string | null
          sender_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "chat_messages_chat_id_fkey"
            columns: ["chat_id"]
            isOneToOne: false
            referencedRelation: "chats"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "chat_messages_sender_id_fkey"
            columns: ["sender_id"]
            isOneToOne: false
            referencedRelation: "event_users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "chat_messages_reply_to_id_fkey"
            columns: ["reply_to_id"]
            isOneToOne: false
            referencedRelation: "chat_messages"
            referencedColumns: ["id"]
          },
        ]
      }
      chat_participants: {
        Row: {
          chat_id: string
          id: string
          is_active: boolean | null
          joined_at: string | null
          last_read_at: string | null
          role: string | null
          user_id: string
        }
        Insert: {
          chat_id: string
          id?: string
          is_active?: boolean | null
          joined_at?: string | null
          last_read_at?: string | null
          role?: string | null
          user_id: string
        }
        Update: {
          chat_id?: string
          id?: string
          is_active?: boolean | null
          joined_at?: string | null
          last_read_at?: string | null
          role?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "chat_participants_chat_id_fkey"
            columns: ["chat_id"]
            isOneToOne: false
            referencedRelation: "chats"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "chat_participants_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "event_users"
            referencedColumns: ["id"]
          },
        ]
      }
      chats: {
        Row: {
          created_at: string | null
          created_by: string | null
          description: string | null
          id: string
          title: string | null
          type: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          id?: string
          title?: string | null
          type?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          id?: string
          title?: string | null
          type?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "chats_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "event_users"
            referencedColumns: ["id"]
          },
        ]
      }
      face_recognition_results: {
        Row: {
          algorithm_version: string | null
          bounding_box: Json | null
          confidence_score: number
          created_at: string | null
          face_encoding: string | null
          id: string
          is_verified: boolean | null
          photo_id: string
          user_id: string | null
          verified_at: string | null
          verified_by: string | null
        }
        Insert: {
          algorithm_version?: string | null
          bounding_box?: Json | null
          confidence_score: number
          created_at?: string | null
          face_encoding?: string | null
          id?: string
          is_verified?: boolean | null
          photo_id: string
          user_id?: string | null
          verified_at?: string | null
          verified_by?: string | null
        }
        Update: {
          algorithm_version?: string | null
          bounding_box?: Json | null
          confidence_score?: number
          created_at?: string | null
          face_encoding?: string | null
          id?: string
          is_verified?: boolean | null
          photo_id?: string
          user_id?: string | null
          verified_at?: string | null
          verified_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "face_recognition_results_photo_id_fkey"
            columns: ["photo_id"]
            isOneToOne: false
            referencedRelation: "event_photos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "face_recognition_results_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "event_users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "face_recognition_results_verified_by_fkey"
            columns: ["verified_by"]
            isOneToOne: false
            referencedRelation: "event_users"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          action_url: string | null
          created_at: string | null
          data: Json | null
          expires_at: string | null
          id: string
          is_read: boolean | null
          message: string
          priority: string | null
          read_at: string | null
          title: string
          type: string
          user_id: string
        }
        Insert: {
          action_url?: string | null
          created_at?: string | null
          data?: Json | null
          expires_at?: string | null
          id?: string
          is_read?: boolean | null
          message: string
          priority?: string | null
          read_at?: string | null
          title: string
          type: string
          user_id: string
        }
        Update: {
          action_url?: string | null
          created_at?: string | null
          data?: Json | null
          expires_at?: string | null
          id?: string
          is_read?: boolean | null
          message?: string
          priority?: string | null
          read_at?: string | null
          title?: string
          type?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "notifications_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "event_users"
            referencedColumns: ["id"]
          },
        ]
      }
      notification_preferences: {
        Row: {
          booking_notifications: boolean | null
          created_at: string | null
          email_enabled: boolean | null
          event_update_notifications: boolean | null
          id: string
          marketing_notifications: boolean | null
          message_notifications: boolean | null
          photo_match_notifications: boolean | null
          push_enabled: boolean | null
          sms_enabled: boolean | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          booking_notifications?: boolean | null
          created_at?: string | null
          email_enabled?: boolean | null
          event_update_notifications?: boolean | null
          id?: string
          marketing_notifications?: boolean | null
          message_notifications?: boolean | null
          photo_match_notifications?: boolean | null
          push_enabled?: boolean | null
          sms_enabled?: boolean | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          booking_notifications?: boolean | null
          created_at?: string | null
          email_enabled?: boolean | null
          event_update_notifications?: boolean | null
          id?: string
          marketing_notifications?: boolean | null
          message_notifications?: boolean | null
          photo_match_notifications?: boolean | null
          push_enabled?: boolean | null
          sms_enabled?: boolean | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "notification_preferences_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "event_users"
            referencedColumns: ["id"]
          },
        ]
      }
      photo_matching_queue: {
        Row: {
          attempts: number | null
          completed_at: string | null
          created_at: string | null
          error_message: string | null
          id: string
          max_attempts: number | null
          photo_id: string
          priority: number | null
          started_at: string | null
          status: string | null
        }
        Insert: {
          attempts?: number | null
          completed_at?: string | null
          created_at?: string | null
          error_message?: string | null
          id?: string
          max_attempts?: number | null
          photo_id: string
          priority?: number | null
          started_at?: string | null
          status?: string | null
        }
        Update: {
          attempts?: number | null
          completed_at?: string | null
          created_at?: string | null
          error_message?: string | null
          id?: string
          max_attempts?: number | null
          photo_id?: string
          priority?: number | null
          started_at?: string | null
          status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "photo_matching_queue_photo_id_fkey"
            columns: ["photo_id"]
            isOneToOne: false
            referencedRelation: "event_photos"
            referencedColumns: ["id"]
          },
        ]
      }
      user_onboarding: {
        Row: {
          completed_at: string | null
          created_at: string | null
          data: Json | null
          id: string
          is_completed: boolean | null
          step: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          completed_at?: string | null
          created_at?: string | null
          data?: Json | null
          id?: string
          is_completed?: boolean | null
          step: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          completed_at?: string | null
          created_at?: string | null
          data?: Json | null
          id?: string
          is_completed?: boolean | null
          step?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_onboarding_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "event_users"
            referencedColumns: ["id"]
          },
        ]
      }
      user_profiles: {
        Row: {
          availability_status: string | null
          bio: string | null
          business_address: string | null
          business_name: string | null
          certifications: string[] | null
          created_at: string | null
          experience_years: number | null
          id: string
          languages: string[] | null
          portfolio_url: string | null
          response_time_hours: number | null
          social_links: Json | null
          specializations: string[] | null
          tax_id: string | null
          timezone: string | null
          updated_at: string | null
          user_id: string
          website: string | null
        }
        Insert: {
          availability_status?: string | null
          bio?: string | null
          business_address?: string | null
          business_name?: string | null
          certifications?: string[] | null
          created_at?: string | null
          experience_years?: number | null
          id?: string
          languages?: string[] | null
          portfolio_url?: string | null
          response_time_hours?: number | null
          social_links?: Json | null
          specializations?: string[] | null
          tax_id?: string | null
          timezone?: string | null
          updated_at?: string | null
          user_id: string
          website?: string | null
        }
        Update: {
          availability_status?: string | null
          bio?: string | null
          business_address?: string | null
          business_name?: string | null
          certifications?: string[] | null
          created_at?: string | null
          experience_years?: number | null
          id?: string
          languages?: string[] | null
          portfolio_url?: string | null
          response_time_hours?: number | null
          social_links?: Json | null
          specializations?: string[] | null
          tax_id?: string | null
          timezone?: string | null
          updated_at?: string | null
          user_id?: string
          website?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_profiles_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "event_users"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          expires_at: string | null
          granted_at: string | null
          granted_by: string | null
          id: string
          is_active: boolean | null
          permissions: Json | null
          role: string
          user_id: string
        }
        Insert: {
          expires_at?: string | null
          granted_at?: string | null
          granted_by?: string | null
          id?: string
          is_active?: boolean | null
          permissions?: Json | null
          role: string
          user_id: string
        }
        Update: {
          expires_at?: string | null
          granted_at?: string | null
          granted_by?: string | null
          id?: string
          is_active?: boolean | null
          permissions?: Json | null
          role?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_roles_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "event_users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_roles_granted_by_fkey"
            columns: ["granted_by"]
            isOneToOne: false
            referencedRelation: "event_users"
            referencedColumns: ["id"]
          },
        ]
      }
      website_stats: {
        Row: {
          id: string
          photographers_count: number
          events_count: number
          average_rating: number
          response_time_hours: number
          active_photographers: number
          completed_events: number
          total_reviews: number
          updated_at: string | null
          created_at: string | null
        }
        Insert: {
          id?: string
          photographers_count?: number
          events_count?: number
          average_rating?: number
          response_time_hours?: number
          active_photographers?: number
          completed_events?: number
          total_reviews?: number
          updated_at?: string | null
          created_at?: string | null
        }
        Update: {
          id?: string
          photographers_count?: number
          events_count?: number
          average_rating?: number
          response_time_hours?: number
          active_photographers?: number
          completed_events?: number
          total_reviews?: number
          updated_at?: string | null
          created_at?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      event_summary: {
        Row: {
          actual_photo_count: number | null
          actual_user_count: number | null
          avg_confidence: number | null
          created_at: string | null
          date: string | null
          description: string | null
          id: string | null
          location: string | null
          name: string | null
          registered_users: number | null
          status: string | null
          total_downloads: number | null
          total_photos: number | null
          updated_at: string | null
        }
        Relationships: []
      }
      photo_details: {
        Row: {
          actual_download_count: number | null
          avg_match_confidence: number | null
          camera: string | null
          created_at: string | null
          event_id: string | null
          favorite_count: number | null
          file_size: number | null
          id: string | null
          is_featured: boolean | null
          is_public: boolean | null
          location: string | null
          match_count: number | null
          mime_type: string | null
          people_count: number | null
          photographer: string | null
          resolution: string | null
          stored_download_count: number | null
          tags: string[] | null
          timestamp: string | null
          title: string | null
          updated_at: string | null
          url: string | null
        }
        Relationships: [
          {
            foreignKeyName: "event_photos_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "event_summary"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "event_photos_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Functions: {
      calculate_trending_tags: {
        Args: { event_id_param: string }
        Returns: undefined
      }
      update_event_stats: {
        Args: { event_id_param: string }
        Returns: undefined
      }
      update_website_stats: {
        Args: Record<string, never>
        Returns: void
      }
    }
    Enums: {
      [_ in never]: never
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
    Enums: {},
  },
} as const
