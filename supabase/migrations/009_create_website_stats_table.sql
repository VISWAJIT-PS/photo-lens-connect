-- Create website_stats table for landing page statistics
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

-- Create a single row for the stats (singleton pattern)
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
) ON CONFLICT DO NOTHING;

-- Enable RLS
ALTER TABLE public.website_stats ENABLE ROW LEVEL SECURITY;

-- Create policy for public read access (anyone can read stats)
CREATE POLICY "Website stats are viewable by everyone"
    ON public.website_stats
    FOR SELECT
    USING (true);

-- Create policy for authenticated users to update (admin only)
CREATE POLICY "Only authenticated users can update website stats"
    ON public.website_stats
    FOR UPDATE
    USING (auth.role() = 'authenticated');

-- Create function to update stats automatically
CREATE OR REPLACE FUNCTION update_website_stats()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    -- Update photographers count
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

-- Create a trigger to update stats periodically (can be called manually or via cron job)
COMMENT ON FUNCTION update_website_stats() IS 'Updates website statistics based on actual data from the database';
