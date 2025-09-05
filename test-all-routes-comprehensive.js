#!/usr/bin/env node

const https = require('https');

const BASE_URL = 'https://student-search-glxio0q0b-maaly-el-mansys-projects.vercel.app';

// Comprehensive list of all possible routes
const routes = [
  // Main routes
  { path: '/', description: 'Home page', method: 'GET' },
  { path: '/index.html', description: 'Direct index access', method: 'GET' },
  { path: '/standalone.html', description: 'Standalone page', method: 'GET' },
  
  // Student routes
  { path: '/student-login', description: 'Student login page', method: 'GET' },
  { path: '/student-results', description: 'Student results page', method: 'GET' },
  { path: '/working-student-login', description: 'Working student login', method: 'GET' },
  { path: '/secure-student-login', description: 'Secure student login', method: 'GET' },
  
  // Parent routes
  { path: '/parent-login', description: 'Parent login page', method: 'GET' },
  { path: '/parent-dashboard', description: 'Parent dashboard', method: 'GET' },
  
  // Teacher routes
  { path: '/teacher-login', description: 'Teacher login page', method: 'GET' },
  { path: '/teacher-dashboard', description: 'Teacher dashboard', method: 'GET' },
  
  // Assistant routes
  { path: '/assistant-login', description: 'Assistant login page', method: 'GET' },
  { path: '/assistant-data-entry', description: 'Assistant data entry', method: 'GET' },
  
  // Admin routes
  { path: '/admin-login', description: 'Admin login page', method: 'GET' },
  { path: '/admin-dashboard', description: 'Admin dashboard', method: 'GET' },
  
  // Subject and quiz routes
  { path: '/subject-selection', description: 'Subject selection', method: 'GET' },
  { path: '/subject-results', description: 'Subject results', method: 'GET' },
  { path: '/test-subject-selection', description: 'Test subject selection', method: 'GET' },
  { path: '/quiz-interface', description: 'Quiz interface', method: 'GET' },
  { path: '/student-quiz-selection', description: 'Student quiz selection', method: 'GET' },
  { path: '/student-quiz', description: 'Student quiz', method: 'GET' },
  { path: '/test-quiz', description: 'Test quiz', method: 'GET' },
  
  // Financial routes
  { path: '/financial-dashboard', description: 'Financial dashboard', method: 'GET' },
  
  // Registration routes
  { path: '/registration.html', description: 'Registration page direct', method: 'GET' },
  { path: '/enhanced-registration', description: 'Enhanced registration', method: 'GET' },
  { path: '/register', description: 'Register route', method: 'GET' },
  
  // Demo and test routes
  { path: '/demo', description: 'Demo page', method: 'GET' },
  { path: '/test.html', description: 'Test page', method: 'GET' },
  { path: '/startup.html', description: 'Startup page', method: 'GET' },
  
  // Static files
  { path: '/style.css', description: 'Main stylesheet', method: 'GET' },
  { path: '/script.js', description: 'Main script', method: 'GET' },
  { path: '/favicon.ico', description: 'Favicon', method: 'GET' },
  
  // API routes
  { path: '/api/search', description: 'Search API (GET)', method: 'GET' },
  { path: '/api/search', description: 'Search API (POST)', method: 'POST', data: '{"code":"G4001"}' },
  { path: '/api/health', description: 'Health check API', method: 'GET' },
  { path: '/api/student-login', description: 'Student login API', method: 'POST', data: '{"code":"G4001","password":"1234567890"}' },
  
  // Sitemap and utilities
  { path: '/site-map', description: 'Site map', method: 'GET' },
  { path: '/sitemap.xml', description: 'XML Sitemap', method: 'GET' },
  
  // Additional test routes
  { path: '/test-all-routes.html', description: 'Route testing page', method: 'GET' },
  { path: '/site-map-generator.html', description: 'Site map generator', method: 'GET' }
];

function testRoute(route) {
  return new Promise((resolve) => {
    const url = `${BASE_URL}${route.path}`;
    const options = {
      method: route.method,
      timeout: 10000,
      headers: {
        'User-Agent': 'Route-Test-Bot/1.0',
        'Accept': 'text/html,application/json,*/*'
      }
    };

    if (route.method === 'POST') {
      options.headers['Content-Type'] = 'application/json';
    }

    const startTime = Date.now();
    
    const req = https.request(url, options, (res) => {
      const responseTime = Date.now() - startTime;
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        const result = {
          path: route.path,
          method: route.method,
          description: route.description,
          status: res.statusCode,
          responseTime: responseTime,
          contentLength: data.length,
          contentType: res.headers['content-type'],
          success: res.statusCode >= 200 && res.statusCode < 400,
          error: null
        };
        
        resolve(result);
      });
    });
    
    req.on('error', (err) => {
      const responseTime = Date.now() - startTime;
      resolve({
        path: route.path,
        method: route.method,
        description: route.description,
        status: 'ERROR',
        responseTime: responseTime,
        contentLength: 0,
        contentType: null,
        success: false,
        error: err.message
      });
    });
    
    req.on('timeout', () => {
      req.destroy();
      resolve({
        path: route.path,
        method: route.method,
        description: route.description,
        status: 'TIMEOUT',
        responseTime: 10000,
        contentLength: 0,
        contentType: null,
        success: false,
        error: 'Request timeout'
      });
    });
    
    if (route.data) {
      req.write(route.data);
    }
    
    req.end();
  });
}

