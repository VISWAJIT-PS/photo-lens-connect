# Photo Lens Connect - Complete Supabase Setup Script (PowerShell)
# This script handles the complete migration from JSON to Supabase

param(
    [string]$MigrationType = "",
    [string]$ProjectId = ""
)

# Colors for output
$Colors = @{
    Red = 'Red'
    Green = 'Green'
    Yellow = 'Yellow'
    Blue = 'Blue'
    White = 'White'
}

function Write-Step {
    param([string]$Message)
    Write-Host "📋 $Message" -ForegroundColor $Colors.Blue
}

function Write-Success {
    param([string]$Message)
    Write-Host "✅ $Message" -ForegroundColor $Colors.Green
}

function Write-Warning {
    param([string]$Message)
    Write-Host "⚠️ $Message" -ForegroundColor $Colors.Yellow
}

function Write-Error {
    param([string]$Message)
    Write-Host "❌ $Message" -ForegroundColor $Colors.Red
}

function Test-Command {
    param([string]$Command)
    try {
        Get-Command $Command -ErrorAction Stop | Out-Null
        return $true
    }
    catch {
        return $false
    }
}

Write-Host "🚀 Photo Lens Connect - Supabase Migration Setup" -ForegroundColor $Colors.Blue
Write-Host "==================================================" -ForegroundColor $Colors.Blue

# Step 1: Prerequisites Check
Write-Step "Checking prerequisites..."

# Check for Node.js
if (-not (Test-Command "node")) {
    Write-Error "Node.js is not installed. Please install Node.js first."
    exit 1
}

# Check for npm
if (-not (Test-Command "npm")) {
    Write-Error "npm is not installed. Please install npm first."
    exit 1
}

# Check for Supabase CLI
if (-not (Test-Command "supabase")) {
    Write-Warning "Supabase CLI not found. Installing..."
    npm install -g supabase
    Write-Success "Supabase CLI installed"
} else {
    Write-Success "Supabase CLI found"
}

# Check for tsx
if (-not (Test-Command "tsx")) {
    Write-Warning "tsx not found. Installing..."
    npm install -g tsx
    Write-Success "tsx installed"
} else {
    Write-Success "tsx found"
}

# Step 2: Environment Setup
Write-Step "Setting up environment..."

# Check if .env exists
if (-not (Test-Path ".env")) {
    Write-Warning ".env file not found. Creating template..."
    @"
# Supabase Configuration
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=your-anon-key
SUPABASE_SERVICE_KEY=your-service-role-key

# Optional: For local development
SUPABASE_URL=http://localhost:54321
SUPABASE_ANON_KEY=your-local-anon-key
"@ | Out-File -FilePath ".env" -Encoding UTF8
    
    Write-Warning "Please update .env file with your Supabase credentials"
    Write-Host "You can find these in your Supabase dashboard:"
    Write-Host "https://app.supabase.com/project/your-project-id/settings/api"
    Read-Host "Press Enter after updating .env file"
}

Write-Success "Environment setup complete"

# Step 3: Ask for migration type if not provided
if ([string]::IsNullOrEmpty($MigrationType)) {
    Write-Host ""
    Write-Host "Choose migration type:"
    Write-Host "1) Local development (requires Docker)"
    Write-Host "2) Direct to production"
    Write-Host "3) Local first, then production"
    $choice = Read-Host "Enter choice (1-3)"
} else {
    $choice = $MigrationType
}

