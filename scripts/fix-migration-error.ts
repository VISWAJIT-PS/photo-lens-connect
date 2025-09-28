#!/usr/bin/env tsx
/**
 * Quick fix script for the migration error
 * This addresses the column name conflict in the photo_details view
 */

import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY || process.env.SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
  console.error('❌ Missing Supabase configuration!');
  console.error('Please set VITE_SUPABASE_URL and SUPABASE_SERVICE_KEY');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

async function fixPhotoDetailsView() {
  console.log('🔧 Fixing photo_details view column conflict...');
  
  try {
    // Drop the problematic view if it exists
    const dropViewSQL = `DROP VIEW IF EXISTS public.photo_details;`;
    
    const { error: dropError } = await supabase.rpc('exec_sql', { 
      sql: dropViewSQL 
    });
    
    if (dropError) {
      console.log('View may not exist yet, continuing...');
    }
    
    // Create the corrected view
    const createViewSQL = `
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
          ep.download_count as stored_download_count,
          ep.created_at,
          ep.updated_at,
          COUNT(DISTINCT pm.id) as match_count,
          AVG(pm.confidence_score) as avg_match_confidence,
          COUNT(DISTINCT uf.id) as favorite_count,
          COUNT(DISTINCT pd.id) as actual_download_count
      FROM public.event_photos ep
      LEFT JOIN public.photo_matches pm ON ep.id = pm.photo_id
      LEFT JOIN public.user_favorites uf ON ep.id = uf.photo_id
      LEFT JOIN public.photo_downloads pd ON ep.id = pd.photo_id
      GROUP BY 
          ep.id, ep.event_id, ep.url, ep.title, ep.timestamp, ep.location, ep.people_count, 
          ep.tags, ep.camera, ep.photographer, ep.resolution, ep.file_size, ep.mime_type, 
          ep.is_featured, ep.is_public, ep.download_count, ep.created_at, ep.updated_at;
    `;
    
    const { error: createError } = await supabase.rpc('exec_sql', { 
      sql: createViewSQL 
    });
    
    if (createError) {
      console.error('❌ Error creating view:', createError);
      throw createError;
    }
    
    console.log('✅ Photo details view fixed successfully!');
    
    // Test the view
    const { data, error: testError } = await supabase
      .from('photo_details')
      .select('*')
      .limit(1);
      
    if (testError) {
      console.error('❌ Error testing view:', testError);
      throw testError;
    }
    
    console.log('✅ View test passed!');
    return true;
    
  } catch (error) {
    console.error('❌ Fix failed:', error);
    return false;
  }
}

// Alternative approach using direct SQL execution
async function fixUsingDirectSQL() {
  console.log('🔧 Attempting direct SQL fix...');
  
  const fixSQL = `
    -- Drop the existing view if it exists
    DROP VIEW IF EXISTS public.photo_details;
    
    -- Create the corrected view
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
        ep.download_count as stored_download_count,
        ep.created_at,
        ep.updated_at,
        COUNT(DISTINCT pm.id) as match_count,
        COALESCE(AVG(pm.confidence_score), 0) as avg_match_confidence,
        COUNT(DISTINCT uf.id) as favorite_count,
        COUNT(DISTINCT pd.id) as actual_download_count
    FROM public.event_photos ep
    LEFT JOIN public.photo_matches pm ON ep.id = pm.photo_id
    LEFT JOIN public.user_favorites uf ON ep.id = uf.photo_id
    LEFT JOIN public.photo_downloads pd ON ep.id = pd.photo_id
    GROUP BY 
        ep.id, ep.event_id, ep.url, ep.title, ep.timestamp, ep.location, ep.people_count, 
        ep.tags, ep.camera, ep.photographer, ep.resolution, ep.file_size, ep.mime_type, 
        ep.is_featured, ep.is_public, ep.download_count, ep.created_at, ep.updated_at;
  `;
  
  console.log('SQL to execute:');
  console.log(fixSQL);
  console.log('\nPlease run this SQL in your Supabase SQL editor or via CLI');
  
  return true;
}

async function main() {
  try {
    console.log('🚀 Starting migration fix...');
    
    // Try the RPC approach first
    const rpcSuccess = await fixPhotoDetailsView();
    
    if (!rpcSuccess) {
      console.log('📝 RPC approach failed, providing direct SQL solution...');
      await fixUsingDirectSQL();
    }
    
    console.log('\n✅ Migration fix complete!');
    console.log('You can now run: npm run migrate:complete');
    
  } catch (error) {
    console.error('❌ Fix script failed:', error);
    console.log('\n🔧 Manual fix required:');
    console.log('1. Go to your Supabase SQL editor');
    console.log('2. Run: DROP VIEW IF EXISTS public.photo_details;');
    console.log('3. Then apply the corrected migration');
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

export { fixPhotoDetailsView };