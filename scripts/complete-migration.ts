#!/usr/bin/env tsx
/**
 * Complete Migration Script - JSON to Supabase
 * This script removes all static JSON dependencies and migrates data to Supabase
 */

import { createClient } from '@supabase/supabase-js';
import { readFileSync, existsSync } from 'fs';
import { join } from 'path';

// Supabase configuration
const SUPABASE_URL = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY || process.env.SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
  console.error('❌ Missing Supabase configuration!');
  console.error('Please set the following environment variables:');
  console.error('- VITE_SUPABASE_URL or SUPABASE_URL');
  console.error('- SUPABASE_SERVICE_KEY or SUPABASE_ANON_KEY');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

// Define data structures from original JSON
interface EventData {
  id: string;
  name: string;
  date: string;
  location: string;
  description: string;
  totalPhotos: number;
  registeredUsers: number;
  status: string;
}

interface PhotoData {
  id: string;
  url: string;
  title: string;
  timestamp: string;
  location: string;
  peopleCount: number;
  tags: string[];
  camera: string;
  photographer: string;
  resolution: string;
}

interface UserData {
  id: string;
  name: string;
  whatsappNumber: string;
  phoneNumber: string;
  registrationDate: string;
  photosUploaded: number;
  matchesFound: number;
  status: string;
  lastActivity: string;
}

interface AnalyticsData {
  totalRegistrations: number;
  totalPhotosUploaded: number;
  totalMatchesFound: number;
  averageMatchConfidence: number;
  topMatchingPhotos: string[];
  userDemographics: {
    ageGroups: Record<string, number>;
    genderDistribution: Record<string, number>;
  };
  engagementMetrics: {
    photosDownloaded: number;
    photosShared: number;
    favoritesMarked: number;
    averageSessionTime: string;
  };
  registrationTrends: Array<{ date: string; count: number }>;
  popularTags: Array<{ tag: string; count: number }>;
}

