-- Storage Security Policies for Photo Lens Connect
-- This migration sets up Row Level Security policies for all storage buckets

-- Enable RLS on storage buckets (this is done via Supabase dashboard, but we document the policies here)

-- =====================================================
-- AVATARS BUCKET POLICIES
-- =====================================================

-- Allow users to view avatars (public read access for profile pictures)
-- This policy allows anyone to view avatar images
-- In production, you might want to restrict this further

-- Allow authenticated users to upload their own avatars
-- Users can only upload to their own folder: avatars/{user_id}/
-- This is enforced by the application logic, but we can add additional checks

-- Allow users to update their own avatar files
-- Users can only update/delete files in their own avatar folder

-- =====================================================
-- EVENT_PHOTOS BUCKET POLICIES
-- =====================================================

-- Allow event participants to view photos from their events
-- Users can view photos if they are participants in the event

-- Allow photographers to upload photos to events they are assigned to
-- Photographers can upload to event folders they have access to

-- Allow photographers to manage (update/delete) photos they uploaded
-- Photographers can only manage their own uploaded photos

-- =====================================================
-- DOCUMENTS BUCKET POLICIES
-- =====================================================

-- Allow users to view documents they have access to
-- Based on document ownership or sharing permissions

-- Allow users to upload documents to appropriate folders
-- Users can upload to folders they have write access to

-- Allow users to manage their own documents
-- Users can update/delete their own uploaded documents

-- =====================================================
-- PORTFOLIO BUCKET POLICIES
-- =====================================================

-- Allow public read access to photographer portfolios
-- Anyone can view portfolio images for browsing photographers

-- Allow photographers to upload to their own portfolio
-- Photographers can only upload to their own portfolio folder

-- Allow photographers to manage their portfolio images
-- Photographers can update/delete their own portfolio images

-- =====================================================
-- POLICY IMPLEMENTATION NOTES
-- =====================================================

-- These policies should be implemented in the Supabase Storage dashboard:
-- 1. Go to Storage > Policies
-- 2. Create policies for each bucket with appropriate conditions
-- 3. Use the user's JWT claims to determine access permissions

-- Example policy structure:
--
-- Bucket: avatars
-- Policy: Allow SELECT for authenticated users
-- Condition: bucket_id = 'avatars'
--
-- Bucket: avatars
-- Policy: Allow INSERT for authenticated users
-- Condition: bucket_id = 'avatars' AND (storage.foldername(name))[1] = auth.uid()::text
--
-- Bucket: event_photos
-- Policy: Allow SELECT for authenticated users
-- Condition: bucket_id = 'event_photos' AND (
--   -- User is participant in the event
--   EXISTS (
--     SELECT 1 FROM event_participants ep
--     JOIN events e ON e.id = ep.event_id
--     WHERE ep.user_id = auth.uid()
--     AND storage.foldername(name) LIKE e.id::text || '/%'
--   )
--   OR
--   -- User is the photographer for the event
--   EXISTS (
--     SELECT 1 FROM events e
--     WHERE e.photographer_id = auth.uid()
--     AND storage.foldername(name) LIKE e.id::text || '/%'
--   )
-- )

-- =====================================================
-- HELPER FUNCTIONS FOR STORAGE POLICIES
-- =====================================================

-- Function to check if user can access event photos
CREATE OR REPLACE FUNCTION can_access_event_photos(event_folder text, user_id uuid)
RETURNS boolean AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM events e
    LEFT JOIN event_participants ep ON ep.event_id = e.id
    WHERE (e.id::text = event_folder OR storage.foldername(name) LIKE event_folder || '/%')
    AND (
      e.photographer_id = user_id
      OR ep.user_id = user_id
      OR e.created_by = user_id
    )
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to check if user owns the file
CREATE OR REPLACE FUNCTION owns_file(file_path text, user_id uuid)
RETURNS boolean AS $$
BEGIN
  -- Extract user ID from file path (assuming format: user_id/filename)
  RETURN (storage.foldername(name))[1] = user_id::text;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to check if user is photographer for event
