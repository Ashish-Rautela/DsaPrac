const { describe, it, beforeEach } = require('node:test');
const assert = require('node:assert');
const request = require('supertest');
const app = require('../src/app');
const { mockStore } = require('../src/config/dynamodb');
const userRepository = require('../src/repositories/userRepository');

describe('Payment Submission & Verification Tests', () => {
  let user1Token;
  let user1Id;
  let user2Token;

  beforeEach(async () => {
    mockStore.reset();

    const u1 = await request(app)
      .post('/api/auth/register')
      .send({
        name: 'Alice Student',
        email: 'alice@example.com',
        password: 'Password123!',
      });
    user1Token = u1.body.token;
    user1Id = u1.body.user.userId;

    const u2 = await request(app)
      .post('/api/auth/register')
      .send({
        name: 'Bob Student',
        email: 'bob@example.com',
        password: 'Password123!',
      });
    user2Token = u2.body.token;
  });

  it('allows authenticated user to submit a valid UTR for ₹20 (2000 paise) lifetime access', async () => {
    const res = await request(app)
      .post('/api/payments')
      .set('Authorization', `Bearer ${user1Token}`)
      .send({ utr: 'UTR1234567890' });

    assert.strictEqual(res.status, 201);
    assert.strictEqual(res.body.payment.utr, 'UTR1234567890');
    assert.strictEqual(res.body.payment.amountPaise, 2000);
    assert.strictEqual(res.body.payment.currency, 'INR');
    assert.strictEqual(res.body.payment.status, 'pending');
    assert.strictEqual(res.body.payment.userId, user1Id);
  });

  it('allows submitting payment with screenshot and preserves screenshot for review', async () => {
    const fakeScreenshot = 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEASABIAAD...fakebase64data';
    const res = await request(app)
      .post('/api/payments')
      .set('Authorization', `Bearer ${user2Token}`)
      .send({ utr: 'UTRPIC999888', screenshot: fakeScreenshot });

    assert.strictEqual(res.status, 201);
    assert.strictEqual(res.body.payment.utr, 'UTRPIC999888');
    assert.strictEqual(res.body.payment.screenshot, fakeScreenshot);
  });

  it('rejects invalid or malformed UTR strings with HTTP 400', async () => {
    const res = await request(app)
      .post('/api/payments')
      .set('Authorization', `Bearer ${user1Token}`)
      .send({ utr: '123' }); // Too short

    assert.strictEqual(res.status, 400);
    assert.strictEqual(res.body.error, 'VALIDATION_FAILED');
  });

  it('atomically rejects duplicate UTR submission across different users', async () => {
    // User 1 submits UTR
    const res1 = await request(app)
      .post('/api/payments')
      .set('Authorization', `Bearer ${user1Token}`)
      .send({ utr: 'UTRSHARED99999' });
    assert.strictEqual(res1.status, 201);

    // User 2 attempts to claim the same UTR
    const res2 = await request(app)
      .post('/api/payments')
      .set('Authorization', `Bearer ${user2Token}`)
      .send({ utr: 'UTRSHARED99999' });

    assert.strictEqual(res2.status, 409);
    assert.strictEqual(res2.body.error, 'UTR_ALREADY_EXISTS');
  });

  it('prevents a user from submitting multiple pending payments concurrently', async () => {
    // First submission
    const res1 = await request(app)
      .post('/api/payments')
      .set('Authorization', `Bearer ${user1Token}`)
      .send({ utr: 'UTRFIRST11111' });
    assert.strictEqual(res1.status, 201);

    // Second submission while first is still pending
    const res2 = await request(app)
      .post('/api/payments')
      .set('Authorization', `Bearer ${user1Token}`)
      .send({ utr: 'UTRSECOND2222' });

    assert.strictEqual(res2.status, 409);
    assert.strictEqual(res2.body.error, 'PENDING_SUBMISSION_EXISTS');
  });

  it('prevents already-entitled users from submitting unnecessary payments', async () => {
    // Manually grant lifetime access
    await userRepository.updateEntitlement(user1Id, true);

    const res = await request(app)
      .post('/api/payments')
      .set('Authorization', `Bearer ${user1Token}`)
      .send({ utr: 'UTRAHEAD33333' });

    assert.strictEqual(res.status, 400);
    assert.strictEqual(res.body.error, 'ALREADY_ACTIVE_ENTITLEMENT');
  });

  it('scopes payment history to authenticated user', async () => {
    await request(app)
      .post('/api/payments')
      .set('Authorization', `Bearer ${user1Token}`)
      .send({ utr: 'UTRALICE44444' });

    const res = await request(app)
      .get('/api/payments/me')
      .set('Authorization', `Bearer ${user1Token}`);

    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.body.payments.length, 1);
    assert.strictEqual(res.body.payments[0].utr, 'UTRALICE44444');

    // Bob has zero payments
    const bobRes = await request(app)
      .get('/api/payments/me')
      .set('Authorization', `Bearer ${user2Token}`);
    assert.strictEqual(bobRes.status, 200);
    assert.strictEqual(bobRes.body.payments.length, 0);
  });
});
