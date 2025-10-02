#!/bin/bash

# Script to apply website_stats migration to Supabase
# Run this script from the project root directory

echo "🚀 Applying website_stats migration to Supabase..."
echo ""

# Check if supabase CLI is installed
if ! command -v supabase &> /dev/null
then
    echo "❌ Supabase CLI is not installed."
    echo "📦 Install it with: npm install -g supabase"
    echo "   Or visit: https://supabase.com/docs/guides/cli"
    exit 1
fi

echo "✅ Supabase CLI found"
echo ""

# Check if we're linked to a project
if [ ! -f ".supabase/config.toml" ]; then
    echo "⚠️  Not linked to a Supabase project"
    echo "🔗 Link to your project with: supabase link --project-ref YOUR_PROJECT_REF"
    echo "   Or run: supabase init (if starting fresh)"
    exit 1
fi

echo "📊 Found Supabase configuration"
echo ""

# Apply the migration
echo "⏳ Applying migration: 008_create_website_stats_table.sql"
supabase db push

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Migration applied successfully!"
    echo ""
    echo "📝 Next steps:"
    echo "   1. Test the landing page to see dynamic statistics"
    echo "   2. Update stats manually with: SELECT update_website_stats();"
    echo "   3. Set up a cron job for automatic updates"
    echo ""
    echo "📖 See WEBSITE_STATS_INTEGRATION.md for more details"
else
    echo ""
    echo "❌ Migration failed. Check the error message above."
    echo ""
    echo "💡 Troubleshooting:"
    echo "   - Make sure you're linked to the correct project"
    echo "   - Check your Supabase credentials"
    echo "   - Verify the migration file exists in supabase/migrations/"
    exit 1
fi