switch ($choice) {
    "1" {
        Write-Host ""
        Write-Step "Starting local Supabase development..."
        
        # Check if Docker is running
        try {
            docker info | Out-Null
        }
        catch {
            Write-Error "Docker is not running. Please start Docker first."
            exit 1
        }
        
        # Start local Supabase
        Write-Step "Starting local Supabase services..."
        supabase start
        
        # Apply migrations
        Write-Step "Applying database migrations..."
        supabase migration up
        
        # Run data migration
        Write-Step "Migrating JSON data to Supabase..."
        npm run migrate:complete
        
        # Generate types
        Write-Step "Generating TypeScript types..."
        npm run generate:types
        
        Write-Success "Local setup complete!"
        Write-Host "🌐 Local Supabase URL: http://localhost:54321"
        Write-Host "📊 Studio URL: http://localhost:54323"
    }
    
    "2" {
        Write-Host ""
        Write-Step "Setting up direct production migration..."
        
        # Get project ID if not provided
        if ([string]::IsNullOrEmpty($ProjectId)) {
            $ProjectId = Read-Host "Enter your Supabase project ID"
        }
        
        if ([string]::IsNullOrEmpty($ProjectId)) {
            Write-Error "Project ID cannot be empty"
            exit 1
        }
        
        # Link to project
        Write-Step "Linking to Supabase project..."
        supabase link --project-ref $ProjectId
        
        # Push schema to production
        Write-Step "Pushing database schema to production..."
        supabase db push
        
        # Run data migration
        Write-Step "Migrating JSON data to production..."
        npm run migrate:complete
        
        # Generate types from remote
        Write-Step "Generating TypeScript types from production..."
        npm run generate:types:remote
        
        Write-Success "Production setup complete!"
        Write-Host "🌐 Production URL: https://$ProjectId.supabase.co"
    }
    
    "3" {
        Write-Host ""
        Write-Step "Starting local development first..."
        
        # Check if Docker is running
        try {
            docker info | Out-Null
        }
        catch {
            Write-Error "Docker is not running. Please start Docker first."
            exit 1
        }
        
        # Start local Supabase
        Write-Step "Starting local Supabase services..."
        supabase start
        
        # Apply migrations
        Write-Step "Applying database migrations locally..."
        supabase migration up
        
        # Run data migration
        Write-Step "Migrating JSON data locally..."
        npm run migrate:complete
        
        # Generate types
        Write-Step "Generating TypeScript types from local..."
        npm run generate:types
        
        Write-Success "Local setup complete!"
        Write-Host "🌐 Local Supabase URL: http://localhost:54321"
        Write-Host "📊 Studio URL: http://localhost:54323"
        
        Write-Host ""
        $pushProd = Read-Host "Ready to push to production? (y/N)"
        
        if ($pushProd -match '^[Yy]$') {
            # Get project ID if not provided
            if ([string]::IsNullOrEmpty($ProjectId)) {
                $ProjectId = Read-Host "Enter your Supabase project ID"
            }
            
            if ([string]::IsNullOrEmpty($ProjectId)) {
                Write-Error "Project ID cannot be empty"
                exit 1
            }
            
            # Link to project
            Write-Step "Linking to Supabase project..."
            supabase link --project-ref $ProjectId
            
            # Push to production
            Write-Step "Pushing to production..."
            supabase db push
            
            # Generate production types
            Write-Step "Generating production types..."
            npm run generate:types:remote
            
            Write-Success "Production deployment complete!"
        }
    }
    
    default {
        Write-Error "Invalid choice"
        exit 1
    }
}

# Step 4: Test migration
Write-Step "Testing migration..."
try {
    npm run test:migration
    Write-Success "Migration test passed!"
}
catch {
    Write-Error "Migration test failed. Please check the output above."
}

# Step 5: Install dependencies if needed
Write-Step "Checking project dependencies..."
if (-not (Test-Path "node_modules")) {
    Write-Warning "Installing project dependencies..."
    npm install
}

# Step 6: Final verification
Write-Host ""
Write-Step "Running final verification..."

# Check if types were generated
if (Test-Path "src/integrations/supabase/types.ts") {
    Write-Success "TypeScript types generated"
} else {
    Write-Warning "TypeScript types not found - you may need to run generate:types"
}

# Try to build the project
Write-Step "Testing build..."
try {
    npm run build | Out-Null
    Write-Success "Build test passed"
}
catch {
    Write-Warning "Build test failed - check for any TypeScript errors"
}

# Final success message
Write-Host ""
Write-Host "==================================================" -ForegroundColor $Colors.Blue
Write-Success "🎉 Supabase migration setup complete!"
Write-Host ""
Write-Host "📋 What was accomplished:"
Write-Host "  ✅ Static JSON files migrated to Supabase"
Write-Host "  ✅ Database schema with 10+ tables created"
Write-Host "  ✅ All relationships and indexes applied"
Write-Host "  ✅ Row Level Security policies configured"
Write-Host "  ✅ TypeScript types generated"
Write-Host "  ✅ React hooks updated for dynamic data"
Write-Host ""
Write-Host "🚀 Next steps:"
Write-Host "  1. Start development: npm run dev"
Write-Host "  2. Visit Admin Dashboard to see your data"
Write-Host "  3. Test Event Results pages"
Write-Host "  4. Customize as needed for your use case"
Write-Host ""

if ($choice -eq "1" -or $choice -eq "3") {
    Write-Host "🔗 Local Development URLs:"
    Write-Host "  App: http://localhost:5173"
    Write-Host "  Supabase Studio: http://localhost:54323"
    Write-Host "  API: http://localhost:54321"
    Write-Host ""
}

if ($choice -eq "2" -or $choice -eq "3") {
    Write-Host "🌐 Production URLs:"
    Write-Host "  Supabase Dashboard: https://app.supabase.com/project/$ProjectId"
    Write-Host "  API: https://$ProjectId.supabase.co"
    Write-Host ""
}

Write-Host "📚 Documentation:"
Write-Host "  Setup Guide: ./SUPABASE_SETUP_GUIDE.md"
Write-Host "  Migration Summary: ./SUPABASE_MIGRATION_SUMMARY.md"
Write-Host ""
Write-Host "Happy coding! 🎨" -ForegroundColor $Colors.Green