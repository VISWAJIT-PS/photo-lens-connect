-- =====================================================
-- Photo Lens Connect - Complete Database Schema
-- =====================================================
-- This migration creates the complete schema for the photo lens connect application
-- Replaces all static JSON files with proper database tables

-- Drop existing tables if they exist (for clean migration)
DROP TABLE IF EXISTS public.popular_tags CASCADE;
DROP TABLE IF EXISTS public.registration_trends CASCADE;
DROP TABLE IF EXISTS public.user_demographics CASCADE;
DROP TABLE IF EXISTS public.event_analytics CASCADE;
DROP TABLE IF EXISTS public.event_users CASCADE;
DROP TABLE IF EXISTS public.event_photos CASCADE;
DROP TABLE IF EXISTS public.events CASCADE;

-- =====================================================
-- MAIN TABLES
-- =====================================================

-- Events table (replaces events.json)
CREATE TABLE public.events (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    date DATE NOT NULL,
    location TEXT NOT NULL,
    description TEXT,
    total_photos INTEGER DEFAULT 0,
    registered_users INTEGER DEFAULT 0,
    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'completed', 'draft')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Event photos table (replaces photos.json)
CREATE TABLE public.event_photos (
    id TEXT PRIMARY KEY,
    event_id TEXT NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
    url TEXT NOT NULL,
    title TEXT,
    timestamp TIMESTAMPTZ,
    location TEXT,
    people_count INTEGER DEFAULT 0,
    tags TEXT[] DEFAULT '{}',
    camera TEXT,
    photographer TEXT,
    resolution TEXT,
    -- Additional fields for photo management
    file_size BIGINT,
    mime_type TEXT,
    is_featured BOOLEAN DEFAULT FALSE,
    is_public BOOLEAN DEFAULT TRUE,
    download_count INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Event users table (replaces users.json)
CREATE TABLE public.event_users (
    id TEXT PRIMARY KEY,
    event_id TEXT NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    email TEXT,
    whatsapp_number TEXT,
    phone_number TEXT,
    registration_date TIMESTAMPTZ DEFAULT NOW(),
    photos_uploaded INTEGER DEFAULT 0,
    matches_found INTEGER DEFAULT 0,
    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'completed', 'pending')),
    last_activity TIMESTAMPTZ DEFAULT NOW(),
    -- Additional user fields
    profile_photo_url TEXT,
    preferences JSONB DEFAULT '{}',
    notifications_enabled BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Event analytics table (replaces analytics.json main data)
CREATE TABLE public.event_analytics (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    event_id TEXT NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
    total_registrations INTEGER DEFAULT 0,
    total_photos_uploaded INTEGER DEFAULT 0,
    total_matches_found INTEGER DEFAULT 0,
    average_match_confidence NUMERIC(5,2) DEFAULT 0.0,
    top_matching_photos TEXT[] DEFAULT '{}',
    photos_downloaded INTEGER DEFAULT 0,
    photos_shared INTEGER DEFAULT 0,
    favorites_marked INTEGER DEFAULT 0,
    average_session_time INTERVAL,
    -- Additional analytics
    unique_visitors INTEGER DEFAULT 0,
    bounce_rate NUMERIC(5,2) DEFAULT 0.0,
    conversion_rate NUMERIC(5,2) DEFAULT 0.0,
    peak_usage_hour INTEGER,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(event_id)
);

