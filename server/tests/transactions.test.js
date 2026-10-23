const { describe, it, beforeEach } = require('node:test');
const assert = require('node:assert');
const request = require('supertest');
const app = require('../src/app');
const { mockStore } = require('../src/config/dynamodb');
const { bootstrapAdmin } = require('../src/scripts/bootstrapAdmin');
const userRepository = require('../src/repositories/userRepository');

describe('Transactional Payment Approval & Progress Tests', () => {
  let adminToken;
  let studentToken;
  let studentId;

  beforeEach(async () => {
    mockStore.reset();

    // Bootstrap admin
    await bootstrapAdmin({
      email: 'admin@visa.internal',
      password: 'AdminPassword123!',
      name: 'System Admin',
    });
    const adminLogin = await request(app)
      .post('/api/auth/login')
      .send({ email: 'admin@visa.internal', password: 'AdminPassword123!' });
    adminToken = adminLogin.body.token;

    // Register student
    const student = await request(app)
      .post('/api/auth/register')
      .send({
        name: 'Charlie Student',
        email: 'charlie@example.com',
        password: 'Password123!',
      });
    studentToken = student.body.token;
    studentId = student.body.user.userId;
  });

  it('blocks regular users from accessing admin payment endpoints', async () => {
    const res = await request(app)
      .get('/api/admin/payments')
      .set('Authorization', `Bearer ${studentToken}`);
    assert.strictEqual(res.status, 403);
  });

  it('atomically approves a pending payment and activates lifetime access for the user', async () => {
    // 1. Student submits UTR
    const payRes = await request(app)
      .post('/api/payments')
      .set('Authorization', `Bearer ${studentToken}`)
      .send({ utr: 'UTRATOM1234567' });
    const paymentId = payRes.body.payment.paymentId;

    // Verify initial status
    let user = await userRepository.findById(studentId);
    assert.strictEqual(user.hasLifetimeAccess, false);

    // 2. Admin approves payment
    const approveRes = await request(app)
      .patch(`/api/admin/payments/${paymentId}/approve`)
      .set('Authorization', `Bearer ${adminToken}`);

    assert.strictEqual(approveRes.status, 200);
    assert.strictEqual(approveRes.body.result.status, 'approved');
    assert.ok(approveRes.body.result.reviewedAt);

    // 3. Verify user's lifetime entitlement is now TRUE in the database
    user = await userRepository.findById(studentId);
    assert.strictEqual(user.hasLifetimeAccess, true);
  });

  it('prevents concurrent or double approval of an already processed payment', async () => {
    // Submit payment
    const payRes = await request(app)
      .post('/api/payments')
      .set('Authorization', `Bearer ${studentToken}`)
      .send({ utr: 'UTRDOUBLE12345' });
    const paymentId = payRes.body.payment.paymentId;

    // First approval succeeds
    const firstApprove = await request(app)
      .patch(`/api/admin/payments/${paymentId}/approve`)
      .set('Authorization', `Bearer ${adminToken}`);
    assert.strictEqual(firstApprove.status, 200);

    // Second approval fails because payment status is no longer 'pending'
    const secondApprove = await request(app)
      .patch(`/api/admin/payments/${paymentId}/approve`)
      .set('Authorization', `Bearer ${adminToken}`);
    assert.strictEqual(secondApprove.status, 409);
    assert.strictEqual(secondApprove.body.error, 'INVALID_PAYMENT_STATE');
  });

  it('correctly handles payment rejection without granting lifetime access', async () => {
    const payRes = await request(app)
      .post('/api/payments')
      .set('Authorization', `Bearer ${studentToken}`)
      .send({ utr: 'UTRREJECT12345' });
    const paymentId = payRes.body.payment.paymentId;

    const rejectRes = await request(app)
      .patch(`/api/admin/payments/${paymentId}/reject`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ reason: 'UTR not found in bank statement for ₹20.' });

    assert.strictEqual(rejectRes.status, 200);
    assert.strictEqual(rejectRes.body.payment.status, 'rejected');
    assert.strictEqual(
      rejectRes.body.payment.rejectionReason,
      'UTR not found in bank statement for ₹20.'
    );

    // Verify user still does NOT have access
    const user = await userRepository.findById(studentId);
    assert.strictEqual(user.hasLifetimeAccess, false);
  });

  it('tracks question progress scoped to the authenticated user', async () => {
    // 1. Initial progress empty
    const initRes = await request(app)
      .get('/api/progress')
      .set('Authorization', `Bearer ${studentToken}`);
    assert.strictEqual(initRes.status, 200);
    assert.deepStrictEqual(initRes.body.progress, {});

    // 2. Mark question 'visa-001' as solved
    const putRes = await request(app)
      .put('/api/progress/visa-001')
      .set('Authorization', `Bearer ${studentToken}`)
      .send({ status: 'solved' });
    assert.strictEqual(putRes.status, 200);
    assert.strictEqual(putRes.body.progress.status, 'solved');

    // 3. Fetch progress again
    const afterRes = await request(app)
      .get('/api/progress')
      .set('Authorization', `Bearer ${studentToken}`);
    assert.strictEqual(afterRes.status, 200);
    assert.strictEqual(afterRes.body.progress['visa-001'], 'solved');
  });
});
