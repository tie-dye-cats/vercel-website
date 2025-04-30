#!/bin/bash

# API Testing Script for Vercel Website
# Tests both Brevo and ClickUp API integrations

# ANSI color codes
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Check if jq is installed
if ! command -v jq &> /dev/null; then
    echo -e "${RED}Error: jq is required but not installed.${NC}"
    echo "Please install jq with: brew install jq"
    exit 1
fi

# Function to wait for server
wait_for_server() {
    echo -e "${BLUE}Waiting for server to be ready...${NC}"
    local max_attempts=20
    local attempt=1
    local ready=false

    while [ $attempt -le $max_attempts ] && [ "$ready" = false ]; do
        if curl -s http://localhost:3000/api/health > /dev/null 2>&1; then
            ready=true
            echo -e "${GREEN}Server is ready!${NC}"
        else
            echo -e "${YELLOW}Attempt $attempt/$max_attempts: Server not ready yet. Waiting...${NC}"
            sleep 1
            attempt=$((attempt + 1))
        fi
    done

    if [ "$ready" = false ]; then
        echo -e "${RED}Server did not become ready after $max_attempts attempts.${NC}"
        echo "Make sure the server is running with: npm run dev"
        return 1
    fi

    # Additional delay to ensure all connections are established
    echo -e "${BLUE}Giving the server a moment to fully initialize...${NC}"
    sleep 2
    return 0
}

# Check if server is running
check_server() {
    if ! curl -s http://localhost:3000 > /dev/null 2>&1; then
        echo -e "${YELLOW}Server doesn't appear to be running.${NC}"
        echo "Would you like to start it now? (y/n)"
        read -r response
        if [[ "$response" =~ ^([yY][eE][sS]|[yY])$ ]]; then
            echo -e "${BLUE}Starting server...${NC}"
            npm run dev &
            server_pid=$!
            wait_for_server
            return $?
        else
            echo -e "${RED}Cannot proceed without a running server.${NC}"
            return 1
        fi
    else
        wait_for_server
        return $?
    fi
}

# Test Brevo API
test_brevo() {
    echo -e "\n${BLUE}==== Testing Brevo API Integration ====${NC}"
    
    # Check for API key
    if [ -z "$BREVO_API_KEY" ]; then
        echo -e "${YELLOW}⚠️ BREVO_API_KEY environment variable is not set${NC}"
        echo "This may cause authentication failures"
    fi
    
    echo -e "${BLUE}Sending test request to /api/test-brevo...${NC}"
    response=$(curl -s -X POST http://localhost:3000/api/test-brevo \
      -H "Content-Type: application/json" \
      -d '{}')
    
    # Check success
    if echo "$response" | jq -e '.success == true' > /dev/null; then
        echo -e "${GREEN}✅ Brevo test successful!${NC}"
        echo -e "${BLUE}Response:${NC}"
        echo "$response" | jq '.'
        return 0
    else
        echo -e "${RED}❌ Brevo test failed!${NC}"
        echo -e "${BLUE}Response:${NC}"
        echo "$response" | jq '.'
        return 1
    fi
}

# Test ClickUp API
test_clickup() {
    echo -e "\n${BLUE}==== Testing ClickUp API Integration ====${NC}"
    
    echo -e "${BLUE}Sending test request to /api/test-clickup...${NC}"
    response=$(curl -s -X POST http://localhost:3000/api/test-clickup \
      -H "Content-Type: application/json" \
      -d '{
        "firstName": "Test User",
        "email": "test@example.com",
        "phone": "1234567890",
        "question": "Testing ClickUp integration"
      }')
    
    # Check success
    if echo "$response" | jq -e '.success == true' > /dev/null; then
        echo -e "${GREEN}✅ ClickUp test successful!${NC}"
        task_id=$(echo "$response" | jq -r '.task.id // "No ID"')
        echo -e "${GREEN}Task ID: ${task_id}${NC}"
        echo -e "${BLUE}Response:${NC}"
        echo "$response" | jq '.'
        return 0
    else
        echo -e "${RED}❌ ClickUp test failed!${NC}"
        echo -e "${BLUE}Response:${NC}"
        echo "$response" | jq '.'
        return 1
    fi
}

# Test form submission
test_form_submission() {
    echo -e "\n${BLUE}==== Testing Complete Form Submission ====${NC}"
    
    # Generate a unique email
    timestamp=$(date +%s)
    test_email="test-${timestamp}@example.com"
    
    echo -e "${BLUE}Submitting form data to /api/leads...${NC}"
    response=$(curl -s -X POST http://localhost:3000/api/leads \
      -H "Content-Type: application/json" \
      -d '{
        "firstName": "API Test",
        "email": "'$test_email'",
        "phone": "+11234567890",
        "company": "Test Company",
        "question": "This is a test submission via curl",
        "marketingConsent": true,
        "communicationConsent": true
      }')
    
    # Check success
    if echo "$response" | jq -e '.success == true' > /dev/null; then
        echo -e "${GREEN}✅ Form submission successful!${NC}"
        task_id=$(echo "$response" | jq -r '.task.id // "No ID"')
        echo -e "${GREEN}Task ID: ${task_id}${NC}"
        echo -e "${BLUE}Response:${NC}"
        echo "$response" | jq '.'
        return 0
    else
        echo -e "${RED}❌ Form submission failed!${NC}"
        echo -e "${BLUE}Response:${NC}"
        echo "$response" | jq '.'
        return 1
    fi
}

# Main function
main() {
    echo -e "${BLUE}🔍 API Testing for Vercel Website${NC}"
    
    # Check if server is running
    if ! check_server; then
        exit 1
    fi
    
    # Run the tests
    brevo_success=false
    clickup_success=false
    form_success=false
    
    if test_brevo; then
        brevo_success=true
    fi
    
    if test_clickup; then
        clickup_success=true
    fi
    
    if test_form_submission; then
        form_success=true
    fi
    
    # Summary
    echo -e "\n${BLUE}==== Test Summary ====${NC}"
    if [ "$brevo_success" = true ]; then
        echo -e "${GREEN}✅ Brevo API: Working${NC}"
    else
        echo -e "${RED}❌ Brevo API: Failed${NC}"
    fi
    
    if [ "$clickup_success" = true ]; then
        echo -e "${GREEN}✅ ClickUp API: Working${NC}"
    else
        echo -e "${RED}❌ ClickUp API: Failed${NC}"
    fi
    
    if [ "$form_success" = true ]; then
        echo -e "${GREEN}✅ Form Submission: Working${NC}"
    else
        echo -e "${RED}❌ Form Submission: Failed${NC}"
    fi
    
    if [ "$brevo_success" = true ] && [ "$clickup_success" = true ] && [ "$form_success" = true ]; then
        echo -e "\n${GREEN}🎉 All tests passed successfully!${NC}"
        return 0
    else
        echo -e "\n${RED}⚠️ Some tests failed. Please check the logs above.${NC}"
        return 1
    fi
}

# Run the main function
main 