# Diary API Test Suite

This comprehensive test suite covers all diary repository routes with complete authentication and authorization testing.

## Test Coverage

### Authentication Tests
- User login and OTP verification
- Admin login
- Token generation and validation
- Runtime environment variable setup (`process.env.USER_TOKEN`, `process.env.ADMIN_TOKEN`)

### Diary CRUD Operations
1. **POST /api/v1/diary** - Create Diary
   - Valid data creation
   - Admin privilege testing
   - Authentication validation
   - Data validation errors
   - Invalid data handling

2. **GET /api/v1/diary/:id** - Get Single Diary
   - Owner access verification
   - Admin access verification
   - Search functionality
   - Non-owner access denial
   - Non-existent diary handling
   - Authentication requirements

3. **GET /api/v1/diary** - Get User Diaries
   - User-specific diary retrieval
   - Pagination testing
   - Search filtering
   - Mood and weather filtering
   - Authentication validation
   - Empty result handling

4. **PUT /api/v1/diary/:id** - Update Diary
   - Owner update permissions
   - Admin update permissions
   - Partial updates
   - Non-owner access denial
   - Non-existent diary handling
   - Data validation

5. **DELETE /api/v1/diary/:id** - Delete Diary
   - Owner deletion permissions
   - Admin deletion permissions
   - Non-owner access denial
   - Non-existent diary handling
   - Authentication requirements
   - Double deletion prevention

### Edge Cases & Error Handling
- Malformed authorization headers
- Expired tokens
- Very long input validation
- Special characters in search
- Negative pagination values
- Concurrent request handling
- Performance testing

## Environment Variables

The tests automatically set runtime environment variables as requested:

```javascript
process.env.USER_TOKEN = res.body.token    // Set after user authentication
process.env.ADMIN_TOKEN = res.body.token   // Set after admin authentication
```

## Setup Requirements

1. **Test Database**: Configure a separate test database in `.env.test`
2. **Test Environment**: Ensure test environment variables are set
3. **Migration**: Run test migrations before testing
4. **Cleanup**: Tests automatically clean up environment variables

## Running Tests

```bash
# Run all tests
npm test

# Run with coverage
npm run test:coverage

# Run specific test file
npx mocha tests/diary-complete.test.ts --require ts-node/register
```

## Test Structure

- **Setup Phase**: Authentication and test data creation
- **Route Testing**: Comprehensive endpoint testing
- **Authorization Testing**: Permission and ownership validation
- **Error Handling**: Edge cases and error scenarios
- **Performance Testing**: Concurrent requests and load testing
- **Cleanup Phase**: Environment variable cleanup

## Key Features

- **Comprehensive Coverage**: All diary routes tested
- **Authentication Integration**: Real token generation and usage
- **Authorization Testing**: Owner/admin permission validation
- **Error Scenarios**: Complete error handling validation
- **Performance Testing**: Concurrent request handling
- **Test Helpers**: Reusable utilities for test data creation
- **Environment Setup**: Automated test environment configuration

## Test Data

Tests use dynamically generated test data to avoid conflicts:
- Unique email addresses with timestamps
- Dynamic diary titles and descriptions
- Randomized mood and weather values
- Automatic cleanup of test artifacts

## Assertions

All tests include comprehensive assertions for:
- HTTP status codes
- Response body structure
- Data integrity
- Error messages
- Authentication state
- Authorization permissions