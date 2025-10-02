-- =====================================================
-- Face Recognition and Photo Matching Functions
-- =====================================================
-- This migration adds functions for face recognition and photo matching

-- =====================================================
-- CREATE REQUIRED TABLES
-- =====================================================

-- Table to store face recognition results
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

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_face_recognition_photo_id ON public.face_recognition_results(photo_id);
CREATE INDEX IF NOT EXISTS idx_face_recognition_user_id ON public.face_recognition_results(user_id);
CREATE INDEX IF NOT EXISTS idx_face_recognition_confidence ON public.face_recognition_results(confidence_score);

-- Enable RLS
ALTER TABLE public.face_recognition_results ENABLE ROW LEVEL SECURITY;

-- Create policies for face_recognition_results
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

-- Table to store photo matching queue
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

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_photo_matching_queue_status ON public.photo_matching_queue(status);
CREATE INDEX IF NOT EXISTS idx_photo_matching_queue_priority ON public.photo_matching_queue(priority DESC);
CREATE INDEX IF NOT EXISTS idx_photo_matching_queue_created_at ON public.photo_matching_queue(created_at);

-- Enable RLS
ALTER TABLE public.photo_matching_queue ENABLE ROW LEVEL SECURITY;

-- Create policies for photo_matching_queue
CREATE POLICY "Service role can manage photo matching queue"
    ON public.photo_matching_queue FOR ALL
    USING (true);

-- =====================================================
-- FACE RECOGNITION FUNCTIONS
-- =====================================================

-- Function to calculate face similarity using cosine similarity
CREATE OR REPLACE FUNCTION public.calculate_face_similarity(encoding1 TEXT, encoding2 TEXT)
RETURNS DECIMAL(5,2) AS $$
DECLARE
    similarity DECIMAL(5,2);
BEGIN
    -- This is a simplified implementation
    -- In a real-world scenario, you would use a proper face recognition library
    -- like face_recognition (Python) or similar services

    -- For now, we'll use a simple hash-based comparison
    -- In production, integrate with AWS Rekognition, Google Vision AI, or similar

    -- Placeholder implementation - replace with actual face recognition logic
    similarity := 50.0 + (random() * 40.0); -- Random similarity between 50-90%

    RETURN similarity;
END;
$$ LANGUAGE plpgsql;

-- Function to match photo with users using face recognition
CREATE OR REPLACE FUNCTION public.match_photo_faces(photo_id_param TEXT)
RETURNS TABLE (
    user_id TEXT,
    confidence_score DECIMAL(5,2),
    bounding_box JSONB
) AS $$
DECLARE
    photo_record RECORD;
    user_record RECORD;
BEGIN
    -- Get the photo details
    SELECT * INTO photo_record FROM public.event_photos WHERE id = photo_id_param;

    IF NOT FOUND THEN
        RETURN;
    END IF;

    -- For each user in the same event, try to match
    FOR user_record IN
        SELECT * FROM public.event_users WHERE event_id = photo_record.event_id
    LOOP
        -- Check if user has uploaded reference photos or has profile photo
        IF user_record.profile_photo_url IS NOT NULL THEN
            -- Calculate similarity (placeholder implementation)
            confidence_score := public.calculate_face_similarity(
                'photo_encoding_placeholder',
                'user_encoding_placeholder'
            );

            -- Only return matches above 70% confidence
            IF confidence_score >= 70.0 THEN
                bounding_box := jsonb_build_object(
                    'x', (random() * 0.8)::DECIMAL(5,2),
                    'y', (random() * 0.8)::DECIMAL(5,2),
                    'width', 0.15 + (random() * 0.1)::DECIMAL(5,2),
                    'height', 0.15 + (random() * 0.1)::DECIMAL(5,2)
                );

                user_id := user_record.id;
                RETURN NEXT;
            END IF;
        END IF;
    END LOOP;
END;
$$ LANGUAGE plpgsql;

-- Function to process photo matching queue
CREATE OR REPLACE FUNCTION public.process_photo_matching_queue()
RETURNS VOID AS $$
DECLARE
    queue_item RECORD;
    match_result RECORD;
