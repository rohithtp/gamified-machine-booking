# Tests

This directory contains the test suite for the Gamified Machine Booking application.

## Test Structure

- `api.test.js` - Main API test suite
- `run-tests.js` - Test runner script
- `README.md` - This file

## Running Tests

### Prerequisites
Make sure the backend server is running:
```bash
npm run server
```

### Run All Tests
```bash
npm test
```

### Run Tests Directly
```bash
node tests/run-tests.js
```

### Run Individual Test File
```bash
node tests/api.test.js
```

## Test Coverage

The test suite covers the following API endpoints:

1. **Health Check** (`GET /api/health`)
   - Verifies server is running and responding

2. **Machines** (`GET /api/machines`)
   - Tests retrieval of available machines

3. **Gamification** (`GET /api/gamification/:userId`)
   - Tests user gamification data retrieval
   - Tests new user creation

4. **Bookings** (`POST /api/bookings`)
   - Tests booking creation
   - Verifies gamification updates after booking

5. **Avatar Update** (`PUT /api/gamification/:userId/avatar`)
   - Tests avatar preference updates

## Test Data

- Each test run creates a unique test user with timestamp-based ID
- Test data is isolated and doesn't interfere with production data
- NeDB databases are used for persistent storage during tests

## Adding New Tests

To add new tests:

1. Create a new test method in the `APITester` class in `api.test.js`
2. Add the test call in the `runAPITests()` function
3. Follow the existing pattern for error handling and result reporting

Example:
```javascript
async testNewEndpoint() {
  const response = await fetch(`${API_BASE}/new-endpoint`);
  if (!response.ok) throw new Error(`HTTP ${response.status}`);
  const data = await response.json();
  return data;
}

// Add to runAPITests():
await tester.runTest('New endpoint', () => tester.testNewEndpoint());
```

## Troubleshooting

### Server Not Running
If tests fail with connection errors:
```bash
npm run server
```

### Port Already in Use
If port 3001 is already in use:
```bash
lsof -ti:3001 | xargs kill -9
npm run server
```

### Database Issues
If NeDB databases are corrupted:
```bash
rm -rf server/data/*.db
npm run server
``` 