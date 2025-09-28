# 📊 JSON to Supabase Migration Guide

This guide will help you migrate your Photo Lens Connect app from static JSON files to Supabase (PostgreSQL database + API).

## 🏗️ Architecture Overview

### Before (JSON-based)
```
Frontend → Static JSON Files
```

### After (Supabase-based)
```
Frontend → Supabase Client → Supabase API → PostgreSQL Database
```

## 📋 Prerequisites

1. **Supabase Account**: Sign up at [supabase.com](https://supabase.com)
2. **Supabase CLI**: Install the Supabase CLI
   ```bash
   npm install -g supabase
   ```
3. **Node.js**: Version 16 or higher

## 🗄️ Database Schema

The migration creates the following tables:

### Core Tables
- **`events`** - Event information (weddings, parties, etc.)
- **`event_photos`** - Photos associated with events
- **`event_users`** - Users registered for events
- **`event_analytics`** - Analytics data for events

### Analytics Tables
- **`user_demographics`** - Age groups and gender distribution
- **`registration_trends`** - Daily registration counts
- **`popular_tags`** - Most used photo tags

## 🚀 Migration Steps

### Step 1: Set Up Local Supabase (Optional)

If you want to test locally first:

```bash
# Initialize Supabase in your project (if not already done)
supabase init

# Start local Supabase
supabase start
```

### Step 2: Apply Database Migrations

```bash
# Apply the schema migration
npm run db:migrate

# Or manually with Supabase CLI
supabase migration up
```

### Step 3: Set Environment Variables

Create or update your `.env` file:

```bash
# Your Supabase project URL
VITE_SUPABASE_URL=https://your-project-id.supabase.co

# Your Supabase publishable (anon) key
VITE_SUPABASE_PUBLISHABLE_KEY=your-anon-key

# Your Supabase service role key (for migrations only)
SUPABASE_SERVICE_KEY=your-service-role-key
```

### Step 4: Run Data Migration

```bash
# Install tsx if not already installed
npm install -g tsx

# Run the JSON to Supabase migration
npm run migrate:json
```

### Step 5: Generate TypeScript Types

```bash
# Generate types from your Supabase schema
npm run generate:types
```

### Step 6: Update Frontend Code

The migration has already updated your frontend code to use Supabase hooks instead of JSON imports:

#### Before:
```typescript
import eventsData from "@/data/events.json";
import photosData from "@/data/photos.json";

// Using static data
const events = eventsData.events;
const photos = photosData[eventId];
```

#### After:
```typescript
import { useEvents } from "@/hooks/useEvents";
import { useEventPhotos } from "@/hooks/usePhotos";

// Using Supabase hooks
const { data: events, isLoading } = useEvents();
const { data: photos } = useEventPhotos(eventId);
```

## 🔧 Available Hooks

### Events
- `useEvents()` - Fetch all events
- `useEvent(id)` - Fetch single event
- `useEventMutations()` - Create/update/delete events

### Photos  
- `useEventPhotos(eventId)` - Fetch photos for an event
- `usePhoto(id)` - Fetch single photo
- `usePhotosByTags(eventId, tags)` - Search photos by tags
- `usePhotoMutations()` - Create/update/delete photos

### Users
- `useEventUsers(eventId)` - Fetch users for an event
- `useEventUser(id)` - Fetch single user
- `useEventUserStats(eventId)` - Get user statistics
- `useUserMutations()` - Create/update/delete users

### Analytics
- `useEventAnalytics(eventId)` - Fetch analytics for an event
- `useCompleteEventAnalytics(eventId)` - Fetch comprehensive analytics
- `useAnalyticsMutations()` - Update analytics data

## 🔒 Security (Row Level Security)

The migration sets up RLS policies for public read access. For production, you may want to:

1. **Restrict access to specific users/roles**
2. **Add authentication requirements**  
3. **Implement data privacy controls**

Example policy updates:
```sql
-- Restrict events to authenticated users
CREATE POLICY "Events are viewable by authenticated users" ON public.events
    FOR SELECT USING (auth.role() = 'authenticated');

-- Users can only see their own data
CREATE POLICY "Users can view own data" ON public.event_users
    FOR SELECT USING (auth.uid() = user_id);
```

## 📊 Data Mapping

### JSON to Database Field Mapping

| JSON Field | Database Field | Table |
|------------|----------------|-------|
| `events.totalPhotos` | `total_photos` | events |
| `events.registeredUsers` | `registered_users` | events |
| `photo.peopleCount` | `people_count` | event_photos |
| `user.whatsappNumber` | `whatsapp_number` | event_users |
| `user.phoneNumber` | `phone_number` | event_users |
| `user.photosUploaded` | `photos_uploaded` | event_users |
| `user.matchesFound` | `matches_found` | event_users |
| `user.lastActivity` | `last_activity` | event_users |

## 🧪 Testing the Migration

1. **Start your development server**:
   ```bash
   npm run dev
   ```

2. **Visit the Admin Dashboard** to verify data loaded correctly

3. **Check Event Results** to ensure photos are displaying

4. **Verify all data relationships** are working

## 🚀 Production Deployment

### Option 1: Vercel + Supabase (Recommended)

1. **Deploy to Vercel**:
   ```bash
   vercel --prod
   ```

2. **Set environment variables** in Vercel dashboard

3. **Update Supabase settings** for production domain

### Option 2: Other Platforms

Ensure your hosting platform supports:
- Node.js environment variables
- Static site generation/SPA hosting

## 📈 Performance Optimizations

1. **Enable caching** for frequently accessed data:
   ```typescript
   const { data: events } = useEvents({
     staleTime: 5 * 60 * 1000, // 5 minutes
     cacheTime: 10 * 60 * 1000, // 10 minutes
   });
   ```

2. **Use pagination** for large datasets:
   ```typescript
   const { data: photos } = useEventPhotos(eventId, {
     limit: 20,
     offset: page * 20
   });
   ```

3. **Implement search indexes** for better query performance

## 🔍 Troubleshooting

### Common Issues

1. **Migration fails with permission error**
   - Ensure `SUPABASE_SERVICE_KEY` is set correctly
   - Check your Supabase project settings

2. **Types not generating**
   - Run `supabase start` for local development
   - Ensure migrations are applied

3. **Data not loading in frontend**
   - Check browser network tab for API errors
   - Verify RLS policies allow access
   - Ensure environment variables are set

### Debug Commands

```bash
# Check Supabase status
supabase status

# View migration history
supabase migration list

# Reset database (WARNING: destroys all data)
supabase db reset

# View logs
supabase logs
```

## 🎯 Next Steps

1. **Add authentication** for user-specific features
2. **Implement real-time updates** with Supabase subscriptions
3. **Add file storage** for photo uploads
4. **Set up monitoring** and analytics
5. **Create backup strategies**

## 📚 Additional Resources

- [Supabase Documentation](https://supabase.com/docs)
- [React Query Documentation](https://tanstack.com/query/latest)
- [Supabase Auth Guide](https://supabase.com/docs/guides/auth)
- [Row Level Security](https://supabase.com/docs/guides/auth/row-level-security)

---

**Need help?** Open an issue or check the Supabase community forums!