BEGIN
    -- Get next item from queue
    SELECT * INTO queue_item
    FROM public.photo_matching_queue
    WHERE status = 'pending'
    ORDER BY priority DESC, created_at ASC
    LIMIT 1
    FOR UPDATE SKIP LOCKED;

    IF NOT FOUND THEN
        RETURN;
    END IF;

    -- Update status to processing
    UPDATE public.photo_matching_queue
    SET status = 'processing', started_at = NOW(), attempts = attempts + 1
    WHERE id = queue_item.id;

    -- Process the photo matching
    BEGIN
        FOR match_result IN SELECT * FROM public.match_photo_faces(queue_item.photo_id)
        LOOP
            -- Insert face recognition result
            INSERT INTO public.face_recognition_results (
                photo_id,
                user_id,
                confidence_score,
                bounding_box,
                algorithm_version
            ) VALUES (
                queue_item.photo_id,
                match_result.user_id,
                match_result.confidence_score,
                match_result.bounding_box,
                '1.0'
            );

            -- Update user matches count
            UPDATE public.event_users
            SET matches_found = matches_found + 1
            WHERE id = match_result.user_id;

            -- Create notification for user (disabled - notification system not implemented yet)
            -- PERFORM public.create_notification(
            --     match_result.user_id,
            --     'photo_match',
            --     'New Photo Match Found!',
            --     'A photo has been matched with your profile. Check it out!',
            --     jsonb_build_object('photo_id', queue_item.photo_id),
            --     '/gallery',
            --     'normal'
            -- );
        END LOOP;

        -- Update queue item to completed
        UPDATE public.photo_matching_queue
        SET status = 'completed', completed_at = NOW()
        WHERE id = queue_item.id;

    EXCEPTION WHEN OTHERS THEN
        -- Update queue item to failed
        UPDATE public.photo_matching_queue
        SET status = 'failed', error_message = SQLERRM
        WHERE id = queue_item.id;

        -- If under max attempts, keep in queue
        IF queue_item.attempts < queue_item.max_attempts THEN
            UPDATE public.photo_matching_queue
            SET status = 'pending', started_at = NULL
            WHERE id = queue_item.id;
        END IF;
    END;
END;
$$ LANGUAGE plpgsql;

-- Function to add photo to matching queue
CREATE OR REPLACE FUNCTION public.queue_photo_for_matching(photo_id_param TEXT)
RETURNS VOID AS $$
BEGIN
    INSERT INTO public.photo_matching_queue (photo_id)
    VALUES (photo_id_param)
    ON CONFLICT (photo_id) DO NOTHING;
END;
$$ LANGUAGE plpgsql;

-- Function to get photo matches for a user
CREATE OR REPLACE FUNCTION public.get_user_photo_matches(user_id_param TEXT)
RETURNS TABLE (
    photo_id TEXT,
    confidence_score DECIMAL(5,2),
    photo_url TEXT,
    event_name TEXT,
    created_at TIMESTAMPTZ
) AS $$
BEGIN
    RETURN QUERY
    SELECT
        fr.photo_id,
        fr.confidence_score,
        ep.url as photo_url,
        e.name as event_name,
        fr.created_at
    FROM public.face_recognition_results fr
    JOIN public.event_photos ep ON fr.photo_id = ep.id
    JOIN public.events e ON ep.event_id = e.id
    WHERE fr.user_id = user_id_param
    ORDER BY fr.confidence_score DESC, fr.created_at DESC;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- ANALYTICS UPDATE FUNCTIONS
-- =====================================================

-- Function to update event analytics when photos are uploaded
CREATE OR REPLACE FUNCTION public.update_event_analytics_on_photo_upload()
RETURNS TRIGGER AS $$
DECLARE
    event_id_var TEXT;
BEGIN
    event_id_var := NEW.event_id;

    -- Update photo count in events table
    UPDATE public.events
    SET total_photos = (
        SELECT COUNT(*) FROM public.event_photos WHERE event_id = event_id_var
    )
    WHERE id = event_id_var;

    -- Update analytics table
    INSERT INTO public.event_analytics (event_id, total_photos_uploaded)
    VALUES (event_id_var, 1)
    ON CONFLICT (event_id)
    DO UPDATE SET
        total_photos_uploaded = event_analytics.total_photos_uploaded + 1,
        updated_at = NOW();

    -- Queue photo for face recognition
    PERFORM public.queue_photo_for_matching(NEW.id);

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Function to update event analytics when users register
CREATE OR REPLACE FUNCTION public.update_event_analytics_on_user_registration()
RETURNS TRIGGER AS $$
DECLARE
    event_id_var TEXT;
BEGIN
    event_id_var := NEW.event_id;

    -- Update user count in events table
    UPDATE public.events
    SET registered_users = (
        SELECT COUNT(*) FROM public.event_users WHERE event_id = event_id_var
    )
    WHERE id = event_id_var;

    -- Update analytics table
    INSERT INTO public.event_analytics (event_id, total_registrations)
    VALUES (event_id_var, 1)
    ON CONFLICT (event_id)
    DO UPDATE SET
        total_registrations = event_analytics.total_registrations + 1,
        updated_at = NOW();

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Function to update event analytics when matches are found
CREATE OR REPLACE FUNCTION public.update_event_analytics_on_match_found()
RETURNS TRIGGER AS $$
DECLARE
    event_id_var TEXT;