CREATE OR REPLACE FUNCTION is_event_photographer(event_folder text, user_id uuid)
RETURNS boolean AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM events e
    WHERE e.id::text = event_folder
    AND e.photographer_id = user_id
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================
-- SAMPLE STORAGE POLICIES
-- =====================================================

-- These are sample policies that should be created in Supabase Storage dashboard

/*
AVATARS BUCKET POLICIES:

1. Public Read Access (for profile pictures):
   - Allow: SELECT
   - For: public
   - Condition: bucket_id = 'avatars'

2. Authenticated Upload (users can upload their own avatars):
   - Allow: INSERT
   - For: authenticated users
   - Condition: bucket_id = 'avatars' AND owns_file(name, auth.uid())

3. Users can update their own avatars:
   - Allow: UPDATE
   - For: authenticated users
   - Condition: bucket_id = 'avatars' AND owns_file(name, auth.uid())

4. Users can delete their own avatars:
   - Allow: DELETE
   - For: authenticated users
   - Condition: bucket_id = 'avatars' AND owns_file(name, auth.uid())

EVENT_PHOTOS BUCKET POLICIES:

1. Event participants can view photos:
   - Allow: SELECT
   - For: authenticated users
   - Condition: bucket_id = 'event_photos' AND can_access_event_photos(storage.foldername(name), auth.uid())

2. Photographers can upload to their events:
   - Allow: INSERT
   - For: authenticated users
   - Condition: bucket_id = 'event_photos' AND is_event_photographer(storage.foldername(name), auth.uid())

3. Photographers can manage their uploaded photos:
   - Allow: UPDATE, DELETE
   - For: authenticated users
   - Condition: bucket_id = 'event_photos' AND owns_file(name, auth.uid())

DOCUMENTS BUCKET POLICIES:

1. Users can view their own documents:
   - Allow: SELECT
   - For: authenticated users
   - Condition: bucket_id = 'documents' AND owns_file(name, auth.uid())

2. Users can upload documents:
   - Allow: INSERT
   - For: authenticated users
   - Condition: bucket_id = 'documents' AND owns_file(name, auth.uid())

3. Users can manage their documents:
   - Allow: UPDATE, DELETE
   - For: authenticated users
   - Condition: bucket_id = 'documents' AND owns_file(name, auth.uid())

PORTFOLIO BUCKET POLICIES:

1. Public read access to portfolios:
   - Allow: SELECT
   - For: public
   - Condition: bucket_id = 'portfolio'

2. Photographers can upload to their portfolio:
   - Allow: INSERT
   - For: authenticated users
   - Condition: bucket_id = 'portfolio' AND owns_file(name, auth.uid())

3. Photographers can manage their portfolio:
   - Allow: UPDATE, DELETE
   - For: authenticated users
   - Condition: bucket_id = 'portfolio' AND owns_file(name, auth.uid())
*/

-- =====================================================
-- FILE SIZE AND TYPE VALIDATION
-- =====================================================

-- Function to validate file size (max 10MB)
CREATE OR REPLACE FUNCTION validate_file_size()
RETURNS trigger AS $$
BEGIN
  IF octet_length(NEW.metadata->>'size')::bigint > 10485760 THEN
    RAISE EXCEPTION 'File size exceeds maximum allowed size of 10MB';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Function to validate file type
