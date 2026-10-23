const { describe, it, beforeEach } = require('node:test');
const assert = require('node:assert');
const request = require('supertest');
const app = require('../src/app');
const { mockStore } = require('../src/config/dynamodb');
const { seed } = require('../src/scripts/seedQuestions');
const { bootstrapAdmin } = require('../src/scripts/bootstrapAdmin');

describe('Questions & Entitlement Protection Tests', () => {
  let adminToken;
  let userToken;
  let paidUserToken;

  beforeEach(async () => {
    mockStore.reset();
    await seed();

    // Create admin
    const admin = await bootstrapAdmin({
      email: 'admin@visa.internal',
      password: 'AdminPassword123!',
      name: 'System Admin',
    });
    const adminLogin = await request(app)
      .post('/api/auth/login')
      .send({ email: 'admin@visa.internal', password: 'AdminPassword123!' });
    adminToken = adminLogin.body.token;

    // Create regular unpaid user
    const userReg = await request(app)
      .post('/api/auth/register')
      .send({
        name: 'Regular Student',
        email: 'student@example.com',
        password: 'Password123!',
      });
    userToken = userReg.body.token;

    // Create paid user
    const paidReg = await request(app)
      .post('/api/auth/register')
      .send({
        name: 'Paid Student',
        email: 'paid@example.com',
        password: 'Password123!',
      });
    paidUserToken = paidReg.body.token;
    // Manually grant lifetime access in repository for test
    const userRepository = require('../src/repositories/userRepository');
    await userRepository.updateEntitlement(paidReg.body.user.userId, true);
  });

  it('lists questions with 8 free starter questions grouped on page 1 and blurred names for all premium questions', async () => {
    const res = await request(app).get('/api/questions?limit=100');
    assert.strictEqual(res.status, 200);
    assert.ok(res.body.questions.length > 0);
    assert.strictEqual(res.body.hasFullAccess, false);

    // Verify free questions (8 questions) have unblurred titles and are not premium
    const freeQuestions = res.body.questions.filter((q) => !q.isPremium);
    assert.ok(freeQuestions.length >= 8 && freeQuestions.length <= 10);
    assert.ok(freeQuestions.every((q) => !q.isBlurred));

    // Verify all free questions appear before any premium questions (compiled on page 1)
    const firstPremiumIndex = res.body.questions.findIndex((q) => q.isPremium);
    assert.strictEqual(firstPremiumIndex, freeQuestions.length);

    // Verify premium questions are blurred and masked (real titles and links withheld)
    const premiumQuestions = res.body.questions.filter((q) => q.isPremium);
    assert.ok(premiumQuestions.length > 0);
    assert.ok(premiumQuestions.every((q) => q.isBlurred === true));
    assert.ok(premiumQuestions.every((q) => q.title.includes('Premium')));
    assert.ok(premiumQuestions.every((q) => q.leetcodeUrl === undefined));
  });

  it('unblurs all questions once user has paid lifetime access', async () => {
    const res = await request(app)
      .get('/api/questions?limit=100')
      .set('Authorization', `Bearer ${paidUserToken}`);

    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.body.hasFullAccess, true);

    // All questions are unblurred with full real titles and leetcode links
    assert.ok(res.body.questions.every((q) => q.isBlurred === false));
    const premiumQuestions = res.body.questions.filter((q) => q.isPremium);
    assert.ok(premiumQuestions.length > 0);
    assert.ok(premiumQuestions.every((q) => !q.title.includes('🔒 Premium')));
  });

  it('filters questions by difficulty and topic, and handles pagination', async () => {
    const resHard = await request(app).get('/api/questions?difficulty=Hard');
    assert.strictEqual(resHard.status, 200);
    assert.ok(resHard.body.questions.every((q) => q.difficulty === 'Hard'));

    const resPaged = await request(app).get('/api/questions?page=1&limit=2');
    assert.strictEqual(resPaged.status, 200);
    assert.strictEqual(resPaged.body.questions.length, 2);
    assert.strictEqual(resPaged.body.pagination.limit, 2);
    assert.strictEqual(resPaged.body.pagination.page, 1);
  });

  it('allows unpaid users to access free question details', async () => {
    const res = await request(app).get('/api/questions/visa-001');
    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.body.question.questionId, 'visa-001');
    assert.strictEqual(res.body.question.isPremium, false);
    assert.ok(res.body.question.leetcodeUrl);
    assert.ok(res.body.question.description);
  });

  it('blocks unpaid users from accessing premium question details with HTTP 403', async () => {
    const res = await request(app)
      .get('/api/questions/visa-003')
      .set('Authorization', `Bearer ${userToken}`);

    assert.strictEqual(res.status, 403);
    assert.strictEqual(res.body.error, 'PREMIUM_ACCESS_REQUIRED');
  });

  it('allows paid users with verified lifetime access to view premium questions', async () => {
    const res = await request(app)
      .get('/api/questions/visa-003')
      .set('Authorization', `Bearer ${paidUserToken}`);

    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.body.question.questionId, 'visa-003');
    assert.strictEqual(res.body.question.isPremium, true);
    assert.ok(res.body.question.leetcodeUrl);
    assert.ok(res.body.question.description);
  });

  it('enforces admin-only permissions for creating, updating, and deleting questions', async () => {
    const newQuestion = {
      title: 'Visa Transaction Graph Cycle',
      difficulty: 'Hard',
      topics: ['Graph', 'DFS'],
      leetcodeUrl: 'https://leetcode.com/problems/course-schedule/',
      description: 'Detect circular transactions in merchant graph.',
      isPremium: true,
    };

    // 1. Regular user attempt -> 403
    const userAttempt = await request(app)
      .post('/api/admin/questions')
      .set('Authorization', `Bearer ${userToken}`)
      .send(newQuestion);
    assert.strictEqual(userAttempt.status, 403);

    // 2. Admin user attempt -> 201
    const adminAttempt = await request(app)
      .post('/api/admin/questions')
      .set('Authorization', `Bearer ${adminToken}`)
      .send(newQuestion);
    assert.strictEqual(adminAttempt.status, 201);
    const createdId = adminAttempt.body.question.questionId;
    assert.ok(createdId);

    // 3. Admin updates question -> 200
    const updateRes = await request(app)
      .patch(`/api/admin/questions/${createdId}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ title: 'Visa Transaction Graph Cycle (Updated)' });
    assert.strictEqual(updateRes.status, 200);
    assert.strictEqual(updateRes.body.question.title, 'Visa Transaction Graph Cycle (Updated)');

    // 4. Admin deletes question -> 200
    const deleteRes = await request(app)
      .delete(`/api/admin/questions/${createdId}`)
      .set('Authorization', `Bearer ${adminToken}`);
    assert.strictEqual(deleteRes.status, 200);

    // 5. Subsequent get -> 404
    const getRes = await request(app)
      .get(`/api/questions/${createdId}`)
      .set('Authorization', `Bearer ${adminToken}`);
    assert.strictEqual(getRes.status, 404);
  });
});
