# Website Statistics Integration

## Overview
This document describes the integration of dynamic website statistics from Supabase for the PhotoLens Connect landing page.

## What Was Created

### 1. Database Migration (`supabase/migrations/009_create_website_stats_table.sql`)

Created a new `website_stats` table with the following fields:
- `photographers_count` - Total number of photographers
- `events_count` - Total number of events
- `average_rating` - Average rating across all reviews
- `response_time_hours` - Average response time in hours
- `active_photographers` - Number of active/verified photographers
- `completed_events` - Number of completed bookings
- `total_reviews` - Total number of reviews

**Features:**
- Row Level Security (RLS) enabled
- Public read access for everyone
- Update access for authenticated users only
- Includes `update_website_stats()` function to automatically calculate stats from existing data
- Pre-populated with initial values (500 photographers, 1000 events, 4.9 rating)

### 2. Custom Hook (`src/hooks/use-website-stats.ts`)

Created a React Query hook that:
- Fetches website statistics from Supabase
- Caches data for 5 minutes
- Returns default values if there's an error
- Includes `useUpdateWebsiteStats()` hook to manually trigger stats recalculation

**Usage:**
```typescript
import { useWebsiteStats } from "@/hooks/use-website-stats";

const { data: stats, isLoading } = useWebsiteStats();
```

### 3. Type Definitions

Updated two files:
- `src/lib/supabase-types.ts` - Added `WebsiteStats` interface
- `src/integrations/supabase/types.ts` - Added `website_stats` table and `update_website_stats` function to Database type

### 4. Updated Components

#### HeroSection (`src/components/ui/hero-section.tsx`)
- Now fetches real-time stats from Supabase
- Displays photographers count, events captured, and average rating
- Shows loading state while fetching

#### FeaturesSection (`src/components/ui/features-section.tsx`)
- Updated stats section with dynamic data:
  - Active Photographers (from `active_photographers`)
  - Events Completed (from `completed_events`)
  - Average Rating (from `average_rating`)
  - Response Time (from `response_time_hours`)
- Includes loading states and proper formatting

## How to Use

### Running the Migration

To apply the migration, run:
```bash
# If using Supabase CLI
supabase db push

# Or apply manually in Supabase Dashboard
# Go to SQL Editor and run the migration file
```

### Updating Statistics

The `update_website_stats()` function can be called to recalculate all statistics based on actual database data:

```sql
-- In Supabase SQL Editor
SELECT update_website_stats();
```

Or programmatically:
```typescript
import { useUpdateWebsiteStats } from "@/hooks/use-website-stats";

const updateStats = useUpdateWebsiteStats();
await updateStats();
```

### Setting Up Automatic Updates

You can set up a cron job in Supabase to update stats periodically:

1. Go to Database → Cron Jobs (if available)
2. Create a new job to run `update_website_stats()` daily

Or use pg_cron:
```sql
-- Run daily at midnight
SELECT cron.schedule(
  'update-website-stats',
  '0 0 * * *',
  $$SELECT update_website_stats();$$
);
```

## Benefits

1. **Dynamic Content** - Statistics update automatically based on real data
2. **Performance** - Cached queries reduce database load
3. **Maintainability** - Single source of truth for all stats
4. **Scalability** - Stats are pre-calculated and stored, not computed on every page load
5. **Real-time Updates** - Can be refreshed on-demand or automatically

## Next Steps

1. Run the migration to create the table
2. Test the landing page to see dynamic statistics
3. Set up periodic updates using cron jobs
4. Consider adding more statistics as the platform grows
5. Add admin dashboard to manually update/view statistics

## Notes

- The function `update_website_stats()` requires existing tables like `user_profiles`, `events`, `bookings`, and `reviews` to work correctly
- Default values are used as fallback if the table is empty or there's an error
- The hook includes error handling and returns sensible defaults
