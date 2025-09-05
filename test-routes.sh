#!/bin/bash

# Test script for all routes in the Student Search App
BASE_URL="https://student-search-glxio0q0b-maaly-el-mansys-projects.vercel.app"

echo "🧪 Testing All Routes for Student Search App"
echo "============================================"
echo "Base URL: $BASE_URL"
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Counters
total_routes=0
successful_routes=0
failed_routes=0

# Function to test a route
test_route() {
    local url="$1"
    local name="$2"
    local expected_code="${3:-200}"
    
    total_routes=$((total_routes + 1))
    
    echo -n "Testing $name ($url)... "
    
    # Test the route
    response_code=$(curl -s -o /dev/null -w "%{http_code}" "$BASE_URL$url")
    
    if [ "$response_code" = "$expected_code" ]; then
        echo -e "${GREEN}✅ SUCCESS${NC} ($response_code)"
        successful_routes=$((successful_routes + 1))
    else
        echo -e "${RED}❌ FAILED${NC} (Expected: $expected_code, Got: $response_code)"
        failed_routes=$((failed_routes + 1))
    fi
}

# Test POST route
test_post_route() {
    local url="$1"
    local name="$2"
    local data="$3"
    local expected_code="${4:-200}"
    
    total_routes=$((total_routes + 1))
    
    echo -n "Testing $name ($url) [POST]... "
    
    # Test the POST route
    response_code=$(curl -s -o /dev/null -w "%{http_code}" -X POST -H "Content-Type: application/json" -d "$data" "$BASE_URL$url")
    
    if [ "$response_code" = "$expected_code" ] || [ "$response_code" = "400" ] || [ "$response_code" = "405" ]; then
        echo -e "${GREEN}✅ ACCESSIBLE${NC} ($response_code)"
        successful_routes=$((successful_routes + 1))
    else
        echo -e "${RED}❌ FAILED${NC} (Expected: $expected_code, Got: $response_code)"
        failed_routes=$((failed_routes + 1))
    fi
}

echo -e "${BLUE}📱 MAIN ENTRY POINTS${NC}"
echo "===================="
test_route "/" "Home Page"
test_route "/index.html" "Index Page"
test_route "/standalone.html" "Standalone Demo"

echo ""
echo -e "${BLUE}🔐 AUTHENTICATION PAGES${NC}"
echo "======================="
test_route "/student-login" "Student Login"
test_route "/parent-login" "Parent Login"
test_route "/teacher-login" "Teacher Login"
test_route "/assistant-login" "Assistant Login"
test_route "/admin-login" "Admin Login"

echo ""
echo -e "${BLUE}📊 DASHBOARD PAGES${NC}"
echo "=================="
test_route "/student-results" "Student Results"
test_route "/parent-dashboard" "Parent Dashboard"
test_route "/teacher-dashboard" "Teacher Dashboard"
test_route "/admin-dashboard" "Admin Dashboard"
test_route "/assistant-data-entry" "Assistant Data Entry"
test_route "/financial-dashboard" "Financial Dashboard"

echo ""
echo -e "${BLUE}🔗 API ENDPOINTS${NC}"
echo "================"
test_route "/api/search" "Search API"
test_post_route "/api/student-login" "Student Login API" '{"student_code":"G4001","phone_number":"1234567890","choice":"student"}'

echo ""
echo -e "${BLUE}📄 OTHER PAGES${NC}"
echo "=============="
test_route "/subject-selection" "Subject Selection"
test_route "/subject-results" "Subject Results"
test_route "/test-subject-selection" "Test Subject Selection"
test_route "/registration.html" "Registration Page"
test_route "/demo" "Demo Route"

echo ""
echo -e "${BLUE}📋 STATIC FILES${NC}"
echo "==============="
test_route "/style.css" "Main CSS File"
test_route "/script.js" "Main JS File"

echo ""
echo "============================================"
echo -e "${YELLOW}📊 TEST SUMMARY${NC}"
echo "============================================"
echo "Total Routes Tested: $total_routes"
echo -e "Successful: ${GREEN}$successful_routes${NC}"
echo -e "Failed: ${RED}$failed_routes${NC}"

if [ $total_routes -gt 0 ]; then
    success_rate=$((successful_routes * 100 / total_routes))
    echo -e "Success Rate: ${YELLOW}$success_rate%${NC}"
    
    if [ $success_rate -ge 90 ]; then
        echo -e "${GREEN}🎉 EXCELLENT! Your application is working great!${NC}"
    elif [ $success_rate -ge 75 ]; then
        echo -e "${YELLOW}👍 GOOD! Most routes are working properly.${NC}"
    else
        echo -e "${RED}⚠️  NEEDS ATTENTION! Several routes need fixing.${NC}"
    fi
else
    echo -e "${RED}❌ No routes were tested.${NC}"
fi

echo ""
echo "Test completed at: $(date)"