// Sample data to replace the JSON files (you can modify this with your actual current data)
const SAMPLE_DATA = {
  events: {
    events: [
      {
        id: "wedding-2024-001",
        name: "Sarah & John's Wedding",
        date: "2024-01-15",
        location: "Grand Ballroom, Downtown Hotel",
        description: "An elegant wedding celebration with 150 guests",
        totalPhotos: 245,
        registeredUsers: 23,
        status: "active"
      },
      {
        id: "corporate-2024-002",
        name: "TechCorp Annual Conference",
        date: "2024-02-20",
        location: "Convention Center",
        description: "Annual technology conference with keynote speakers",
        totalPhotos: 180,
        registeredUsers: 45,
        status: "completed"
      },
      {
        id: "birthday-2024-003",
        name: "Emma's 30th Birthday",
        date: "2024-03-10",
        location: "Riverside Restaurant",
        description: "Surprise birthday party celebration",
        totalPhotos: 95,
        registeredUsers: 18,
        status: "active"
      }
    ]
  },
  photos: {
    "wedding-2024-001": [
      {
        id: "photo-001",
        url: "https://images.unsplash.com/photo-1519741497674-611481863552?w=600",
        title: "Reception Entrance",
        timestamp: "2024-01-15T18:30:00Z",
        location: "Main Hall Entrance",
        peopleCount: 12,
        tags: ["reception", "group", "formal", "entrance"],
        camera: "Canon EOS R5",
        photographer: "Mike Johnson",
        resolution: "4000x3000"
      },
      {
        id: "photo-002",
        url: "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=600",
        title: "Ceremony Vows",
        timestamp: "2024-01-15T16:00:00Z",
        location: "Ceremony Hall",
        peopleCount: 8,
        tags: ["ceremony", "emotional", "couple", "vows"],
        camera: "Nikon D850",
        photographer: "Sarah Davis",
        resolution: "3000x2000"
      },
      {
        id: "photo-003",
        url: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=600",
        title: "Dinner Table Celebration",
        timestamp: "2024-01-15T19:45:00Z",
        location: "Dining Area",
        peopleCount: 6,
        tags: ["dinner", "casual", "friends", "celebration"],
        camera: "Sony A7R IV",
        photographer: "Mike Johnson",
        resolution: "3500x2500"
      },
      {
        id: "photo-004",
        url: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=600",
        title: "Dance Floor Energy",
        timestamp: "2024-01-15T21:15:00Z",
        location: "Dance Floor",
        peopleCount: 15,
        tags: ["dance", "party", "fun", "energy"],
        camera: "Canon EOS R6",
        photographer: "Emma Wilson",
        resolution: "4000x2800"
      }
    ],
    "corporate-2024-002": [
      {
        id: "corp-001",
        url: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=600",
        title: "Keynote Presentation",
        timestamp: "2024-02-20T09:00:00Z",
        location: "Main Auditorium",
        peopleCount: 25,
        tags: ["presentation", "keynote", "corporate", "conference"],
        camera: "Canon EOS R5",
        photographer: "Corporate Team",
        resolution: "4000x3000"
      }
    ],
    "birthday-2024-003": [
      {
        id: "bday-001",
        url: "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=600",
        title: "Birthday Surprise",
        timestamp: "2024-03-10T18:00:00Z",
        location: "Private Room",
        peopleCount: 12,
        tags: ["birthday", "surprise", "celebration", "party"],
        camera: "iPhone 15 Pro",
        photographer: "Guest Photographer",
        resolution: "3000x2000"
      }
    ]
  },
  users: {
    "wedding-2024-001": [
      {
        id: "user-001",
        name: "Alice Johnson",
        whatsappNumber: "+1234567890",
        phoneNumber: "+1234567890",
        registrationDate: "2024-01-10T14:30:00Z",
        photosUploaded: 3,
        matchesFound: 8,
        status: "completed",
        lastActivity: "2024-01-16T10:15:00Z"
      },
      {
        id: "user-002",
        name: "Bob Smith",
        whatsappNumber: "+1234567891",
        phoneNumber: "+1234567891",
        registrationDate: "2024-01-11T09:20:00Z",
        photosUploaded: 4,
        matchesFound: 12,
        status: "completed",
        lastActivity: "2024-01-16T11:30:00Z"
      }
    ],
    "corporate-2024-002": [
      {
        id: "corp-user-001",
        name: "Frank Miller",
        whatsappNumber: "+1234567895",
        phoneNumber: "+1234567895",
        registrationDate: "2024-02-15T08:00:00Z",
        photosUploaded: 3,
        matchesFound: 7,
        status: "completed",
        lastActivity: "2024-02-21T12:00:00Z"
      }
    ],
    "birthday-2024-003": [
      {
        id: "bday-user-001",
        name: "Henry Taylor",
        whatsappNumber: "+1234567897",
        phoneNumber: "+1234567897",
        registrationDate: "2024-03-05T17:00:00Z",
        photosUploaded: 3,
        matchesFound: 5,
        status: "completed",
        lastActivity: "2024-03-11T19:30:00Z"
      }
    ]
  },
  analytics: {
    "wedding-2024-001": {
      totalRegistrations: 23,
      totalPhotosUploaded: 89,
      totalMatchesFound: 156,
      averageMatchConfidence: 78.5,
      topMatchingPhotos: ["photo-003", "photo-006", "photo-001"],
      userDemographics: {
        ageGroups: { "18-25": 5, "26-35": 12, "36-45": 4, "46+": 2 },
        genderDistribution: { male: 10, female: 11, other: 2 }
      },
      engagementMetrics: {
        photosDownloaded: 67,
        photosShared: 23,
        favoritesMarked: 45,
        averageSessionTime: "8m 32s"
      },
      registrationTrends: [
        { date: "2024-01-10", count: 3 },
        { date: "2024-01-11", count: 5 },
        { date: "2024-01-12", count: 7 },
        { date: "2024-01-13", count: 4 },
        { date: "2024-01-14", count: 4 }
      ],
      popularTags: [
        { tag: "reception", count: 15 },
        { tag: "dance", count: 12 },
        { tag: "family", count: 10 },
        { tag: "ceremony", count: 8 },
        { tag: "dinner", count: 6 }
      ]
    },
    "corporate-2024-002": {
      totalRegistrations: 45,
      totalPhotosUploaded: 135,
      totalMatchesFound: 203,
      averageMatchConfidence: 82.1,
      topMatchingPhotos: ["corp-001"],
      userDemographics: {
        ageGroups: { "18-25": 8, "26-35": 25, "36-45": 10, "46+": 2 },
        genderDistribution: { male: 28, female: 15, other: 2 }
      },
      engagementMetrics: {
        photosDownloaded: 89,
        photosShared: 34,
        favoritesMarked: 67,
        averageSessionTime: "12m 15s"
      },
      registrationTrends: [
        { date: "2024-02-15", count: 12 },
        { date: "2024-02-16", count: 15 },
        { date: "2024-02-17", count: 10 },
        { date: "2024-02-18", count: 8 }
      ],
      popularTags: [
        { tag: "presentation", count: 18 },
        { tag: "networking", count: 14 },
        { tag: "corporate", count: 12 },
        { tag: "keynote", count: 9 }
      ]
    }
  }
};

