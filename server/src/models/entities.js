// DynamoDB Entity key helpers and constants
// ponytail: explicit deterministic key helpers prevent typos across repository methods

const ROLES = {
  USER: 'user',
  ADMIN: 'admin',
};

const PAYMENT_STATUS = {
  PENDING: 'pending',
  APPROVED: 'approved',
  REJECTED: 'rejected',
};

const QUESTION_DIFFICULTY = {
  EASY: 'Easy',
  MEDIUM: 'Medium',
  HARD: 'Hard',
};

const PROGRESS_STATUS = {
  SOLVED: 'solved',
  UNSOLVED: 'unsolved',
};

const DEFAULT_COMPANY = 'VISA';

// Users table keys
const userKeys = {
  profile: (userId) => ({ PK: `USER#${userId}`, SK: 'PROFILE' }),
  emailLookup: (emailNormalized) => ({ PK: `EMAIL#${emailNormalized}`, SK: 'EMAIL' }),
};

// Questions table keys (extensible company PK)
const questionKeys = {
  item: (questionId, company = DEFAULT_COMPANY) => ({
    PK: `COMPANY#${company.toUpperCase()}`,
    SK: `QUESTION#${questionId}`,
  }),
  companyPK: (company = DEFAULT_COMPANY) => `COMPANY#${company.toUpperCase()}`,
};

// Payments table keys
const paymentKeys = {
  item: (paymentId) => ({ PK: `PAYMENT#${paymentId}`, SK: 'DETAILS' }),
  utrLookup: (utrNormalized) => ({ PK: `UTR#${utrNormalized}`, SK: 'UTR' }),
};

// Progress table keys
const progressKeys = {
  item: (userId, questionId) => ({ PK: `USER#${userId}`, SK: `QUESTION#${questionId}` }),
  userPK: (userId) => `USER#${userId}`,
};

module.exports = {
  ROLES,
  PAYMENT_STATUS,
  QUESTION_DIFFICULTY,
  PROGRESS_STATUS,
  DEFAULT_COMPANY,
  userKeys,
  questionKeys,
  paymentKeys,
  progressKeys,
};
