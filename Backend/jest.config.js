/**
 * Jest Configuration for Backend Testing
 * This configuration ensures tests run in isolation without affecting production.
 */

module.exports = {
  // Use Node.js test environment
  testEnvironment: 'node',
  
  // Root directory for tests
  roots: ['<rootDir>/tests'],
  
  // Test file patterns
  testMatch: [
    '**/*.test.js',
    '**/*.spec.js'
  ],
  
  // Setup files to run before tests
  setupFilesAfterEnv: ['<rootDir>/tests/setup.js'],
  
  // Coverage configuration
  collectCoverageFrom: [
    'controllers/**/*.js',
    'models/**/*.js',
    'routes/**/*.js',
    'utils/**/*.js',
    'middleware/**/*.js',
    '!**/node_modules/**'
  ],
  
  // Coverage directory
  coverageDirectory: 'coverage',
  
  // Verbose output
  verbose: true,
  
  // Force exit after tests complete
  forceExit: true,
  
  // Clear mocks between tests
  clearMocks: true,
  
  // Timeout for each test
  testTimeout: 10000,
  
  // Module paths
  moduleDirectories: ['node_modules', '<rootDir>'],
  
  // Transform settings (if needed for ES modules)
  transform: {},
  
  // Files to ignore
  testPathIgnorePatterns: [
    '/node_modules/',
    '/uploads/'
  ]
};