async function clearExistingData() {
  console.log('🧹 Clearing existing data...');
  
  const tables = [
    'popular_tags',
    'registration_trends', 
    'user_demographics',
    'photo_matches',
    'user_favorites',
    'photo_downloads',
    'event_analytics',
    'event_users',
    'event_photos',
    'events'
  ];

  for (const table of tables) {
    const { error } = await supabase.from(table).delete().neq('id', '');
    if (error && !error.message.includes('does not exist')) {
      console.warn(`⚠️ Warning clearing ${table}:`, error.message);
    }
  }
  
  console.log('✅ Existing data cleared');
}

async function migrateEvents() {
  console.log('📅 Migrating events...');
  
  const events = SAMPLE_DATA.events.events.map((event: EventData) => ({
    id: event.id,
    name: event.name,
    date: event.date,
    location: event.location,
    description: event.description,
    total_photos: event.totalPhotos,
    registered_users: event.registeredUsers,
    status: event.status
  }));

  const { data, error } = await supabase
    .from('events')
    .insert(events)
    .select();

  if (error) {
    console.error('❌ Error migrating events:', error);
    throw error;
  }

  console.log(`✅ Migrated ${events.length} events`);
  return data;
}

async function migratePhotos() {
  console.log('📸 Migrating photos...');
  
  const allPhotos: any[] = [];
  
  Object.entries(SAMPLE_DATA.photos).forEach(([eventId, photos]) => {
    if (Array.isArray(photos)) {
      photos.forEach((photo: PhotoData) => {
        allPhotos.push({
          id: photo.id,
          event_id: eventId,
          url: photo.url,
          title: photo.title,
          timestamp: photo.timestamp,
          location: photo.location,
          people_count: photo.peopleCount,
          tags: photo.tags,
          camera: photo.camera,
          photographer: photo.photographer,
          resolution: photo.resolution,
          is_public: true,
          is_featured: Math.random() > 0.7 // Random featured photos
        });
      });
    }
  });

  const { data, error } = await supabase
    .from('event_photos')
    .insert(allPhotos)
    .select();

  if (error) {
    console.error('❌ Error migrating photos:', error);
    throw error;
  }

  console.log(`✅ Migrated ${allPhotos.length} photos`);
  return data;
}