async function runAllTests() {
  console.log(`🧪 COMPREHENSIVE ROUTE TESTING`);
  console.log(`📡 Testing ${routes.length} routes on: ${BASE_URL}`);
  console.log(`⏰ Started at: ${new Date().toISOString()}`);
  console.log('='.repeat(80));
  
  const results = [];
  const batchSize = 5; // Test 5 routes at a time to avoid overwhelming
  
  for (let i = 0; i < routes.length; i += batchSize) {
    const batch = routes.slice(i, i + batchSize);
    console.log(`\n🔄 Testing batch ${Math.floor(i/batchSize) + 1}/${Math.ceil(routes.length/batchSize)} (${batch.length} routes)`);
    
    const batchPromises = batch.map(route => testRoute(route));
    const batchResults = await Promise.all(batchPromises);
    
    batchResults.forEach(result => {
      const statusIcon = result.success ? '✅' : '❌';
      const statusColor = result.success ? '\x1b[32m' : '\x1b[31m';
      const resetColor = '\x1b[0m';
      
      console.log(`${statusIcon} ${statusColor}${result.status}${resetColor} | ${result.method.padEnd(4)} | ${result.path.padEnd(30)} | ${result.responseTime}ms | ${result.description}`);
      
      results.push(result);
    });
    
    // Small delay between batches
    if (i + batchSize < routes.length) {
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }
  
  // Generate summary report
  console.log('\n' + '=' * 80);
  console.log('📊 COMPREHENSIVE TEST SUMMARY');
  console.log('=' * 80);
  
  const successful = results.filter(r => r.success);
  const failed = results.filter(r => !r.success);
  const avgResponseTime = results.reduce((sum, r) => sum + r.responseTime, 0) / results.length;
  
  console.log(`\n📈 OVERALL STATISTICS:`);
  console.log(`   Total Routes Tested: ${results.length}`);
  console.log(`   ✅ Successful: ${successful.length} (${Math.round(successful.length/results.length*100)}%)`);
  console.log(`   ❌ Failed: ${failed.length} (${Math.round(failed.length/results.length*100)}%)`);
  console.log(`   ⏱️  Average Response Time: ${Math.round(avgResponseTime)}ms`);
  
  if (failed.length > 0) {
    console.log(`\n❌ FAILED ROUTES (${failed.length}):`);
    failed.forEach(result => {
      console.log(`   • ${result.method} ${result.path} - ${result.status} - ${result.error || 'HTTP Error'}`);
    });
  }
  
  // Group successful routes by status code
  const statusGroups = {};
  successful.forEach(result => {
    if (!statusGroups[result.status]) {
      statusGroups[result.status] = [];
    }
    statusGroups[result.status].push(result);
  });
  
  console.log(`\n✅ SUCCESSFUL ROUTES BY STATUS:`);
  Object.keys(statusGroups).sort().forEach(status => {
    console.log(`   ${status}: ${statusGroups[status].length} routes`);
  });
  
  // Performance analysis
  const slowRoutes = results.filter(r => r.responseTime > 1000);
  if (slowRoutes.length > 0) {
    console.log(`\n⚠️  SLOW ROUTES (>1s):`);
    slowRoutes.forEach(result => {
      console.log(`   • ${result.method} ${result.path} - ${result.responseTime}ms`);
    });
  }
  
  // Content type analysis
  const contentTypes = {};
  results.forEach(result => {
    if (result.contentType) {
      const baseType = result.contentType.split(';')[0];
      contentTypes[baseType] = (contentTypes[baseType] || 0) + 1;
    }
  });
  
  console.log(`\n📄 CONTENT TYPES:`);
  Object.entries(contentTypes).forEach(([type, count]) => {
    console.log(`   ${type}: ${count} routes`);
  });
  
  console.log(`\n⏰ Test completed at: ${new Date().toISOString()}`);
  
  // Save detailed results to file
  const detailedReport = {
    timestamp: new Date().toISOString(),
    baseUrl: BASE_URL,
    totalRoutes: results.length,
    successfulRoutes: successful.length,
    failedRoutes: failed.length,
    successRate: Math.round(successful.length/results.length*100),
    averageResponseTime: Math.round(avgResponseTime),
    results: results,
    failedRouteDetails: failed,
    slowRoutes: slowRoutes,
    contentTypes: contentTypes
  };
  
  require('fs').writeFileSync('comprehensive-route-test-report.json', JSON.stringify(detailedReport, null, 2));
  console.log(`\n💾 Detailed report saved to: comprehensive-route-test-report.json`);
  
  return detailedReport;
}

// Run the tests
runAllTests().then(report => {
  process.exit(report.failedRoutes > 0 ? 1 : 0);
}).catch(error => {
  console.error('❌ Test runner failed:', error);
  process.exit(1);
});
