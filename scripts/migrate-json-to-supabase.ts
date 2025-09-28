/**
 * Migration script to import existing JSON data into Supabase
 * Run this script after applying the database migrations
 */

import { createClient } from '@supabase/supabase-js';

// Import JSON data
const eventsData = {
  "events": [
    {
      "id": "wedding-2024-001",
      "name": "Sarah & John's Wedding",
      "date": "2024-01-15",
      "location": "Grand Ballroom, Downtown Hotel",
      "description": "An elegant wedding celebration with 150 guests",
      "totalPhotos": 245,
      "registeredUsers": 23,
      "status": "active"
    },
    {
      "id": "corporate-2024-002",
      "name": "TechCorp Annual Conference",
      "date": "2024-02-20",
      "location": "Convention Center",
      "description": "Annual technology conference with keynote speakers",
      "totalPhotos": 180,
      "registeredUsers": 45,
      "status": "completed"
    },
    {
      "id": "birthday-2024-003",
      "name": "Emma's 30th Birthday",
      "date": "2024-03-10",
      "location": "Riverside Restaurant",
      "description": "Surprise birthday party celebration",
      "totalPhotos": 95,
      "registeredUsers": 18,
      "status": "active"
    }
  ]
};

// Supabase configuration
const SUPABASE_URL = process.env.VITE_SUPABASE_URL || "https://jmozptzjskyvzfghrtlw.supabase.co";
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY || process.env.VITE_SUPABASE_PUBLISHABLE_KEY;

if (!SUPABASE_SERVICE_KEY) {
  console.error('Please set SUPABASE_SERVICE_KEY environment variable');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

async function runMigration() {
  try {
    console.log('🚀 Starting JSON to Supabase migration...');
    console.log('==========================================');
    
    // Migrate events
    console.log('Migrating events...');
    const { data: eventsResult, error: eventsError } = await supabase
      .from('events')
      .upsert(eventsData.events.map(event => ({
        id: event.id,
        name: event.name,
        date: event.date,
        location: event.location,
        description: event.description,
        total_photos: event.totalPhotos,
        registered_users: event.registeredUsers,
        status: event.status
      })));

    if (eventsError) {
      console.error('Error migrating events:', eventsError);
      throw eventsError;
    }
    
    console.log(`✅ Migrated ${eventsData.events.length} events`);
    
    console.log('==========================================');
    console.log('✅ Migration completed successfully!');
    
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  }
}

// Run the migration if this script is executed directly
if (require.main === module) {
  runMigration();
}

export { runMigration };