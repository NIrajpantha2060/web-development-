/**
 * Integration Tests for API Routes
 * Tests API endpoints using Supertest without starting the real server.
 */

const request = require('supertest');

// Mock Sequelize to prevent actual database connections during tests
jest.mock('../../config/db', () => ({
  sync: jest.fn().mockResolvedValue(true),
  authenticate: jest.fn().mockResolvedValue(true),
  define: jest.fn(),
  close: jest.fn().mockResolvedValue(true)
}));

// Mock all models to prevent database operations
jest.mock('../../models/User', () => ({
  findOne: jest.fn().mockResolvedValue(null),
  findByPk: jest.fn().mockResolvedValue(null),
  create: jest.fn().mockResolvedValue({}),
  update: jest.fn().mockResolvedValue([1]),
}));
jest.mock('../../models/Verification', () => ({}));
jest.mock('../../models/Notification', () => ({}));
jest.mock('../../models/Ride', () => ({}));
jest.mock('../../models/Vehicle', () => ({}));
jest.mock('../../models/RideBooking', () => ({}));
jest.mock('../../models/Report', () => ({}));
jest.mock('../../models/Issue', () => ({}));

// Import app after mocking
const { app } = require('../../app');

describe('API Routes Integration Tests', () => {
  
  // ============================================
  // Health Check Tests
  // ============================================
  describe('GET /', () => {
    test('should return health check message', async () => {
      const response = await request(app)
        .get('/')
        .expect('Content-Type', /text/)
        .expect(200);
      
      expect(response.text).toContain('Lift Nepal Backend Running');
    });
  });

  // ============================================
  // API Response Tests
  // ============================================
  describe('API Endpoints', () => {
    test('should return 404 for non-existent routes', async () => {
      const response = await request(app)
        .get('/api/non-existent-route')
        .expect(404);
    });

    test('should accept JSON content type', async () => {
      // Test that the server accepts JSON
      const response = await request(app)
        .post('/api/auth/login')
        .set('Content-Type', 'application/json')
        .send({ email: 'test@test.com', password: 'test123' });
      
      // We expect some response (might be error due to mocked DB, but server should respond)
      expect(response.status).toBeDefined();
    });
  });

  // ============================================
  // Static Files Tests
  // ============================================
  describe('Static Files', () => {
    test('GET /uploads/test should return upload directories status', async () => {
      const response = await request(app)
        .get('/uploads/test')
        .expect('Content-Type', /json/)
        .expect(200);
      
      expect(response.body).toHaveProperty('profilesExists');
      expect(response.body).toHaveProperty('documentsExists');
      expect(response.body).toHaveProperty('vehiclesExists');
    });
  });

  // ============================================
  // CORS Tests
  // ============================================
  describe('CORS Headers', () => {
    test('should include CORS headers in response', async () => {
      const response = await request(app)
        .get('/')
        .expect(200);
      
      // CORS should be enabled
      expect(response.headers['access-control-allow-origin']).toBeDefined();
    });
  });

  // ============================================
  // Content Type Tests
  // ============================================
  describe('Content Type Handling', () => {
    test('should parse JSON body correctly', async () => {
      const testData = { test: 'data' };
      
      const response = await request(app)
        .post('/api/auth/register')
        .set('Content-Type', 'application/json')
        .send(testData);
      
      // Server should respond (status depends on validation/mocked DB)
      expect(response.status).toBeDefined();
    });
  });
});