BEGIN
    -- Get event_id from the photo
    SELECT ep.event_id INTO event_id_var
    FROM public.event_photos ep
    WHERE ep.id = NEW.photo_id;

    -- Update analytics table
    INSERT INTO public.event_analytics (event_id, total_matches_found)
    VALUES (event_id_var, 1)
    ON CONFLICT (event_id)
    DO UPDATE SET
        total_matches_found = event_analytics.total_matches_found + 1,
        updated_at = NOW();

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- TRIGGERS FOR AUTOMATIC ANALYTICS UPDATES
-- =====================================================

-- Trigger to update analytics when photos are uploaded
CREATE TRIGGER trigger_update_analytics_on_photo_upload
    AFTER INSERT ON public.event_photos
    FOR EACH ROW EXECUTE FUNCTION public.update_event_analytics_on_photo_upload();

-- Trigger to update analytics when users register
CREATE TRIGGER trigger_update_analytics_on_user_registration
    AFTER INSERT ON public.event_users
    FOR EACH ROW EXECUTE FUNCTION public.update_event_analytics_on_user_registration();

-- Trigger to update analytics when matches are found
CREATE TRIGGER trigger_update_analytics_on_match_found
    AFTER INSERT ON public.face_recognition_results
    FOR EACH ROW EXECUTE FUNCTION public.update_event_analytics_on_match_found();

-- =====================================================
-- UTILITY FUNCTIONS
-- =====================================================

-- Function to get event statistics
CREATE OR REPLACE FUNCTION public.get_event_statistics(event_id_param TEXT)
RETURNS TABLE (
    total_photos INTEGER,
    total_users INTEGER,
    total_matches INTEGER,
    average_confidence DECIMAL(5,2),
    photos_with_matches INTEGER
) AS $$
BEGIN
    RETURN QUERY
    SELECT
        COUNT(DISTINCT ep.id)::INTEGER as total_photos,
        COUNT(DISTINCT eu.id)::INTEGER as total_users,
        COUNT(DISTINCT fr.id)::INTEGER as total_matches,
        COALESCE(AVG(fr.confidence_score), 0)::DECIMAL(5,2) as average_confidence,
        COUNT(DISTINCT fr.photo_id)::INTEGER as photos_with_matches
    FROM public.events e
    LEFT JOIN public.event_photos ep ON e.id = ep.event_id
    LEFT JOIN public.event_users eu ON e.id = eu.event_id
    LEFT JOIN public.face_recognition_results fr ON ep.id = fr.photo_id
    WHERE e.id = event_id_param
    GROUP BY e.id;
END;
$$ LANGUAGE plpgsql;

-- Function to get user statistics
CREATE OR REPLACE FUNCTION public.get_user_statistics(user_id_param TEXT)
RETURNS TABLE (
    total_events INTEGER,
    total_photos_uploaded INTEGER,
    total_matches_found INTEGER,
    favorite_photos INTEGER,
    total_downloads INTEGER
) AS $$
BEGIN
    RETURN QUERY
    SELECT
        COUNT(DISTINCT eu.event_id)::INTEGER as total_events,
        COALESCE(eu.photos_uploaded, 0)::INTEGER as total_photos_uploaded,
        COALESCE(eu.matches_found, 0)::INTEGER as total_matches_found,
        COUNT(DISTINCT uf.id)::INTEGER as favorite_photos,
        COUNT(DISTINCT pd.id)::INTEGER as total_downloads
    FROM public.event_users eu
    LEFT JOIN public.user_favorites uf ON eu.id = uf.user_id
    LEFT JOIN public.photo_downloads pd ON eu.id = pd.user_id
    WHERE eu.id = user_id_param
    GROUP BY eu.id, eu.photos_uploaded, eu.matches_found;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- SAMPLE DATA FOR TESTING
-- =====================================================

-- Add some sample photos to the matching queue
INSERT INTO public.photo_matching_queue (photo_id, priority) VALUES
('photo-001', 10),
('photo-002', 10),
('photo-003', 10),
('photo-004', 10),
('corp-001', 5),
('bday-001', 5);

-- =====================================================
-- REFRESH SCHEMA CACHE
-- =====================================================

-- Refresh the schema cache to ensure all changes are applied
NOTIFY pgrst, 'reload schema';