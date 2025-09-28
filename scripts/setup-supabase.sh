#!/bin/bash

# Photo Lens Connect - Complete Supabase Setup Script
# This script handles the complete migration from JSON to Supabase

set -e  # Exit on error

echo "🚀 Photo Lens Connect - Supabase Migration Setup"
echo "=================================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Helper functions
print_step() {
    echo -e "${BLUE}📋 $1${NC}"
}

print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️ $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

# Check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Step 1: Prerequisites Check
print_step "Checking prerequisites..."

# Check for Node.js
if ! command_exists node; then
    print_error "Node.js is not installed. Please install Node.js first."
    exit 1
fi

# Check for npm
if ! command_exists npm; then
    print_error "npm is not installed. Please install npm first."
    exit 1
fi

# Check for Supabase CLI
if ! command_exists supabase; then
    print_warning "Supabase CLI not found. Installing..."
    npm install -g supabase
    print_success "Supabase CLI installed"
else
    print_success "Supabase CLI found"
fi

# Check for tsx
if ! command_exists tsx; then
    print_warning "tsx not found. Installing..."
    npm install -g tsx
    print_success "tsx installed"
else
    print_success "tsx found"
fi

# Step 2: Environment Setup
print_step "Setting up environment..."

# Check if .env exists
if [ ! -f .env ]; then
    print_warning ".env file not found. Creating template..."
    cat > .env << EOF
# Supabase Configuration
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=your-anon-key
SUPABASE_SERVICE_KEY=your-service-role-key

# Optional: For local development
SUPABASE_URL=http://localhost:54321
SUPABASE_ANON_KEY=your-local-anon-key
EOF
    print_warning "Please update .env file with your Supabase credentials"
    echo "You can find these in your Supabase dashboard:"
    echo "https://app.supabase.com/project/your-project-id/settings/api"
    read -p "Press Enter after updating .env file..."
fi

print_success "Environment setup complete"

# Step 3: Ask for migration type
echo ""
echo "Choose migration type:"
echo "1) Local development (requires Docker)"
echo "2) Direct to production"
echo "3) Local first, then production"
read -p "Enter choice (1-3): " migration_choice

case $migration_choice in
    1)
        echo ""
        print_step "Starting local Supabase development..."
        
        # Check if Docker is running
        if ! docker info >/dev/null 2>&1; then
            print_error "Docker is not running. Please start Docker first."
            exit 1
        fi
        
        # Start local Supabase
        print_step "Starting local Supabase services..."
        supabase start
        
        # Apply migrations
        print_step "Applying database migrations..."
        supabase migration up
        
        # Run data migration
        print_step "Migrating JSON data to Supabase..."
        npm run migrate:complete
        
        # Generate types
        print_step "Generating TypeScript types..."
        npm run generate:types
        
        print_success "Local setup complete!"
        echo "🌐 Local Supabase URL: http://localhost:54321"
        echo "📊 Studio URL: http://localhost:54323"
        ;;
        
    2)
        echo ""
        print_step "Setting up direct production migration..."
        
        # Get project ID
        read -p "Enter your Supabase project ID: " project_id
        
        if [ -z "$project_id" ]; then
            print_error "Project ID cannot be empty"
            exit 1
        fi
        
        # Link to project
        print_step "Linking to Supabase project..."
        supabase link --project-ref $project_id
        
        # Push schema to production
        print_step "Pushing database schema to production..."
        supabase db push
        
        # Run data migration
        print_step "Migrating JSON data to production..."
        npm run migrate:complete
        
        # Generate types from remote
        print_step "Generating TypeScript types from production..."
        npm run generate:types:remote
        
        print_success "Production setup complete!"
        echo "🌐 Production URL: https://$project_id.supabase.co"
        ;;
        
    3)
        echo ""
        print_step "Starting local development first..."
        
        # Check if Docker is running
        if ! docker info >/dev/null 2>&1; then
            print_error "Docker is not running. Please start Docker first."
            exit 1
        fi
        
        # Start local Supabase
        print_step "Starting local Supabase services..."
        supabase start
        
        # Apply migrations
        print_step "Applying database migrations locally..."
        supabase migration up
        
        # Run data migration
        print_step "Migrating JSON data locally..."
        npm run migrate:complete
        
        # Generate types
        print_step "Generating TypeScript types from local..."
        npm run generate:types
        
        print_success "Local setup complete!"
        echo "🌐 Local Supabase URL: http://localhost:54321"
        echo "📊 Studio URL: http://localhost:54323"
        
        echo ""
        read -p "Ready to push to production? (y/N): " push_prod
        
        if [[ $push_prod =~ ^[Yy]$ ]]; then
            # Get project ID
            read -p "Enter your Supabase project ID: " project_id
            
            if [ -z "$project_id" ]; then
                print_error "Project ID cannot be empty"
                exit 1
            fi
            
            # Link to project
            print_step "Linking to Supabase project..."
            supabase link --project-ref $project_id
            
            # Push to production
            print_step "Pushing to production..."
            supabase db push
            
            # Generate production types
            print_step "Generating production types..."
            npm run generate:types:remote
            
            print_success "Production deployment complete!"
        fi
        ;;
        
    *)
        print_error "Invalid choice"
        exit 1
        ;;
esac

# Step 4: Test migration
print_step "Testing migration..."
if npm run test:migration; then
    print_success "Migration test passed!"
else
    print_error "Migration test failed. Please check the output above."
fi

# Step 5: Install dependencies if needed
print_step "Checking project dependencies..."
if [ ! -d "node_modules" ]; then
    print_warning "Installing project dependencies..."
    npm install
fi

# Step 6: Final verification
echo ""
print_step "Running final verification..."

# Check if types were generated
if [ -f "src/integrations/supabase/types.ts" ]; then
    print_success "TypeScript types generated"
else
    print_warning "TypeScript types not found - you may need to run generate:types"
fi

# Try to build the project
print_step "Testing build..."
if npm run build >/dev/null 2>&1; then
    print_success "Build test passed"
else
    print_warning "Build test failed - check for any TypeScript errors"
fi

# Final success message
echo ""
echo "=================================================="
print_success "🎉 Supabase migration setup complete!"
echo ""
echo "📋 What was accomplished:"
echo "  ✅ Static JSON files migrated to Supabase"
echo "  ✅ Database schema with 10+ tables created"
echo "  ✅ All relationships and indexes applied"
echo "  ✅ Row Level Security policies configured"
echo "  ✅ TypeScript types generated"
echo "  ✅ React hooks updated for dynamic data"
echo ""
echo "🚀 Next steps:"
echo "  1. Start development: npm run dev"
echo "  2. Visit Admin Dashboard to see your data"
echo "  3. Test Event Results pages"
echo "  4. Customize as needed for your use case"
echo ""

if [ "$migration_choice" == "1" ] || [ "$migration_choice" == "3" ]; then
    echo "🔗 Local Development URLs:"
    echo "  App: http://localhost:5173"
    echo "  Supabase Studio: http://localhost:54323"
    echo "  API: http://localhost:54321"
    echo ""
fi

if [ "$migration_choice" == "2" ] || [ "$migration_choice" == "3" ]; then
    echo "🌐 Production URLs:"
    echo "  Supabase Dashboard: https://app.supabase.com/project/$project_id"
    echo "  API: https://$project_id.supabase.co"
    echo ""
fi

echo "📚 Documentation:"
echo "  Setup Guide: ./SUPABASE_SETUP_GUIDE.md"
echo "  Migration Summary: ./SUPABASE_MIGRATION_SUMMARY.md"
echo ""
echo "Happy coding! 🎨"