-- Quick setup script for website_stats table
-- Can be run directly in Supabase SQL Editor

-- 1. Create the table
CREATE TABLE IF NOT EXISTS public.website_stats (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    photographers_count INTEGER NOT NULL DEFAULT 0,
    events_count INTEGER NOT NULL DEFAULT 0,
    average_rating DECIMAL(3,2) NOT NULL DEFAULT 0.0,
    response_time_hours INTEGER NOT NULL DEFAULT 2,
    active_photographers INTEGER NOT NULL DEFAULT 0,
    completed_events INTEGER NOT NULL DEFAULT 0,
    total_reviews INTEGER NOT NULL DEFAULT 0,
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Insert initial data
INSERT INTO public.website_stats (
    photographers_count,
    events_count,
    average_rating,
    response_time_hours,
    active_photographers,
    completed_events,
    total_reviews
) VALUES (
    500,
    1000,
    4.9,
    2,
    500,
    1000,
    850
) ON CONFLICT (id) DO NOTHING;

-- 3. Enable RLS
ALTER TABLE public.website_stats ENABLE ROW LEVEL SECURITY;

-- 4. Create policies
DROP POLICY IF EXISTS "Website stats are viewable by everyone" ON public.website_stats;
CREATE POLICY "Website stats are viewable by everyone"
    ON public.website_stats
    FOR SELECT
    USING (true);

DROP POLICY IF EXISTS "Only authenticated users can update website stats" ON public.website_stats;
CREATE POLICY "Only authenticated users can update website stats"
    ON public.website_stats
    FOR UPDATE
    USING (auth.role() = 'authenticated');

-- 5. Create update function
CREATE OR REPLACE FUNCTION update_website_stats()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    UPDATE public.website_stats
    SET 
        photographers_count = (
            SELECT COUNT(*)
            FROM public.user_profiles
            WHERE role = 'photographer'
        ),
        active_photographers = (
            SELECT COUNT(*)
            FROM public.user_profiles
            WHERE role = 'photographer' 
            AND verified = true
        ),
        events_count = (
            SELECT COUNT(*)
            FROM public.events
        ),
        completed_events = (
            SELECT COUNT(*)
            FROM public.bookings
            WHERE status = 'completed'
        ),
        average_rating = (
            SELECT COALESCE(AVG(rating), 0.0)
            FROM public.reviews
        ),
        total_reviews = (
            SELECT COUNT(*)
            FROM public.reviews
        ),
        updated_at = NOW()
    WHERE id = (SELECT id FROM public.website_stats LIMIT 1);
END;
$$;

-- 6. Verify setup
SELECT * FROM public.website_stats;

-- Success! You can now:
-- - View the landing page with dynamic stats
-- - Run: SELECT update_website_stats(); to refresh stats
-- - Set up a cron job for automatic updates