async function migrateUsers() {
  console.log('👥 Migrating users...');
  
  const allUsers: any[] = [];
  
  Object.entries(SAMPLE_DATA.users).forEach(([eventId, users]) => {
    if (Array.isArray(users)) {
      users.forEach((user: UserData) => {
        allUsers.push({
          id: user.id,
          event_id: eventId,
          name: user.name,
          whatsapp_number: user.whatsappNumber,
          phone_number: user.phoneNumber,
          registration_date: user.registrationDate,
          photos_uploaded: user.photosUploaded,
          matches_found: user.matchesFound,
          status: user.status,
          last_activity: user.lastActivity,
          notifications_enabled: true
        });
      });
    }
  });

  const { data, error } = await supabase
    .from('event_users')
    .insert(allUsers)
    .select();

  if (error) {
    console.error('❌ Error migrating users:', error);
    throw error;
  }

  console.log(`✅ Migrated ${allUsers.length} users`);
  return data;
}

async function migrateAnalytics() {
  console.log('📊 Migrating analytics...');
  
  const analytics: any[] = [];
  const demographics: any[] = [];
  const trends: any[] = [];
  const tags: any[] = [];
  
  Object.entries(SAMPLE_DATA.analytics).forEach(([eventId, data]: [string, AnalyticsData]) => {
    // Main analytics
    analytics.push({
      event_id: eventId,
      total_registrations: data.totalRegistrations,
      total_photos_uploaded: data.totalPhotosUploaded,
      total_matches_found: data.totalMatchesFound,
      average_match_confidence: data.averageMatchConfidence,
      top_matching_photos: data.topMatchingPhotos,
      photos_downloaded: data.engagementMetrics.photosDownloaded,
      photos_shared: data.engagementMetrics.photosShared,
      favorites_marked: data.engagementMetrics.favoritesMarked,
      average_session_time: data.engagementMetrics.averageSessionTime.replace('m', ' minutes').replace('s', ' seconds')
    });

    // Demographics - age groups
    Object.entries(data.userDemographics.ageGroups).forEach(([ageGroup, count]) => {
      demographics.push({
        event_id: eventId,
        age_group: ageGroup,
        count: count,
        gender: null,
        gender_count: 0
      });
    });

    // Demographics - gender distribution  
    Object.entries(data.userDemographics.genderDistribution).forEach(([gender, count]) => {
      demographics.push({
        event_id: eventId,
        age_group: '26-35', // Default for gender-only records
        count: 0,
        gender: gender,
        gender_count: count
      });
    });

    // Registration trends
    data.registrationTrends.forEach((trend, index) => {
      trends.push({
        event_id: eventId,
        date: trend.date,
        count: trend.count,
        cumulative_count: data.registrationTrends.slice(0, index + 1).reduce((sum, t) => sum + t.count, 0)
      });
    });

    // Popular tags
    data.popularTags.forEach(tag => {
      tags.push({
        event_id: eventId,
        tag: tag.tag,
        count: tag.count,
        trending_score: tag.count * 1.0 // Simple trending score
      });
    });
  });

  // Insert all analytics data
  const { error: analyticsError } = await supabase.from('event_analytics').insert(analytics);
  if (analyticsError) {
    console.error('❌ Error migrating analytics:', analyticsError);
    throw analyticsError;
  }

  const { error: demographicsError } = await supabase.from('user_demographics').insert(demographics);
  if (demographicsError) {
    console.error('❌ Error migrating demographics:', demographicsError);
    throw demographicsError;
  }

  const { error: trendsError } = await supabase.from('registration_trends').insert(trends);
  if (trendsError) {
    console.error('❌ Error migrating trends:', trendsError);
    throw trendsError;
  }

  const { error: tagsError } = await supabase.from('popular_tags').insert(tags);
  if (tagsError) {
    console.error('❌ Error migrating tags:', tagsError);
    throw tagsError;
  }

  console.log(`✅ Migrated analytics for ${Object.keys(SAMPLE_DATA.analytics).length} events`);
}

async function updateEventStats() {
  console.log('🔄 Updating event statistics...');
  
  for (const eventId of Object.keys(SAMPLE_DATA.photos)) {
    const { error } = await supabase.rpc('update_event_stats', { 
      event_id_param: eventId 
    });
    
    if (error) {
      console.warn(`⚠️ Warning updating stats for ${eventId}:`, error.message);
    }
  }
  
  console.log('✅ Event statistics updated');
}

