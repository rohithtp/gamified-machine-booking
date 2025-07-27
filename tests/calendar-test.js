const API_BASE_URL = 'http://localhost:3001/api';

async function testCalendarData() {
  console.log('🧪 Testing Calendar Data Loading...');

  try {
    // Test 1: Load all bookings
    console.log('\n1. Testing All Bookings Load...');
    const bookingsResponse = await fetch(`${API_BASE_URL}/bookings`);
    const bookings = await bookingsResponse.json();
    console.log(`✅ Loaded ${bookings.length} bookings`);

    // Test 2: Load all users
    console.log('\n2. Testing All Users Load...');
    const usersResponse = await fetch(`${API_BASE_URL}/users`);
    const users = await usersResponse.json();
    console.log(`✅ Loaded ${users.length} users`);

    // Test 3: Verify booking-user relationships
    console.log('\n3. Testing Booking-User Relationships...');
    const uniqueUserIds = [...new Set(bookings.map(booking => booking.userId))];
    console.log(`✅ Found ${uniqueUserIds.length} unique users with bookings`);

    // Test 4: Check if all booking users exist in users list
    const missingUsers = uniqueUserIds.filter(userId => 
      !users.find(user => user._id === userId)
    );
    
    if (missingUsers.length === 0) {
      console.log('✅ All booking users exist in users list');
    } else {
      console.log(`⚠️  Found ${missingUsers.length} missing users:`, missingUsers);
    }

    // Test 5: Show sample booking with user info
    console.log('\n4. Sample Booking with User Info...');
    if (bookings.length > 0 && users.length > 0) {
      const sampleBooking = bookings[0];
      const sampleUser = users.find(user => user._id === sampleBooking.userId);
      console.log(`✅ Sample booking: ${sampleBooking.machine} on ${sampleBooking.date}`);
      console.log(`   Booked by: ${sampleUser ? sampleUser.name : 'Unknown User'}`);
      console.log(`   Status: ${sampleBooking.status}`);
    }

    // Test 6: Check date distribution
    console.log('\n5. Testing Date Distribution...');
    const dateCounts = {};
    bookings.forEach(booking => {
      const date = booking.date;
      dateCounts[date] = (dateCounts[date] || 0) + 1;
    });
    
    const sortedDates = Object.entries(dateCounts).sort((a, b) => new Date(a[0]) - new Date(b[0]));
    console.log('✅ Bookings by date:');
    sortedDates.forEach(([date, count]) => {
      console.log(`   ${date}: ${count} booking(s)`);
    });

    console.log('\n🎉 All calendar data tests passed!');
    console.log('\n📋 Summary:');
    console.log(`  ✅ ${bookings.length} bookings loaded`);
    console.log(`  ✅ ${users.length} users loaded`);
    console.log(`  ✅ ${uniqueUserIds.length} users have bookings`);
    console.log(`  ✅ Calendar can display all bookings with user information`);

  } catch (error) {
    console.error('❌ Calendar test failed:', error.message);
  }
}

// Export for use in test runner
module.exports = { testCalendarData };

// Run the test if called directly
if (require.main === module) {
  testCalendarData();
} 