#!/usr/bin/env node

const { runAPITests } = require('./api.test');

async function main() {
  console.log('🚀 Starting Gamified Machine Booking Test Suite\n');
  
  try {
    await runAPITests();
  } catch (error) {
    console.error('❌ Test runner failed:', error.message);
    process.exit(1);
  }
}

// Run the test suite
main(); 