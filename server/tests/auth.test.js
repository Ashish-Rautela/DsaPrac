const { describe, it, beforeEach } = require('node:test');
const assert = require('node:assert');
const request = require('supertest');
const app = require('../src/app');
const { mockStore } = require('../src/config/dynamodb');

describe('Authentication & User Management Tests', () => {
  beforeEach(() => {
    mockStore.reset();
  });

  it('successfully registers a new user with hashed password and returns token', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({
        name: 'Jane Doe',
        email: 'jane@example.com',
        password: 'Password123!',
      });

    assert.strictEqual(res.status, 201);
    assert.strictEqual(res.body.user.name, 'Jane Doe');
    assert.strictEqual(res.body.user.email, 'jane@example.com');
    assert.strictEqual(res.body.user.role, 'user');
    assert.strictEqual(res.body.user.hasLifetimeAccess, false);
    assert.strictEqual(res.body.user.passwordHash, undefined); // Never leaked
    assert.ok(res.body.token);
  });

  it('rejects registration with invalid inputs (weak password, bad email, empty name)', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({
        name: '',
        email: 'invalid-email',
        password: '123',
      });

    assert.strictEqual(res.status, 400);
    assert.strictEqual(res.body.error, 'VALIDATION_FAILED');
  });

  it('atomically prevents duplicate email registration', async () => {
    // 1st registration
    await request(app)
      .post('/api/auth/register')
      .send({
        name: 'First User',
        email: 'duplicate@example.com',
        password: 'Password123!',
      });

    // 2nd registration with same email (different case)
    const res = await request(app)
      .post('/api/auth/register')
      .send({
        name: 'Second User',
        email: 'DUPLICATE@example.com',
        password: 'AnotherPassword123!',
      });

    assert.strictEqual(res.status, 409);
    assert.strictEqual(res.body.error, 'EMAIL_ALREADY_EXISTS');
  });

  it('successfully logs in with valid credentials and sets cookie', async () => {
    await request(app)
      .post('/api/auth/register')
      .send({
        name: 'Login User',
        email: 'login@example.com',
        password: 'SecurePassword123!',
      });

    const res = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'login@example.com',
        password: 'SecurePassword123!',
      });

    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.body.user.email, 'login@example.com');
    assert.ok(res.body.token);

    // Verify cookie set
    const cookies = res.headers['set-cookie'];
    assert.ok(cookies);
    assert.ok(cookies.some((c) => c.includes('token=')));
  });

  it('protects against account enumeration: invalid password and non-existent email return identical 401', async () => {
    await request(app)
      .post('/api/auth/register')
      .send({
        name: 'Existing User',
        email: 'exists@example.com',
        password: 'SecurePassword123!',
      });

    // Wrong password for existing user
    const resWrongPass = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'exists@example.com',
        password: 'WrongPassword!',
      });

    // Non-existent user
    const resNonExistent = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'nobody@example.com',
        password: 'SomePassword123!',
      });

    assert.strictEqual(resWrongPass.status, 401);
    assert.strictEqual(resNonExistent.status, 401);
    assert.strictEqual(resWrongPass.body.error, 'INVALID_CREDENTIALS');
    assert.strictEqual(resNonExistent.body.error, 'INVALID_CREDENTIALS');
  });

  it('retrieves authenticated profile via /api/auth/me and blocks unauthenticated requests', async () => {
    const regRes = await request(app)
      .post('/api/auth/register')
      .send({
        name: 'Profile Tester',
        email: 'profile@example.com',
        password: 'SecurePassword123!',
      });

    const token = regRes.body.token;

    // With token
    const meRes = await request(app)
      .get('/api/auth/me')
      .set('Authorization', `Bearer ${token}`);

    assert.strictEqual(meRes.status, 200);
    assert.strictEqual(meRes.body.user.email, 'profile@example.com');

    // Without token
    const unauthRes = await request(app).get('/api/auth/me');
    assert.strictEqual(unauthRes.status, 401);
    assert.strictEqual(unauthRes.body.error, 'Unauthorized');
  });
});
