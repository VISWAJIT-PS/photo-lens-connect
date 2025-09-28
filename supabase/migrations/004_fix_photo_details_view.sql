-- Fix the photo_details view column name conflict
-- The event_photos table already has a download_count column, so we need to rename the calculated one

DROP VIEW IF EXISTS public.photo_details;

-- Recreate the view with corrected column names
CREATE VIEW public.photo_details AS
SELECT 
    ep.id,
    ep.event_id,
    ep.url,
    ep.title,
    ep.timestamp,
    ep.location,
    ep.people_count,
    ep.tags,
    ep.camera,
    ep.photographer,
    ep.resolution,
    ep.file_size,
    ep.mime_type,
    ep.is_featured,
    ep.is_public,
    ep.download_count as stored_download_count,  -- Original column from table
    ep.created_at,
    ep.updated_at,
    -- Calculated columns from joins
    COUNT(DISTINCT pm.id) as match_count,
    AVG(pm.confidence_score) as avg_match_confidence,
    COUNT(DISTINCT uf.id) as favorite_count,
    COUNT(DISTINCT pd.id) as actual_download_count  -- Actual downloads from tracking table
FROM public.event_photos ep
LEFT JOIN public.photo_matches pm ON ep.id = pm.photo_id
LEFT JOIN public.user_favorites uf ON ep.id = uf.photo_id
LEFT JOIN public.photo_downloads pd ON ep.id = pd.photo_id
GROUP BY 
    ep.id, ep.event_id, ep.url, ep.title, ep.timestamp, ep.location, ep.people_count, 
    ep.tags, ep.camera, ep.photographer, ep.resolution, ep.file_size, ep.mime_type, 
    ep.is_featured, ep.is_public, ep.download_count, ep.created_at, ep.updated_at;