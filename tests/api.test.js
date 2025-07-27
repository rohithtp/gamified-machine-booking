const fetch = require('node-fetch');

const API_BASE = 'http://localhost:3001/api';

class APITester {
  constructor() {
    this.testResults = [];
    this.userId = 'test_user_' + Date.now();
  }

  async runTest(testName, testFunction) {
    try {
      console.log(`\n${testName}...`);
      const result = await testFunction();
      console.log(`✅ ${testName}: PASSED`);
      this.testResults.push({ name: testName, status: 'PASSED', result });
      return result;
    } catch (error) {
      console.log(`❌ ${testName}: FAILED - ${error.message}`);
      this.testResults.push({ name: testName, status: 'FAILED', error: error.message });
      throw error;
    }
  }

  async testHealthEndpoint() {
    const response = await fetch(`${API_BASE}/health`);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const data = await response.json();
    return data;
  }

  async testMachinesEndpoint() {
    const response = await fetch(`${API_BASE}/machines`);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const data = await response.json();
    return data;
  }

  async testGamificationEndpoint() {
    const response = await fetch(`${API_BASE}/gamification/${this.userId}`);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const data = await response.json();
    return data;
  }

  async testBookingCreation() {
    const bookingData = {
      machine: '3D Printer',
      date: '2024-01-15',
      userId: this.userId
    };

    const response = await fetch(`${API_BASE}/bookings`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(bookingData)
    });

    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const data = await response.json();
    return data;
  }

  async testAvatarUpdate() {
    const response = await fetch(`${API_BASE}/gamification/${this.userId}/avatar`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ avatar: 'avatar2.png' })
    });

    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const data = await response.json();
    return data;
  }

  async testGamificationUpdate() {
    const response = await fetch(`${API_BASE}/gamification/${this.userId}`);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const data = await response.json();
    return data;
  },

  async testBookingUpdate() {
    // First create a booking
    const booking = await this.testBookingCreation();
    
    const updateData = {
      machine: 'Laser Cutter',
      date: '2024-01-16',
      status: 'pending'
    };

    const response = await fetch(`${API_BASE}/bookings/${booking._id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updateData)
    });

    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const data = await response.json();
    return { ...data, bookingId: booking._id };
  },

  async testBookingDeletion() {
    // First create a booking
    const booking = await this.testBookingCreation();

    const response = await fetch(`${API_BASE}/bookings/${booking._id}`, {
      method: 'DELETE'
    });

    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const data = await response.json();
    return data;
  }

  printSummary() {
    console.log('\n' + '='.repeat(50));
    console.log('TEST SUMMARY');
    console.log('='.repeat(50));
    
    const passed = this.testResults.filter(r => r.status === 'PASSED').length;
    const failed = this.testResults.filter(r => r.status === 'FAILED').length;
    
    this.testResults.forEach(result => {
      const icon = result.status === 'PASSED' ? '✅' : '❌';
      console.log(`${icon} ${result.name}`);
    });
    
    console.log('\n' + '='.repeat(50));
    console.log(`TOTAL: ${passed} passed, ${failed} failed`);
    console.log('='.repeat(50));
    
    if (failed === 0) {
      console.log('\n🎉 All tests passed! The API is working correctly.');
      console.log('\nTo run the full application:');
      console.log('  npm run dev');
    } else {
      console.log('\n⚠️  Some tests failed. Please check the server status.');
      console.log('\nMake sure the server is running:');
      console.log('  npm run server');
    }
  }
}

async function runAPITests() {
  console.log('🧪 Testing Gamified Machine Booking API...');
  console.log('Server URL:', API_BASE);
  console.log('Test User ID:', 'test_user_' + Date.now());

  const tester = new APITester();

  try {
    // Run all tests
    await tester.runTest('Health endpoint', () => tester.testHealthEndpoint());
    await tester.runTest('Machines endpoint', () => tester.testMachinesEndpoint());
    await tester.runTest('Gamification endpoint (new user)', () => tester.testGamificationEndpoint());
    await tester.runTest('Booking creation', () => tester.testBookingCreation());
    await tester.runTest('Booking update', () => tester.testBookingUpdate());
    await tester.runTest('Booking deletion', () => tester.testBookingDeletion());
    await tester.runTest('Gamification update after booking', () => tester.testGamificationUpdate());
    await tester.runTest('Avatar update', () => tester.testAvatarUpdate());

  } catch (error) {
    console.error('\n❌ Test suite failed:', error.message);
  } finally {
    tester.printSummary();
  }
}

// Run the tests if this file is executed directly
if (require.main === module) {
  runAPITests();
}

module.exports = { APITester, runAPITests }; 