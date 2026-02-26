/**
 * Test Setup Configuration
 * This file runs before all tests and configures the test environment.
 */

// Set Node environment to test
process.env.NODE_ENV = 'test';

// Set test database configuration (prevents connecting to production)
process.env.DB_NAME = 'lift_nepal_test';
process.env.DB_USER = process.env.DB_USER || 'test_user';
process.env.DB_PASSWORD = process.env.DB_PASSWORD || 'test_password';
process.env.DB_HOST = process.env.DB_HOST || 'localhost';
process.env.DB_PORT = process.env.DB_PORT || '5432';

// Set JWT secret for testing
process.env.JWT_SECRET = 'test_jwt_secret_key_12345';

// Increase Jest timeout for database operations
jest.setTimeout(10000);

// Mock console methods to reduce noise during tests (optional)
// Uncomment the following lines to suppress console output during tests:
// global.console = {
//   ...console,
//   log: jest.fn(),
//   debug: jest.fn(),
//   info: jest.fn(),
//   warn: jest.fn(),
// };

// Cleanup function after all tests
afterAll(async () => {
  // Close any open handles
  await new Promise(resolve => setTimeout(resolve, 500));
});

// Global beforeEach - reset any mocks
beforeEach(() => {
  jest.clearAllMocks();
});
