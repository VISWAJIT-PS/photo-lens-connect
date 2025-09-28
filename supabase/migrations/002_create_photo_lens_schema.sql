-- Photo Lens Connect Database Schema Migration
-- This migration creates tables for events, photos, users, and analytics

-- Create events table
CREATE TABLE IF NOT EXISTS public.events (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    date DATE NOT NULL,
    location TEXT NOT NULL,
    description TEXT,
    total_photos INTEGER DEFAULT 0,
    registered_users INTEGER DEFAULT 0,
    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'completed', 'draft')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
);

-- Create event_photos table
CREATE TABLE IF NOT EXISTS public.event_photos (
    id TEXT PRIMARY KEY,
    event_id TEXT NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
    url TEXT NOT NULL,
    title TEXT,
    timestamp TIMESTAMP WITH TIME ZONE,
    location TEXT,
    people_count INTEGER DEFAULT 0,
    tags TEXT[], -- Array of tags
    camera TEXT,
    photographer TEXT,
    resolution TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
);

-- Create event_users table
CREATE TABLE IF NOT EXISTS public.event_users (
    id TEXT PRIMARY KEY,
    event_id TEXT NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    whatsapp_number TEXT,
    phone_number TEXT,
    registration_date TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()),
    photos_uploaded INTEGER DEFAULT 0,
    matches_found INTEGER DEFAULT 0,
    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'completed', 'pending')),
    last_activity TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
);

-- Create event_analytics table
CREATE TABLE IF NOT EXISTS public.event_analytics (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    event_id TEXT NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
    total_registrations INTEGER DEFAULT 0,
    total_photos_uploaded INTEGER DEFAULT 0,
    total_matches_found INTEGER DEFAULT 0,
    average_match_confidence NUMERIC(5,2) DEFAULT 0.0,
    top_matching_photos TEXT[], -- Array of photo IDs
    photos_downloaded INTEGER DEFAULT 0,
    photos_shared INTEGER DEFAULT 0,
    favorites_marked INTEGER DEFAULT 0,
    average_session_time TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()),
    UNIQUE(event_id)
);

-- Create user_demographics table (for analytics)
CREATE TABLE IF NOT EXISTS public.user_demographics (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    event_id TEXT NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
    age_group TEXT NOT NULL CHECK (age_group IN ('18-25', '26-35', '36-45', '46+')),
    count INTEGER DEFAULT 0,
    gender TEXT CHECK (gender IN ('male', 'female', 'other')),
    gender_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
);

-- Create registration_trends table (for analytics)
CREATE TABLE IF NOT EXISTS public.registration_trends (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    event_id TEXT NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()),
    UNIQUE(event_id, date)
);

-- Create popular_tags table (for analytics)
CREATE TABLE IF NOT EXISTS public.popular_tags (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    event_id TEXT NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
    tag TEXT NOT NULL,
    count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()),
    UNIQUE(event_id, tag)
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_event_photos_event_id ON public.event_photos(event_id);
CREATE INDEX IF NOT EXISTS idx_event_photos_timestamp ON public.event_photos(timestamp);
CREATE INDEX IF NOT EXISTS idx_event_photos_tags ON public.event_photos USING GIN(tags);
CREATE INDEX IF NOT EXISTS idx_event_users_event_id ON public.event_users(event_id);
CREATE INDEX IF NOT EXISTS idx_event_users_registration_date ON public.event_users(registration_date);
CREATE INDEX IF NOT EXISTS idx_user_demographics_event_id ON public.user_demographics(event_id);
CREATE INDEX IF NOT EXISTS idx_registration_trends_event_id ON public.registration_trends(event_id);
CREATE INDEX IF NOT EXISTS idx_registration_trends_date ON public.registration_trends(date);
CREATE INDEX IF NOT EXISTS idx_popular_tags_event_id ON public.popular_tags(event_id);

-- Enable Row Level Security
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.event_photos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.event_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.event_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_demographics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.registration_trends ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.popular_tags ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access (since this appears to be a public photo sharing service)
-- Events - viewable by everyone
CREATE POLICY "Events are viewable by everyone" ON public.events
    FOR SELECT USING (true);

-- Event photos - viewable by everyone
CREATE POLICY "Event photos are viewable by everyone" ON public.event_photos
    FOR SELECT USING (true);

-- Event users - viewable by everyone (consider restricting personal info in a real app)
CREATE POLICY "Event users are viewable by everyone" ON public.event_users
    FOR SELECT USING (true);

-- Event analytics - viewable by everyone
CREATE POLICY "Event analytics are viewable by everyone" ON public.event_analytics
    FOR SELECT USING (true);

-- User demographics - viewable by everyone
CREATE POLICY "User demographics are viewable by everyone" ON public.user_demographics
    FOR SELECT USING (true);

-- Registration trends - viewable by everyone
CREATE POLICY "Registration trends are viewable by everyone" ON public.registration_trends
    FOR SELECT USING (true);

-- Popular tags - viewable by everyone
CREATE POLICY "Popular tags are viewable by everyone" ON public.popular_tags
    FOR SELECT USING (true);

-- Create a function to update updated_at timestamps
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = TIMEZONE('utc'::text, NOW());
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at
CREATE TRIGGER handle_events_updated_at
    BEFORE UPDATE ON public.events
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER handle_event_photos_updated_at
    BEFORE UPDATE ON public.event_photos
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER handle_event_users_updated_at
    BEFORE UPDATE ON public.event_users
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER handle_event_analytics_updated_at
    BEFORE UPDATE ON public.event_analytics
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER handle_user_demographics_updated_at
    BEFORE UPDATE ON public.user_demographics
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER handle_registration_trends_updated_at
    BEFORE UPDATE ON public.registration_trends
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER handle_popular_tags_updated_at
    BEFORE UPDATE ON public.popular_tags
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();