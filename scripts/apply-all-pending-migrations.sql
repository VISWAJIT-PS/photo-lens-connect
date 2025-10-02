-- Complete Migration Script for PhotoLens Connect
-- This script can be run directly in Supabase SQL Editor
-- Run this ONLY if you want to apply all migrations at once

-- ============================================
-- NOTE: This applies ONLY the missing migrations
-- Migrations 001-004 should already be applied
-- ============================================

BEGIN;

-- ============================================
-- Migration 005: Fix Photo Details View
-- ============================================

-- (Add the contents of 005_fix_photo_details_view.sql if needed)

-- ============================================
-- Migration 006: Face Recognition Functions
-- ============================================

-- Create face_recognition_results table
CREATE TABLE IF NOT EXISTS public.face_recognition_results (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    photo_id UUID NOT NULL REFERENCES public.event_photos(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES public.event_users(id) ON DELETE CASCADE,
    confidence_score DECIMAL(5,2) NOT NULL DEFAULT 0.0,
    bounding_box JSONB,
    algorithm_version TEXT DEFAULT '1.0',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_face_recognition_photo_id ON public.face_recognition_results(photo_id);
CREATE INDEX IF NOT EXISTS idx_face_recognition_user_id ON public.face_recognition_results(user_id);
CREATE INDEX IF NOT EXISTS idx_face_recognition_confidence ON public.face_recognition_results(confidence_score);

ALTER TABLE public.face_recognition_results ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own face recognition results"
    ON public.face_recognition_results FOR SELECT
    USING (
        auth.uid()::text = user_id OR
        EXISTS (
            SELECT 1 FROM public.event_users eu
            WHERE eu.id = user_id AND eu.event_id IN (
                SELECT ep.event_id FROM public.event_photos ep WHERE ep.id = photo_id
            )
        )
    );

-- Create photo_matching_queue table
CREATE TABLE IF NOT EXISTS public.photo_matching_queue (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    photo_id UUID NOT NULL REFERENCES public.event_photos(id) ON DELETE CASCADE,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed')),
    priority INTEGER DEFAULT 5,
    attempts INTEGER DEFAULT 0,
    max_attempts INTEGER DEFAULT 3,
    error_message TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    started_at TIMESTAMPTZ,
    completed_at TIMESTAMPTZ,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_photo_matching_queue_status ON public.photo_matching_queue(status);
CREATE INDEX IF NOT EXISTS idx_photo_matching_queue_priority ON public.photo_matching_queue(priority DESC);
CREATE INDEX IF NOT EXISTS idx_photo_matching_queue_created_at ON public.photo_matching_queue(created_at);

ALTER TABLE public.photo_matching_queue ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Service role can manage photo matching queue"
    ON public.photo_matching_queue FOR ALL
    USING (true);

-- ============================================
-- Migration 009: Website Stats Table
-- ============================================

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

-- Insert initial data
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

-- Enable RLS
ALTER TABLE public.website_stats ENABLE ROW LEVEL SECURITY;

-- Create policies
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

-- Create update function
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

COMMIT;

-- Verify the setup
SELECT 'Migration completed successfully!' as status;
SELECT * FROM public.website_stats;
