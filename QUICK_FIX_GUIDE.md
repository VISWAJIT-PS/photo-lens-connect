# 🔧 Quick Fix for Migration Error

## ❌ Error Encountered:
```
ERROR: column "download_count" specified more than once (SQLSTATE 42701)
```

## 🎯 Root Cause:
The `photo_details` view tried to create a column named `download_count` but this column already exists in the `event_photos` table, causing a naming conflict.

## ✅ Quick Fix Options:

### Option 1: Automated Fix (Recommended)
```bash
# Run the fix script
npm run fix:migration

# Then continue with migration
npm run migrate:complete
```

### Option 2: Manual SQL Fix
Go to your Supabase SQL Editor and run this SQL:

```sql
-- Drop the problematic view
DROP VIEW IF EXISTS public.photo_details;

-- Create the corrected view with proper column names
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
    COALESCE(AVG(pm.confidence_score), 0) as avg_match_confidence,
    COUNT(DISTINCT uf.id) as favorite_count,
    COUNT(DISTINCT pd.id) as actual_download_count  -- Actual downloads from tracking
FROM public.event_photos ep
LEFT JOIN public.photo_matches pm ON ep.id = pm.photo_id
LEFT JOIN public.user_favorites uf ON ep.id = uf.photo_id
LEFT JOIN public.photo_downloads pd ON ep.id = pd.photo_id
GROUP BY 
    ep.id, ep.event_id, ep.url, ep.title, ep.timestamp, ep.location, ep.people_count, 
    ep.tags, ep.camera, ep.photographer, ep.resolution, ep.file_size, ep.mime_type, 
    ep.is_featured, ep.is_public, ep.download_count, ep.created_at, ep.updated_at;
```

### Option 3: CLI Migration Fix
```bash
# Apply the fix migration
supabase migration up --file 004_fix_photo_details_view.sql

# Then continue with data migration
npm run migrate:complete
```

### Option 4: Fresh Start
```bash
# Reset everything and start fresh
supabase db reset

# Apply all migrations (the main one is now fixed)
supabase migration up

# Run complete migration
npm run migrate:complete
```

## 🔍 What Was Fixed:

1. **Column Naming Conflict**: Renamed conflicting columns
   - `download_count` (from table) → `stored_download_count`
   - `COUNT(pd.id)` → `actual_download_count`

2. **Added DISTINCT**: Prevented duplicate counting in aggregations
   - `COUNT(pm.id)` → `COUNT(DISTINCT pm.id)`
   - `COUNT(uf.id)` → `COUNT(DISTINCT uf.id)`

3. **Null Handling**: Added `COALESCE` for better null handling
   - `AVG(pm.confidence_score)` → `COALESCE(AVG(pm.confidence_score), 0)`

## ✅ Verification:

After applying the fix, verify it works:

```bash
# Test the migration
npm run test:migration

# Check the view works
# Go to Supabase Dashboard → SQL Editor
# Run: SELECT * FROM photo_details LIMIT 5;
```

## 🎯 Next Steps:

Once fixed, continue with the normal setup:

```bash
# Continue with data migration
npm run migrate:complete

# Generate types
npm run generate:types:remote

# Start your app
npm run dev
```

## 📝 Column Mapping After Fix:

```typescript
// In the photo_details view, you now have:
interface PhotoDetails {
  // Original photo fields
  id: string;
  url: string;
  title: string;
  // ... other fields
  
  // Download counts (now properly named)
  stored_download_count: number;    // From original table
  actual_download_count: number;    // From tracking table
  
  // Calculated analytics
  match_count: number;              // Number of face matches
  avg_match_confidence: number;     // Average confidence score
  favorite_count: number;           // Number of users who favorited
}
```

## 🚨 Prevention:

This fix has been applied to:
- ✅ `003_complete_photo_lens_schema.sql` (corrected)
- ✅ `004_fix_photo_details_view.sql` (dedicated fix)
- ✅ Updated hooks to use correct column names

Future migrations will not have this issue! 🎉