CREATE OR REPLACE FUNCTION validate_file_type()
RETURNS trigger AS $$
DECLARE
  allowed_types text[] := ARRAY['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'application/pdf'];
  file_type text;
BEGIN
  file_type := NEW.metadata->>'mimetype';

  IF NOT (file_type = ANY(allowed_types)) THEN
    RAISE EXCEPTION 'File type % is not allowed', file_type;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- RATE LIMITING FOR UPLOADS
-- =====================================================

-- Function to check upload rate limits
CREATE OR REPLACE FUNCTION check_upload_rate_limit()
RETURNS trigger AS $$
DECLARE
  upload_count int;
  time_window interval := interval '1 hour';
BEGIN
  -- Count uploads in the last hour for this user
  SELECT COUNT(*) INTO upload_count
  FROM storage.objects
  WHERE bucket_id = NEW.bucket_id
  AND (storage.foldername(name))[1] = (storage.foldername(NEW.name))[1]
  AND created_at > NOW() - time_window;

  -- Limit to 100 uploads per hour per user
  IF upload_count >= 100 THEN
    RAISE EXCEPTION 'Upload rate limit exceeded. Maximum 100 uploads per hour.';
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- AUDIT LOGGING FOR STORAGE OPERATIONS
-- =====================================================

-- Function to log storage operations
CREATE OR REPLACE FUNCTION log_storage_operation()
RETURNS trigger AS $$
BEGIN
  -- Log to audit table (you would need to create this table)
  INSERT INTO storage_audit_log (
    user_id,
    bucket_id,
    file_path,
    operation,
    file_size,
    file_type,
    created_at
  ) VALUES (
    auth.uid(),
    NEW.bucket_id,
    NEW.name,
    TG_OP,
    octet_length(NEW.metadata->>'size'),
    NEW.metadata->>'mimetype',
    NOW()
  );

  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- AUTOMATIC CLEANUP OF OLD TEMPORARY FILES
-- =====================================================

-- Function to clean up temporary files older than 24 hours
CREATE OR REPLACE FUNCTION cleanup_temp_files()
RETURNS void AS $$
BEGIN
  DELETE FROM storage.objects
  WHERE bucket_id = 'temp'
  AND created_at < NOW() - interval '24 hours';
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- BUCKET CONFIGURATION
-- =====================================================

-- Set up bucket configurations (these would be done in Supabase dashboard)

-- AVATARS: Public bucket for profile pictures
-- EVENT_PHOTOS: Private bucket for event photos (access controlled by policies)
-- DOCUMENTS: Private bucket for user documents
-- PORTFOLIO: Public bucket for photographer portfolios
-- TEMP: Private bucket for temporary files (auto-cleanup enabled)

-- =====================================================
-- NOTIFICATION TRIGGERS
-- =====================================================

-- Function to notify users of new photos in their events
CREATE OR REPLACE FUNCTION notify_new_photos()
RETURNS trigger AS $$
BEGIN
  -- Notify event participants when new photos are uploaded
  INSERT INTO notifications (user_id, type, title, message, data)
  SELECT DISTINCT
    ep.user_id,
    'new_photos',
    'New Photos Available',
    'New photos have been uploaded to your event',
    json_build_object('event_id', e.id, 'photo_count', 1)
  FROM events e
  JOIN event_participants ep ON ep.event_id = e.id
  WHERE storage.foldername(NEW.name) LIKE e.id::text || '/%'
  AND ep.user_id != auth.uid()
  AND NOT EXISTS (
    SELECT 1 FROM notifications n
    WHERE n.user_id = ep.user_id
    AND n.type = 'new_photos'
    AND (n.data->>'event_id')::uuid = e.id
    AND n.created_at > NOW() - interval '1 hour'
  );

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- STORAGE QUOTA MANAGEMENT
-- =====================================================

-- Function to check storage quotas
CREATE OR REPLACE FUNCTION check_storage_quota(bucket_name text)
RETURNS boolean AS $$
DECLARE
  user_quota bigint := 1073741824; -- 1GB in bytes
  used_storage bigint;
BEGIN
  -- Calculate total storage used by user in this bucket
  SELECT COALESCE(SUM((metadata->>'size')::bigint), 0) INTO used_storage
  FROM storage.objects
  WHERE bucket_id = bucket_name
  AND (storage.foldername(name))[1] = auth.uid()::text;

  RETURN used_storage < user_quota;
END;
$$ LANGUAGE plpgsql;

-- Add quota check to upload policies
CREATE OR REPLACE FUNCTION validate_upload_permissions()
RETURNS trigger AS $$
BEGIN
  -- Check storage quota
  IF NOT check_storage_quota(NEW.bucket_id) THEN
    RAISE EXCEPTION 'Storage quota exceeded';
  END IF;

  -- Check file size
  IF (NEW.metadata->>'size')::bigint > 10485760 THEN
    RAISE EXCEPTION 'File too large. Maximum size is 10MB';
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;