#!/usr/bin/env node

const { runAPITests } = require('./api.test');

async function main() {
  console.log('🚀 Starting Gamified Machine Booking Test Suite\n');
  
  try {
    await runAPITests();
    
    console.log('\n' + '='.repeat(50));
    console.log('CALENDAR FUNCTIONALITY TEST');
    console.log('='.repeat(50));
    
    // Import and run calendar test
    const { testCalendarData } = require('./calendar-test');
    await testCalendarData();
    
  } catch (error) {
    console.error('❌ Test runner failed:', error.message);
    process.exit(1);
  }
}

// Run the test suite
main(); 