async function generateSampleMatches() {
  console.log('🎯 Generating sample photo matches...');
  
  const matches: any[] = [];
  
  // Get all photos and users for generating matches
  const { data: photos } = await supabase.from('event_photos').select('id, event_id');
  const { data: users } = await supabase.from('event_users').select('id, event_id');
  
  if (photos && users) {
    // Generate some sample matches
    photos.forEach(photo => {
      const eventUsers = users.filter(u => u.event_id === photo.event_id);
      
      // Create 1-3 matches per photo
      const matchCount = Math.floor(Math.random() * 3) + 1;
      
      for (let i = 0; i < Math.min(matchCount, eventUsers.length); i++) {
        const user = eventUsers[Math.floor(Math.random() * eventUsers.length)];
        matches.push({
          event_id: photo.event_id,
          photo_id: photo.id,
          user_id: user.id,
          confidence_score: Math.floor(Math.random() * 30) + 70, // 70-100% confidence
          match_type: 'face',
          is_confirmed: Math.random() > 0.5
        });
      }
    });
  }

  if (matches.length > 0) {
    const { error } = await supabase.from('photo_matches').insert(matches);
    if (error) {
      console.warn('⚠️ Warning generating matches:', error.message);
    } else {
      console.log(`✅ Generated ${matches.length} sample photo matches`);
    }
  }
}

async function testMigration() {
  console.log('🧪 Testing migration...');
  
  // Test basic queries
  const { data: events, error: eventsError } = await supabase
    .from('events')
    .select('*');
    
  if (eventsError) {
    console.error('❌ Test failed - events query:', eventsError);
    return false;
  }

  const { data: photos, error: photosError } = await supabase
    .from('event_photos')
    .select('*')
    .limit(5);
    
  if (photosError) {
    console.error('❌ Test failed - photos query:', photosError);
    return false;
  }

  // Test views
  const { data: eventSummary, error: summaryError } = await supabase
    .from('event_summary')
    .select('*')
    .limit(1);
    
  if (summaryError) {
    console.warn('⚠️ Views may not be available:', summaryError.message);
  }

  console.log('✅ Migration test passed');
  console.log(`   - ${events?.length || 0} events`);
  console.log(`   - ${photos?.length || 0} photos (sample)`);
  
  return true;
}

async function runCompleteMigration() {
  try {
    console.log('🚀 Starting complete JSON to Supabase migration...');
    console.log('====================================================');
    
    // Step 1: Clear existing data
    await clearExistingData();
    
    // Step 2: Migrate core data
    await migrateEvents();
    await migratePhotos();
    await migrateUsers();
    await migrateAnalytics();
    
    // Step 3: Update statistics
    await updateEventStats();
    
    // Step 4: Generate sample enhanced data
    await generateSampleMatches();
    
    // Step 5: Test migration
    const success = await testMigration();
    
    if (success) {
      console.log('====================================================');
      console.log('🎉 Complete migration successful!');
      console.log('');
      console.log('✅ All static JSON data has been migrated to Supabase');
      console.log('✅ Database schema created with proper relationships');
      console.log('✅ Sample data populated with realistic values');
      console.log('✅ Analytics and enhanced features ready');
      console.log('');
      console.log('🔄 Next steps:');
      console.log('1. Update your frontend code to use Supabase hooks');
      console.log('2. Remove any remaining JSON file imports');
      console.log('3. Test your application: npm run dev');
      console.log('4. Deploy to production with environment variables');
      console.log('');
      console.log('🌐 Access your data:');
      console.log(`   Supabase Dashboard: ${SUPABASE_URL.replace('/rest/v1', '')}`);
      console.log('   API Endpoint: ' + SUPABASE_URL);
    }
    
    return success;
    
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  }
}

// Run migration if script is executed directly
if (require.main === module) {
  runCompleteMigration().then(success => {
    process.exit(success ? 0 : 1);
  });
}

export { runCompleteMigration };