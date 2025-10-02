// Generated types for the Photo Lens Connect database schema

export interface Event {
  id: string;
  name: string;
  date: string;
  location: string;
  description: string | null;
  total_photos: number;
  registered_users: number;
  status: 'active' | 'completed' | 'draft';
  created_at: string;
  updated_at: string;
}

export interface EventPhoto {
  id: string;
  event_id: string;
  url: string;
  title: string | null;
  timestamp: string | null;
  location: string | null;
  people_count: number;
  tags: string[];
  camera: string | null;
  photographer: string | null;
  resolution: string | null;
  created_at: string;
  updated_at: string;
}

export interface EventUser {
  id: string;
  event_id: string;
  name: string;
  whatsapp_number: string | null;
  phone_number: string | null;
  registration_date: string;
  photos_uploaded: number;
  matches_found: number;
  status: 'active' | 'completed' | 'pending';
  last_activity: string;
  created_at: string;
  updated_at: string;
}

export interface EventAnalytics {
  id: string;
  event_id: string;
  total_registrations: number;
  total_photos_uploaded: number;
  total_matches_found: number;
  average_match_confidence: number;
  top_matching_photos: string[];
  photos_downloaded: number;
  photos_shared: number;
  favorites_marked: number;
  average_session_time: string | null;
  created_at: string;
  updated_at: string;
}

export interface UserDemographics {
  id: string;
  event_id: string;
  age_group: '18-25' | '26-35' | '36-45' | '46+';
  count: number;
  gender: 'male' | 'female' | 'other' | null;
  gender_count: number;
  created_at: string;
  updated_at: string;
}

export interface RegistrationTrend {
  id: string;
  event_id: string;
  date: string;
  count: number;
  created_at: string;
  updated_at: string;
}

export interface PopularTag {
  id: string;
  event_id: string;
  tag: string;
  count: number;
  created_at: string;
  updated_at: string;
}

export interface WebsiteStats {
  id: string;
  photographers_count: number;
  events_count: number;
  average_rating: number;
  response_time_hours: number;
  active_photographers: number;
  completed_events: number;
  total_reviews: number;
  updated_at: string;
  created_at: string;
}

// Database schema type for Supabase client
export interface Database {
  public: {
    Tables: {
      events: {
        Row: Event;
        Insert: Omit<Event, 'created_at' | 'updated_at'>;
        Update: Partial<Omit<Event, 'id' | 'created_at' | 'updated_at'>>;
      };
      event_photos: {
        Row: EventPhoto;
        Insert: Omit<EventPhoto, 'created_at' | 'updated_at'>;
        Update: Partial<Omit<EventPhoto, 'id' | 'created_at' | 'updated_at'>>;
      };
      event_users: {
        Row: EventUser;
        Insert: Omit<EventUser, 'created_at' | 'updated_at'>;
        Update: Partial<Omit<EventUser, 'id' | 'created_at' | 'updated_at'>>;
      };
      event_analytics: {
        Row: EventAnalytics;
        Insert: Omit<EventAnalytics, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<EventAnalytics, 'id' | 'created_at' | 'updated_at'>>;
      };
      user_demographics: {
        Row: UserDemographics;
        Insert: Omit<UserDemographics, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<UserDemographics, 'id' | 'created_at' | 'updated_at'>>;
      };
      registration_trends: {
        Row: RegistrationTrend;
        Insert: Omit<RegistrationTrend, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<RegistrationTrend, 'id' | 'created_at' | 'updated_at'>>;
      };
      popular_tags: {
        Row: PopularTag;
        Insert: Omit<PopularTag, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<PopularTag, 'id' | 'created_at' | 'updated_at'>>;
      };
      website_stats: {
        Row: WebsiteStats;
        Insert: Omit<WebsiteStats, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<WebsiteStats, 'id' | 'created_at' | 'updated_at'>>;
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      update_website_stats: {
        Args: Record<string, never>;
        Returns: void;
      };
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
}