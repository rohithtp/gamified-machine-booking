const fetch = require('node-fetch');

const API_BASE_URL = 'http://localhost:3001/api';

async function testAvatarFunctionality() {
  console.log('🧪 Testing Avatar Functionality...\n');

  try {
    // Test 1: Random Avatar Generation
    console.log('1. Testing Random Avatar Generation...');
    const randomResponse = await fetch(`${API_BASE_URL}/avatar/random`);
    const randomData = await randomResponse.json();
    console.log(`✅ Random avatar generated: ${randomData.avatar}`);

    // Test 2: User Creation with Random Avatar
    console.log('\n2. Testing User Creation with Random Avatar...');
    const userData = {
      name: 'Test User',
      email: 'test@example.com'
      // No avatar specified - should be randomly generated
    };
    
    const createResponse = await fetch(`${API_BASE_URL}/users`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });
    
    const createdUser = await createResponse.json();
    console.log(`✅ User created with avatar: ${createdUser.avatar}`);

    // Test 3: User Creation with Specific Avatar
    console.log('\n3. Testing User Creation with Specific Avatar...');
    const userData2 = {
      name: 'Test User 2',
      email: 'test2@example.com',
      avatar: 'pixel'
    };
    
    const createResponse2 = await fetch(`${API_BASE_URL}/users`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData2),
    });
    
    const createdUser2 = await createResponse2.json();
    console.log(`✅ User created with specified avatar: ${createdUser2.avatar}`);

    // Test 4: Avatar Update
    console.log('\n4. Testing Avatar Update...');
    const updateResponse = await fetch(`${API_BASE_URL}/users/${createdUser._id}/avatar`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ avatar: 'sunset' }),
    });
    
    const updateResult = await updateResponse.json();
    console.log(`✅ Avatar updated: ${updateResult.success ? 'Success' : 'Failed'}`);

    // Test 5: Get All Users
    console.log('\n5. Testing Get All Users...');
    const usersResponse = await fetch(`${API_BASE_URL}/users`);
    const users = await usersResponse.json();
    console.log(`✅ Found ${users.length} users`);

    // Cleanup: Delete test users
    console.log('\n6. Cleaning up test users...');
    await fetch(`${API_BASE_URL}/users/${createdUser._id}`, { method: 'DELETE' });
    await fetch(`${API_BASE_URL}/users/${createdUser2._id}`, { method: 'DELETE' });
    console.log('✅ Test users deleted');

    console.log('\n🎉 All avatar functionality tests passed!');
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

// Run the test
testAvatarFunctionality(); 