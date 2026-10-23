const fs = require('fs');
const path = require('path');
const { docClient, PutCommand } = require('../config/dynamodb');
const config = require('../config/env');
const { questionKeys, DEFAULT_COMPANY } = require('../models/entities');

// Load complete Visa OA questions dataset
const dataFilePath = path.resolve(__dirname, 'questionsData.json');
let curatedVisaQuestions = [];

if (fs.existsSync(dataFilePath)) {
  try {
    curatedVisaQuestions = JSON.parse(fs.readFileSync(dataFilePath, 'utf-8'));
  } catch (err) {
    console.error('Failed to parse questionsData.json:', err);
  }
}

// Ensure backward compatibility test IDs exist as aliases if needed
const hasVisa001 = curatedVisaQuestions.some((q) => q.questionId === 'visa-001');
if (!hasVisa001 && curatedVisaQuestions.length > 0) {
  // Alias first free question for legacy tests
  curatedVisaQuestions.push({
    questionId: 'visa-001',
    company: DEFAULT_COMPANY,
    title: 'Two Sum (Fee Reconciliation)',
    difficulty: 'Easy',
    topics: ['Array', 'Hash Table'],
    leetcodeUrl: 'https://leetcode.com/problems/two-sum',
    isPremium: false,
    description: 'Free preview problem testing hash table frequency mapping.',
  });
  curatedVisaQuestions.push({
    questionId: 'visa-003',
    company: DEFAULT_COMPANY,
    title: 'Sliding Window Maximum (Disk Space / Throughput Analysis)',
    difficulty: 'Hard',
    topics: ['Array', 'Sliding Window', 'Queue', 'Monotonic Queue'],
    leetcodeUrl: 'https://leetcode.com/problems/sliding-window-maximum',
    isPremium: true,
    description: 'Premium problem testing monotonic double-ended queue.',
  });
}

async function seed() {
  console.log(`[Seed] Seeding ${curatedVisaQuestions.length} curated Visa OA questions into ${config.tables.questions}...`);

  for (const q of curatedVisaQuestions) {
    const now = new Date().toISOString();
    const item = {
      ...questionKeys.item(q.questionId, DEFAULT_COMPANY),
      questionId: q.questionId,
      company: DEFAULT_COMPANY,
      title: q.title,
      difficulty: q.difficulty,
      topics: q.topics || [],
      leetcodeUrl: q.leetcodeUrl,
      leetcodeId: q.leetcodeId || null,
      frequency: q.frequency || null,
      frequencyPercent: q.frequencyPercent || null,
      acceptancePercent: q.acceptancePercent || null,
      description: q.description || '',
      isPremium: Boolean(q.isPremium),
      createdAt: now,
      updatedAt: now,
    };

    await docClient.send(
      new PutCommand({
        TableName: config.tables.questions,
        Item: item,
      })
    );
  }

  console.log(`[Seed] Successfully seeded ${curatedVisaQuestions.length} Visa OA questions.`);
}

if (require.main === module) {
  seed()
    .then(() => process.exit(0))
    .catch((err) => {
      console.error('[Seed Error]', err);
      process.exit(1);
    });
}

module.exports = { seed, curatedVisaQuestions };
