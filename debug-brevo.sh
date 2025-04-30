#!/bin/bash

# Debug script for testing Brevo API integration

# Set to exit on error
set -e

echo "==== Testing Brevo API Integration ===="
echo "This script will help diagnose issues with the Brevo API"
echo ""

# Check if Brevo API key is set
if [ -z "$BREVO_API_KEY" ]; then
  echo "⚠️ BREVO_API_KEY environment variable is not set"
  echo "Please run: export BREVO_API_KEY='your-api-key'"
  echo ""
fi

# Test Brevo endpoint with detailed output
echo "🔄 Making request to /api/test-brevo..."
response=$(curl -s -X POST http://localhost:3000/api/test-brevo \
  -H "Content-Type: application/json" \
  -d '{}')

echo "📝 Response:"
echo $response | jq '.'

echo ""
echo "==== Testing Brevo Contact Creation Directly ===="

# Test a direct contact creation
echo "🔄 Making request to /api/leads with minimal data..."
response=$(curl -s -X POST http://localhost:3000/api/leads \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "API Test",
    "email": "test-'"$(date +%s)"'@example.com",
    "phone": "+11234567890",
    "question": "Testing Brevo contact creation directly"
  }')

echo "📝 Response:"
echo $response | jq '.'

echo ""
echo "==== Debug complete ====" 