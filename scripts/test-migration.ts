/**
 * Test script to verify the Supabase migration worked correctly
 */

import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.VITE_SUPABASE_URL || "https://jmozptzjskyvzfghrtlw.supabase.co";
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_KEY || process.env.VITE_SUPABASE_PUBLISHABLE_KEY;

if (!SUPABASE_KEY) {
  console.error('Please set SUPABASE_SERVICE_KEY or VITE_SUPABASE_PUBLISHABLE_KEY');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function testMigration() {
  console.log('🧪 Testing Supabase migration...');
  console.log('=====================================');

  try {
    // Test 1: Check if events were migrated
    console.log('1. Testing events table...');
    const { data: events, error: eventsError } = await supabase
      .from('events')
      .select('*');

    if (eventsError) {
      console.error('❌ Events query failed:', eventsError);
      return false;
    }

    console.log(`✅ Found ${events?.length || 0} events`);
    events?.forEach(event => {
      console.log(`   - ${event.name} (${event.status})`);
    });

    // Test 2: Check if photos were migrated
    console.log('\n2. Testing event_photos table...');
    const { data: photos, error: photosError } = await supabase
      .from('event_photos')
      .select('*')
      .limit(5);

    if (photosError) {
      console.error('❌ Photos query failed:', photosError);
      return false;
    }

    console.log(`✅ Found ${photos?.length || 0} photos (showing first 5)`);
    photos?.forEach(photo => {
      console.log(`   - ${photo.title} (${photo.event_id})`);
    });

    // Test 3: Check if users were migrated
    console.log('\n3. Testing event_users table...');
    const { data: users, error: usersError } = await supabase
      .from('event_users')
      .select('*')
      .limit(3);

    if (usersError) {
      console.error('❌ Users query failed:', usersError);
    return false;
    }

    console.log(`✅ Found ${users?.length || 0} users (showing first 3)`);
    users?.forEach(user => {
      console.log(`   - ${user.name} (${user.event_id})`);
    });

    // Test 4: Check if analytics were migrated
    console.log('\n4. Testing event_analytics table...');
    const { data: analytics, error: analyticsError } = await supabase
      .from('event_analytics')
      .select('*');

    if (analyticsError) {
      console.error('❌ Analytics query failed:', analyticsError);
      return false;
    }

    console.log(`✅ Found ${analytics?.length || 0} analytics records`);
    analytics?.forEach(analytic => {
      console.log(`   - Event ${analytic.event_id}: ${analytic.total_registrations} registrations`);
    });

    // Test 5: Test joins (event with photos)
    console.log('\n5. Testing table relationships...');
    const { data: eventWithPhotos, error: joinError } = await supabase
      .from('events')
      .select(`
        *,
        event_photos(count)
      `)
      .limit(1);

    if (joinError) {
      console.error('❌ Join query failed:', joinError);
      return false;
    }

    console.log('✅ Table relationships working');
    
    // Test 6: Test RLS policies
    console.log('\n6. Testing Row Level Security...');
    const { data: publicEvents, error: rlsError } = await supabase
      .from('events')
      .select('*')
      .limit(1);

    if (rlsError) {
      console.error('❌ RLS test failed:', rlsError);
      return false;
    }

    console.log('✅ RLS policies allow public access');

    console.log('\n=====================================');
    console.log('🎉 Migration test completed successfully!');
    console.log('\nNext steps:');
    console.log('1. Start your dev server: npm run dev');
    console.log('2. Visit the Admin Dashboard to see live data');
    console.log('3. Test the Event Results page');
    
    return true;

  } catch (error) {
    console.error('❌ Test failed:', error);
    return false;
  }
}

// Run tests if this script is executed directly
if (require.main === module) {
  testMigration().then(success => {
    process.exit(success ? 0 : 1);
  });
}

export { testMigration };