import { config } from 'dotenv';

// Load test environment variables
config({ path: '.env.test' });

// Set test environment
process.env.NODE_ENV = 'test';
process.env.TEMPLATE_NODE_ENV = 'test';

// Default test configuration
if (!process.env.DATABASE_URL) {
  process.env.DATABASE_URL = 'postgres://username:password@localhost:5432/diary_test';
}

if (!process.env.JWT_SECRET) {
  process.env.JWT_SECRET = 'test-jwt-secret-key';
}

if (!process.env.PORT) {
  process.env.PORT = '3001';
}

// Mock OTP for testing
process.env.TEST_OTP = '123456';

export {};