-- User demographics table (replaces analytics.json userDemographics)
CREATE TABLE public.user_demographics (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    event_id TEXT NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
    age_group TEXT NOT NULL CHECK (age_group IN ('18-25', '26-35', '36-45', '46+')),
    count INTEGER DEFAULT 0,
    gender TEXT CHECK (gender IN ('male', 'female', 'other')),
    gender_count INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Registration trends table (replaces analytics.json registrationTrends)
CREATE TABLE public.registration_trends (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    event_id TEXT NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    count INTEGER DEFAULT 0,
    cumulative_count INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(event_id, date)
);

-- Popular tags table (replaces analytics.json popularTags)
CREATE TABLE public.popular_tags (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    event_id TEXT NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
    tag TEXT NOT NULL,
    count INTEGER DEFAULT 0,
    trending_score NUMERIC(5,2) DEFAULT 0.0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(event_id, tag)
);

-- =====================================================
-- ADDITIONAL ENHANCEMENT TABLES
-- =====================================================

-- Photo matches table (for face recognition results)
CREATE TABLE public.photo_matches (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    event_id TEXT NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
    photo_id TEXT NOT NULL REFERENCES public.event_photos(id) ON DELETE CASCADE,
    user_id TEXT NOT NULL REFERENCES public.event_users(id) ON DELETE CASCADE,
    confidence_score NUMERIC(5,2) NOT NULL,
    match_type TEXT DEFAULT 'face' CHECK (match_type IN ('face', 'object', 'scene')),
    bounding_box JSONB, -- {x, y, width, height}
    is_confirmed BOOLEAN DEFAULT FALSE,
    confirmed_by TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- User favorites table
CREATE TABLE public.user_favorites (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id TEXT NOT NULL REFERENCES public.event_users(id) ON DELETE CASCADE,
    photo_id TEXT NOT NULL REFERENCES public.event_photos(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, photo_id)
);

-- Photo downloads tracking
CREATE TABLE public.photo_downloads (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    photo_id TEXT NOT NULL REFERENCES public.event_photos(id) ON DELETE CASCADE,
    user_id TEXT REFERENCES public.event_users(id) ON DELETE SET NULL,
    download_type TEXT DEFAULT 'full' CHECK (download_type IN ('full', 'thumbnail', 'medium')),
    user_agent TEXT,
    ip_address INET,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- INDEXES FOR PERFORMANCE
-- =====================================================

-- Events indexes
CREATE INDEX idx_events_status ON public.events(status);
CREATE INDEX idx_events_date ON public.events(date DESC);
CREATE INDEX idx_events_created_at ON public.events(created_at DESC);

-- Photos indexes
CREATE INDEX idx_event_photos_event_id ON public.event_photos(event_id);
CREATE INDEX idx_event_photos_timestamp ON public.event_photos(timestamp DESC);
CREATE INDEX idx_event_photos_photographer ON public.event_photos(photographer);
CREATE INDEX idx_event_photos_tags ON public.event_photos USING GIN(tags);
CREATE INDEX idx_event_photos_is_featured ON public.event_photos(is_featured) WHERE is_featured = TRUE;
CREATE INDEX idx_event_photos_is_public ON public.event_photos(is_public) WHERE is_public = TRUE;

-- Users indexes
CREATE INDEX idx_event_users_event_id ON public.event_users(event_id);
CREATE INDEX idx_event_users_status ON public.event_users(status);
CREATE INDEX idx_event_users_registration_date ON public.event_users(registration_date DESC);
CREATE INDEX idx_event_users_last_activity ON public.event_users(last_activity DESC);
CREATE INDEX idx_event_users_email ON public.event_users(email);

-- Analytics indexes
CREATE INDEX idx_event_analytics_event_id ON public.event_analytics(event_id);
CREATE INDEX idx_user_demographics_event_id ON public.user_demographics(event_id);
CREATE INDEX idx_registration_trends_event_id ON public.registration_trends(event_id);
CREATE INDEX idx_registration_trends_date ON public.registration_trends(date DESC);
CREATE INDEX idx_popular_tags_event_id ON public.popular_tags(event_id);
CREATE INDEX idx_popular_tags_count ON public.popular_tags(count DESC);

-- Match and favorites indexes
CREATE INDEX idx_photo_matches_event_id ON public.photo_matches(event_id);
CREATE INDEX idx_photo_matches_photo_id ON public.photo_matches(photo_id);
CREATE INDEX idx_photo_matches_user_id ON public.photo_matches(user_id);
CREATE INDEX idx_photo_matches_confidence ON public.photo_matches(confidence_score DESC);
CREATE INDEX idx_user_favorites_user_id ON public.user_favorites(user_id);
CREATE INDEX idx_user_favorites_photo_id ON public.user_favorites(photo_id);
CREATE INDEX idx_photo_downloads_photo_id ON public.photo_downloads(photo_id);

-- =====================================================
-- ROW LEVEL SECURITY (RLS)
-- =====================================================

-- Enable RLS on all tables
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.event_photos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.event_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.event_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_demographics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.registration_trends ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.popular_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.photo_matches ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.photo_downloads ENABLE ROW LEVEL SECURITY;

-- Public read policies (for public events and photos)
CREATE POLICY "Events are publicly viewable" ON public.events
    FOR SELECT USING (true);

CREATE POLICY "Public photos are viewable" ON public.event_photos
    FOR SELECT USING (is_public = true);

CREATE POLICY "Event users are publicly viewable" ON public.event_users
    FOR SELECT USING (true);

CREATE POLICY "Analytics are publicly viewable" ON public.event_analytics
    FOR SELECT USING (true);

CREATE POLICY "Demographics are publicly viewable" ON public.user_demographics
    FOR SELECT USING (true);

CREATE POLICY "Trends are publicly viewable" ON public.registration_trends
    FOR SELECT USING (true);

CREATE POLICY "Tags are publicly viewable" ON public.popular_tags
    FOR SELECT USING (true);

CREATE POLICY "Matches are publicly viewable" ON public.photo_matches
    FOR SELECT USING (true);

-- Private policies (require authentication)
CREATE POLICY "Users can view their favorites" ON public.user_favorites
    FOR SELECT USING (auth.uid()::text = user_id);

CREATE POLICY "Users can manage their favorites" ON public.user_favorites
    FOR ALL USING (auth.uid()::text = user_id);

-- Admin policies (for future admin functionality)
CREATE POLICY "Service role can manage events" ON public.events
    FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Service role can manage photos" ON public.event_photos
    FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Service role can manage users" ON public.event_users
    FOR ALL USING (auth.role() = 'service_role');

-- =====================================================
-- TRIGGERS FOR AUTOMATIC UPDATES
-- =====================================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply updated_at triggers to all tables
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

CREATE TRIGGER handle_photo_matches_updated_at
    BEFORE UPDATE ON public.photo_matches
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- =====================================================
-- FUNCTIONS FOR ANALYTICS
-- =====================================================

-- Function to update event statistics
CREATE OR REPLACE FUNCTION public.update_event_stats(event_id_param TEXT)
RETURNS VOID AS $$
BEGIN
    UPDATE public.events SET
        total_photos = (
            SELECT COUNT(*) FROM public.event_photos 
            WHERE event_id = event_id_param
        ),
        registered_users = (
            SELECT COUNT(*) FROM public.event_users 
            WHERE event_id = event_id_param
        ),
        updated_at = NOW()
    WHERE id = event_id_param;
END;
$$ LANGUAGE plpgsql;

-- Function to calculate trending tags
CREATE OR REPLACE FUNCTION public.calculate_trending_tags(event_id_param TEXT)
RETURNS VOID AS $$
BEGIN
    -- Update trending scores based on recent activity
    UPDATE public.popular_tags SET
        trending_score = (
            count::NUMERIC / 
            GREATEST(EXTRACT(EPOCH FROM (NOW() - created_at)) / 3600, 1) -- hourly decay
        )
    WHERE event_id = event_id_param;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- VIEWS FOR COMMON QUERIES
-- =====================================================

-- View for event summary with stats
CREATE VIEW public.event_summary AS
SELECT 
    e.*,
    COUNT(DISTINCT ep.id) as actual_photo_count,
    COUNT(DISTINCT eu.id) as actual_user_count,
    AVG(ea.average_match_confidence) as avg_confidence,
    SUM(ea.photos_downloaded) as total_downloads
FROM public.events e
LEFT JOIN public.event_photos ep ON e.id = ep.event_id
LEFT JOIN public.event_users eu ON e.id = eu.event_id
LEFT JOIN public.event_analytics ea ON e.id = ea.event_id
GROUP BY e.id, e.name, e.date, e.location, e.description, e.total_photos, e.registered_users, e.status, e.created_at, e.updated_at;

-- View for photo details with match info
CREATE VIEW public.photo_details AS
SELECT 
    ep.*,
    COUNT(pm.id) as match_count,
    AVG(pm.confidence_score) as avg_match_confidence,
    COUNT(uf.id) as favorite_count,
    COUNT(pd.id) as actual_download_count
FROM public.event_photos ep
LEFT JOIN public.photo_matches pm ON ep.id = pm.photo_id
LEFT JOIN public.user_favorites uf ON ep.id = uf.photo_id
LEFT JOIN public.photo_downloads pd ON ep.id = pd.photo_id
GROUP BY ep.id, ep.event_id, ep.url, ep.title, ep.timestamp, ep.location, ep.people_count, 
         ep.tags, ep.camera, ep.photographer, ep.resolution, ep.file_size, ep.mime_type, 
         ep.is_featured, ep.is_public, ep.download_count, ep.created_at, ep.updated_at;

-- =====================================================
-- SAMPLE DATA INSERT (replacing JSON data)
-- =====================================================

-- Insert events (from events.json)
INSERT INTO public.events (id, name, date, location, description, total_photos, registered_users, status) VALUES
('wedding-2024-001', 'Sarah & John''s Wedding', '2024-01-15', 'Grand Ballroom, Downtown Hotel', 'An elegant wedding celebration with 150 guests', 245, 23, 'active'),
('corporate-2024-002', 'TechCorp Annual Conference', '2024-02-20', 'Convention Center', 'Annual technology conference with keynote speakers', 180, 45, 'completed'),
('birthday-2024-003', 'Emma''s 30th Birthday', '2024-03-10', 'Riverside Restaurant', 'Surprise birthday party celebration', 95, 18, 'active');

-- Insert sample photos (from photos.json)
INSERT INTO public.event_photos (id, event_id, url, title, timestamp, location, people_count, tags, camera, photographer, resolution) VALUES
('photo-001', 'wedding-2024-001', 'https://images.unsplash.com/photo-1519741497674-611481863552?w=600', 'Reception Entrance', '2024-01-15T18:30:00Z', 'Main Hall Entrance', 12, ARRAY['reception', 'group', 'formal', 'entrance'], 'Canon EOS R5', 'Mike Johnson', '4000x3000'),
('photo-002', 'wedding-2024-001', 'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=600', 'Ceremony Vows', '2024-01-15T16:00:00Z', 'Ceremony Hall', 8, ARRAY['ceremony', 'emotional', 'couple', 'vows'], 'Nikon D850', 'Sarah Davis', '3000x2000'),
('photo-003', 'wedding-2024-001', 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=600', 'Dinner Table Celebration', '2024-01-15T19:45:00Z', 'Dining Area', 6, ARRAY['dinner', 'casual', 'friends', 'celebration'], 'Sony A7R IV', 'Mike Johnson', '3500x2500'),
('photo-004', 'wedding-2024-001', 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=600', 'Dance Floor Energy', '2024-01-15T21:15:00Z', 'Dance Floor', 15, ARRAY['dance', 'party', 'fun', 'energy'], 'Canon EOS R6', 'Emma Wilson', '4000x2800'),
('corp-001', 'corporate-2024-002', 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=600', 'Keynote Presentation', '2024-02-20T09:00:00Z', 'Main Auditorium', 25, ARRAY['presentation', 'keynote', 'corporate', 'conference'], 'Canon EOS R5', 'Corporate Team', '4000x3000'),
('bday-001', 'birthday-2024-003', 'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=600', 'Birthday Surprise', '2024-03-10T18:00:00Z', 'Private Room', 12, ARRAY['birthday', 'surprise', 'celebration', 'party'], 'iPhone 15 Pro', 'Guest Photographer', '3000x2000');

-- Insert sample users (from users.json)
INSERT INTO public.event_users (id, event_id, name, whatsapp_number, phone_number, registration_date, photos_uploaded, matches_found, status, last_activity) VALUES
('user-001', 'wedding-2024-001', 'Alice Johnson', '+1234567890', '+1234567890', '2024-01-10T14:30:00Z', 3, 8, 'completed', '2024-01-16T10:15:00Z'),
('user-002', 'wedding-2024-001', 'Bob Smith', '+1234567891', '+1234567891', '2024-01-11T09:20:00Z', 4, 12, 'completed', '2024-01-16T11:30:00Z'),
('user-003', 'wedding-2024-001', 'Carol Davis', '+1234567892', '+1234567892', '2024-01-12T16:45:00Z', 3, 6, 'completed', '2024-01-16T14:20:00Z'),
('corp-user-001', 'corporate-2024-002', 'Frank Miller', '+1234567895', '+1234567895', '2024-02-15T08:00:00Z', 3, 7, 'completed', '2024-02-21T12:00:00Z'),
('bday-user-001', 'birthday-2024-003', 'Henry Taylor', '+1234567897', '+1234567897', '2024-03-05T17:00:00Z', 3, 5, 'completed', '2024-03-11T19:30:00Z');

-- Insert analytics data (from analytics.json)
INSERT INTO public.event_analytics (event_id, total_registrations, total_photos_uploaded, total_matches_found, average_match_confidence, top_matching_photos, photos_downloaded, photos_shared, favorites_marked, average_session_time) VALUES
('wedding-2024-001', 23, 89, 156, 78.5, ARRAY['photo-003', 'photo-006', 'photo-001'], 67, 23, 45, INTERVAL '8 minutes 32 seconds'),
('corporate-2024-002', 45, 135, 203, 82.1, ARRAY['corp-001'], 89, 34, 67, INTERVAL '12 minutes 15 seconds'),
('birthday-2024-003', 18, 54, 73, 75.8, ARRAY['bday-001'], 42, 28, 31, INTERVAL '6 minutes 45 seconds');

-- Insert demographics data
INSERT INTO public.user_demographics (event_id, age_group, count, gender, gender_count) VALUES
('wedding-2024-001', '18-25', 5, 'male', 10),
('wedding-2024-001', '26-35', 12, 'female', 11),
('wedding-2024-001', '36-45', 4, 'other', 2),
('wedding-2024-001', '46+', 2, NULL, 0),
('corporate-2024-002', '18-25', 8, 'male', 28),
('corporate-2024-002', '26-35', 25, 'female', 15),
('corporate-2024-002', '36-45', 10, 'other', 2),
('corporate-2024-002', '46+', 2, NULL, 0);

-- Insert registration trends
INSERT INTO public.registration_trends (event_id, date, count, cumulative_count) VALUES
('wedding-2024-001', '2024-01-10', 3, 3),
('wedding-2024-001', '2024-01-11', 5, 8),
('wedding-2024-001', '2024-01-12', 7, 15),
('wedding-2024-001', '2024-01-13', 4, 19),
('wedding-2024-001', '2024-01-14', 4, 23),
('corporate-2024-002', '2024-02-15', 12, 12),
('corporate-2024-002', '2024-02-16', 15, 27),
('corporate-2024-002', '2024-02-17', 10, 37),
('corporate-2024-002', '2024-02-18', 8, 45);

-- Insert popular tags
INSERT INTO public.popular_tags (event_id, tag, count, trending_score) VALUES
('wedding-2024-001', 'reception', 15, 15.0),
('wedding-2024-001', 'dance', 12, 12.0),
('wedding-2024-001', 'family', 10, 10.0),
('wedding-2024-001', 'ceremony', 8, 8.0),
('wedding-2024-001', 'dinner', 6, 6.0),
('corporate-2024-002', 'presentation', 18, 18.0),
('corporate-2024-002', 'networking', 14, 14.0),
('corporate-2024-002', 'corporate', 12, 12.0),
('corporate-2024-002', 'keynote', 9, 9.0),
('birthday-2024-003', 'birthday', 16, 16.0),
('birthday-2024-003', 'surprise', 12, 12.0),
('birthday-2024-003', 'party', 10, 10.0),
('birthday-2024-003', 'celebration', 8, 8.0);

-- Update event statistics
SELECT public.update_event_stats('wedding-2024-001');
SELECT public.update_event_stats('corporate-2024-002');
SELECT public.update_event_stats('birthday-2024-003');

-- =====================================================
-- REFRESH SCHEMA CACHE
-- =====================================================

-- Refresh the schema cache to ensure all changes are applied
NOTIFY pgrst, 'reload schema';