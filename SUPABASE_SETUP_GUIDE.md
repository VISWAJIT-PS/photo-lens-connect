# 🚀 Complete Supabase Migration Guide

## 📋 Overview

This guide provides complete instructions for migrating from static JSON files to Supabase using the CLI. All static data dependencies have been removed and replaced with dynamic Supabase queries.

## ✅ What Was Removed/Replaced

### ❌ Removed Static Files:
- `src/data/events.json` → `events` table
- `src/data/photos.json` → `event_photos` table  
- `src/data/users.json` → `event_users` table
- `src/data/analytics.json` → Multiple analytics tables

### ✅ Added Dynamic Features:
- Complete PostgreSQL schema with relationships
- Enhanced analytics with demographics and trends
- Photo matching system with confidence scores
- User favorites and download tracking
- Real-time ready architecture

## 🛠️ Prerequisites

1. **Supabase CLI** installed globally:
   ```bash
   npm install -g supabase
   ```

2. **Supabase Account** with a project created at [supabase.com](https://supabase.com)

3. **Environment Variables** set up:
   ```bash
   # Add to your .env file
   VITE_SUPABASE_URL=https://your-project-id.supabase.co
   VITE_SUPABASE_PUBLISHABLE_KEY=your-anon-key
   SUPABASE_SERVICE_KEY=your-service-role-key
   ```

## 🎯 Quick Start (Production)

### Option 1: Direct Production Migration

```bash
# 1. Link to your Supabase project
supabase link --project-ref your-project-id

# 2. Apply the complete schema migration
supabase db push

# 3. Run the complete data migration
npm run migrate:complete

# 4. Test the migration
npm run test:migration

# 5. Generate TypeScript types
npm run generate:types:remote

# 6. Start your application
npm run dev
```

### Option 2: Local Development First

```bash
# 1. Start local Supabase (requires Docker)
npm run supabase:start

# 2. Apply migrations locally
npm run db:migrate

# 3. Run data migration locally
npm run migrate:complete

# 4. Generate types from local schema
npm run generate:types

# 5. Test locally
npm run dev

# 6. When ready, push to production
supabase db push
```

## 🗄️ Database Schema Architecture

### Core Tables
```sql
events                 -- Main events (weddings, parties, etc.)
├── event_photos      -- Photos for each event
├── event_users       -- Registered users per event
├── event_analytics   -- Main analytics per event
└── Enhanced Features:
    ├── user_demographics    -- Age/gender statistics
    ├── registration_trends  -- Daily registration data
    ├── popular_tags        -- Trending photo tags
    ├── photo_matches       -- Face recognition results
    ├── user_favorites      -- User photo favorites
    └── photo_downloads     -- Download tracking
```

### Views for Complex Queries
```sql
event_summary     -- Events with calculated statistics
photo_details     -- Photos with match/favorite counts
```

## 🔧 Configuration Steps

### 1. Supabase Project Setup

```bash
# Initialize Supabase in your project (if not done)
supabase init

# Link to your remote project
supabase link --project-ref YOUR_PROJECT_ID

# Check status
npm run supabase:status
```

### 2. Environment Configuration

Create/update your `.env` file:

```bash
# Your Supabase project URL
VITE_SUPABASE_URL=https://jmozptzjskyvzfghrtlw.supabase.co

# Your Supabase publishable key (safe for frontend)
VITE_SUPABASE_PUBLISHABLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Your Supabase service role key (for migrations, keep secure!)
SUPABASE_SERVICE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### 3. Database Migration

```bash
# Apply the complete schema
supabase db push

# Or apply specific migration
supabase migration up --file 003_complete_photo_lens_schema.sql
```

### 4. Data Migration

```bash
# Run the complete migration script
npm run migrate:complete

# This will:
# ✅ Clear any existing data
# ✅ Migrate all JSON data to proper tables
# ✅ Create relationships and foreign keys
# ✅ Generate sample analytics data
# ✅ Set up photo matches and favorites
# ✅ Test the migration success
```

## 📊 Verification Steps

### 1. Check Database Tables

```bash
# Using Supabase CLI
supabase inspect db tables

# Or visit your Supabase Dashboard
# https://app.supabase.com/project/your-project-id/editor
```

### 2. Test API Endpoints

```bash
# Test events endpoint
curl "https://your-project-id.supabase.co/rest/v1/events" \
  -H "apikey: your-anon-key" \
  -H "Authorization: Bearer your-anon-key"

# Test photos endpoint
curl "https://your-project-id.supabase.co/rest/v1/event_photos?event_id=eq.wedding-2024-001" \
  -H "apikey: your-anon-key" \
  -H "Authorization: Bearer your-anon-key"
```

### 3. Frontend Testing

```bash
# Start your application
npm run dev

# Visit these pages to verify:
# - Admin Dashboard: /admin-dashboard
# - Event Results: /event-results/wedding-2024-001
# - Check browser Network tab for API calls
```

## 🎨 Frontend Integration Examples

### Before (Static JSON):
```typescript
// ❌ Old way with static imports
import eventsData from "@/data/events.json";
import photosData from "@/data/photos.json";

const events = eventsData.events;
const photos = photosData["wedding-2024-001"];
```

### After (Dynamic Supabase):
```typescript
// ✅ New way with Supabase hooks
import { useEvents } from "@/hooks/useEvents";
import { useEventPhotos } from "@/hooks/usePhotos";

const { data: events, isLoading } = useEvents();
const { data: photos } = useEventPhotos("wedding-2024-001");
```

### Advanced Usage:
```typescript
// Featured photos only
const { data: featuredPhotos } = useEventPhotos(eventId, { 
  featured: true, 
  limit: 10 
});

// Photos by specific photographer
const { data: photographerPhotos } = useEventPhotos(eventId, {
  photographer: "Mike Johnson"
});

// Photos with specific tags
const { data: taggedPhotos } = useEventPhotos(eventId, {
  tags: ["wedding", "ceremony"]
});

// Events summary with analytics
const { data: eventsSummary } = useEventsSummary();
```

## 🔐 Security & RLS Policies

The migration sets up Row Level Security (RLS) with these default policies:

```sql
-- Public read access for events and photos
"Events are publicly viewable"
"Public photos are viewable" (only where is_public = true)

-- User-specific access for favorites
"Users can view their favorites" 
"Users can manage their favorites"

-- Admin access via service role
"Service role can manage all data"
```

### Customizing Security:

```sql
-- Example: Restrict to authenticated users only
DROP POLICY "Events are publicly viewable" ON events;
CREATE POLICY "Events require authentication" ON events
  FOR SELECT USING (auth.role() = 'authenticated');

-- Example: User-specific data access
CREATE POLICY "Users see own registrations" ON event_users
  FOR SELECT USING (auth.uid()::text = id);
```

## 📈 Performance Optimizations

### Database Indexes (Already Applied):
```sql
-- Essential indexes for fast queries
idx_events_status, idx_events_date
idx_event_photos_event_id, idx_event_photos_tags
idx_event_users_event_id, idx_event_users_status
-- Plus 15+ other performance indexes
```

### React Query Caching:
```typescript
// Automatic caching with stale times
const { data: events } = useEvents(); // 5min cache
const { data: photos } = useEventPhotos(eventId); // 2min cache
```

### Pagination Example:
```typescript
const { data: photos } = useEventPhotos(eventId, { 
  limit: 20, // Load 20 at a time
  offset: page * 20 
});
```

## 🚨 Troubleshooting

### Common Issues:

**❌ "Failed to connect to database"**
```bash
# Check your environment variables
echo $VITE_SUPABASE_URL
echo $SUPABASE_SERVICE_KEY

# Verify project connection
supabase projects list
supabase link --project-ref your-project-id
```

**❌ "Migration failed"**
```bash
# Check migration status
supabase migration list

# Reset and retry
supabase db reset
supabase db push
```

**❌ "RLS policy violation"**
```bash
# Check RLS policies in Supabase dashboard
# Or disable RLS temporarily for testing:
ALTER TABLE events DISABLE ROW LEVEL SECURITY;
```

**❌ "Types not found"**
```bash
# Regenerate types
npm run generate:types:remote

# Restart TypeScript server in VS Code
# Cmd/Ctrl + Shift + P -> "TypeScript: Restart TS Server"
```

### Debug Commands:
```bash
# Check Supabase status
npm run supabase:status

# View logs
supabase logs

# Inspect database
supabase inspect db

# Test connection
supabase test db
```

## 🎯 Next Steps

### Immediate (After Migration):
1. ✅ Verify all pages load correctly
2. ✅ Test admin dashboard functionality  
3. ✅ Check event results display
4. ✅ Deploy to production

### Short-term Enhancements:
1. **Authentication**: Add user login/signup
2. **Real-time**: Subscribe to live updates
3. **File Upload**: Direct photo uploads to Supabase Storage
4. **Search**: Full-text search across photos

### Long-term Features:
1. **Mobile App**: React Native with same hooks
2. **AI Integration**: Automated photo tagging
3. **Multi-tenant**: Support multiple organizations
4. **Advanced Analytics**: Custom dashboards

## 📚 Resources

- **[Supabase CLI Docs](https://supabase.com/docs/guides/cli)**
- **[Database Migration Guide](https://supabase.com/docs/guides/cli/local-development#database-migrations)**
- **[Row Level Security](https://supabase.com/docs/guides/auth/row-level-security)**
- **[React Query Integration](https://supabase.com/docs/guides/with-react#react-query)**

## 🎉 Migration Checklist

- [ ] ✅ Static JSON files removed
- [ ] ✅ Supabase CLI configured
- [ ] ✅ Environment variables set
- [ ] ✅ Database schema applied
- [ ] ✅ Data migration completed
- [ ] ✅ TypeScript types generated
- [ ] ✅ Frontend hooks updated
- [ ] ✅ Application tested locally
- [ ] ✅ Production deployment ready

---

**🚀 Your Photo Lens Connect app is now powered by Supabase!**

You've successfully migrated from static JSON to a modern, scalable, real-time database backend. The foundation is set for building advanced features like authentication, real-time collaboration, and AI-powered photo analysis.