#!/bin/bash

# Test script to verify routes are working
echo "Testing PhotoLens routes..."

# Build the project
echo "Building project..."
npm run build

if [ $? -eq 0 ]; then
    echo "✅ Build successful"
    
    # Start preview server
    echo "Starting preview server..."
    npm run preview &
    SERVER_PID=$!
    
    # Wait for server to start
    sleep 3
    
    # Test routes
    echo "Testing routes..."
    
    # Test main routes
    curl -s -o /dev/null -w "%{http_code}" http://localhost:4173/ | grep -q "200" && echo "✅ Root route: 200" || echo "❌ Root route failed"
    
    # Test event routes
    curl -s -o /dev/null -w "%{http_code}" http://localhost:4173/event/test123/register | grep -q "200" && echo "✅ Event register route: 200" || echo "❌ Event register route failed"
    
    curl -s -o /dev/null -w "%{http_code}" http://localhost:4173/event/test123/waiting | grep -q "200" && echo "✅ Event waiting route: 200" || echo "❌ Event waiting route failed"
    
    curl -s -o /dev/null -w "%{http_code}" http://localhost:4173/event/test123/results | grep -q "200" && echo "✅ Event results route: 200" || echo "❌ Event results route failed"
    
    curl -s -o /dev/null -w "%{http_code}" http://localhost:4173/admin/dashboard | grep -q "200" && echo "✅ Admin dashboard route: 200" || echo "❌ Admin dashboard route failed"
    
    # Kill server
    kill $SERVER_PID
    
    echo "Route testing completed!"
else
    echo "❌ Build failed"
    exit 1
fi