const crypto = require('crypto');
const questionRepository = require('../repositories/questionRepository');
const userRepository = require('../repositories/userRepository');
const progressRepository = require('../repositories/progressRepository');
const { DEFAULT_COMPANY, ROLES } = require('../models/entities');
const { validateQuestionInput } = require('../validators/schemas');

class QuestionService {
  sanitizeQuestion(q, hasFullAccess) {
    if (!q) return null;

    const base = {
      questionId: q.questionId,
      company: q.company || DEFAULT_COMPANY,
      difficulty: q.difficulty,
      isPremium: Boolean(q.isPremium),
      leetcodeId: q.leetcodeId || null,
      frequency: q.frequency || null,
      frequencyPercent: q.frequencyPercent || null,
      acceptancePercent: q.acceptancePercent || null,
      createdAt: q.createdAt,
      updatedAt: q.updatedAt,
    };

    if (!q.isPremium || hasFullAccess) {
      return {
        ...base,
        title: q.title,
        topics: q.topics || [],
        leetcodeUrl: q.leetcodeUrl || '',
        description: q.description || '',
        isLocked: false,
        isBlurred: false,
      };
    }

    // For unpaid users on premium items: blur/mask title, withhold real name, leetcodeUrl & notes
    return {
      ...base,
      title: '🔒 Premium Visa OA Question',
      blurredPlaceholder: 'Algorithmic Problem Pattern ' + '■'.repeat(16),
      topics: ['Visa OA High-Frequency'],
      isLocked: true,
      isBlurred: true,
      // leetcodeUrl and description strictly omitted
    };
  }

  async checkUserAccess(userId) {
    if (!userId) return false;
    const user = await userRepository.findById(userId);
    if (!user) return false;
    return Boolean(user.hasLifetimeAccess) || user.role === ROLES.ADMIN;
  }

  async listQuestions({ userId = null, company = DEFAULT_COMPANY, search = '', difficulty = '', topic = '', page = 1, limit = 20 }) {
    const hasFullAccess = await this.checkUserAccess(userId);
    const rawQuestions = await questionRepository.listCompanyQuestions(company);

    let progressMap = {};
    if (userId) {
      progressMap = await progressRepository.getProgressForUser(userId);
    }

    // Apply filtering in memory
    let filtered = rawQuestions;

    if (search && search.trim()) {
      const q = search.trim().toLowerCase();
      if (!hasFullAccess) {
        // If unpaid, searching by title only searches visible free questions
        filtered = filtered.filter(
          (item) => !item.isPremium && item.title && item.title.toLowerCase().includes(q)
        );
      } else {
        filtered = filtered.filter((item) => item.title && item.title.toLowerCase().includes(q));
      }
    }

    if (difficulty && difficulty !== 'All') {
      filtered = filtered.filter((item) => item.difficulty === difficulty);
    }

    if (topic && topic !== 'All') {
      filtered = filtered.filter((item) => item.topics && item.topics.includes(topic));
    }

    // ponytail: Group all free starter questions first so they are compiled on Page 1,
    // followed by premium questions ranked by interview frequency.
    filtered.sort((a, b) => {
      // Free starter questions first
      const aPrem = a.isPremium ? 1 : 0;
      const bPrem = b.isPremium ? 1 : 0;
      if (aPrem !== bPrem) return aPrem - bPrem;

      const freqA = typeof a.frequency === 'number' ? a.frequency : parseFloat(a.frequency) || 0;
      const freqB = typeof b.frequency === 'number' ? b.frequency : parseFloat(b.frequency) || 0;
      if (freqB !== freqA) return freqB - freqA;
      const diffWeight = { Easy: 1, Medium: 2, Hard: 3 };
      const diffComp = (diffWeight[a.difficulty] || 0) - (diffWeight[b.difficulty] || 0);
      if (diffComp !== 0) return diffComp;
      return a.title.localeCompare(b.title);
    });

    const total = filtered.length;
    const pageNum = Math.max(1, parseInt(page, 10) || 1);
    const limitNum = Math.min(100, Math.max(1, parseInt(limit, 10) || 20));
    const offset = (pageNum - 1) * limitNum;
    const pagedItems = filtered.slice(offset, offset + limitNum);

    const questions = pagedItems.map((q) => {
      const sanitized = this.sanitizeQuestion(q, hasFullAccess);
      return {
        ...sanitized,
        status: progressMap[q.questionId] || 'unsolved',
      };
    });

    const freeCount = rawQuestions.filter((q) => !q.isPremium).length;
    const premiumCount = rawQuestions.filter((q) => q.isPremium).length;

    return {
      questions,
      pagination: {
        total,
        page: pageNum,
        limit: limitNum,
        totalPages: Math.ceil(total / limitNum) || 1,
      },
      hasFullAccess,
      freeCount,
      premiumCount,
    };
  }

  async getQuestionById(questionId, userId = null, company = DEFAULT_COMPANY) {
    const raw = await questionRepository.getById(questionId, company);
    if (!raw) {
      const err = new Error('Question not found.');
      err.status = 404;
      err.code = 'QUESTION_NOT_FOUND';
      throw err;
    }

    const hasFullAccess = await this.checkUserAccess(userId);

    // If question is premium and user does not have access -> 403 Forbidden
    if (raw.isPremium && !hasFullAccess) {
      const err = new Error('Premium question. ₹20 lifetime access is required to view this question.');
      err.status = 403;
      err.code = 'PREMIUM_ACCESS_REQUIRED';
      throw err;
    }

    let status = 'unsolved';
    if (userId) {
      const progressMap = await progressRepository.getProgressForUser(userId);
      status = progressMap[questionId] || 'unsolved';
    }

    const sanitized = this.sanitizeQuestion(raw, hasFullAccess);
    return {
      ...sanitized,
      status,
    };
  }

  async createQuestion(input, company = DEFAULT_COMPANY) {
    const validation = validateQuestionInput(input);
    if (!validation.isValid) {
      const err = new Error(validation.errors.join(' '));
      err.status = 400;
      err.code = 'VALIDATION_FAILED';
      throw err;
    }

    const questionId = crypto.randomUUID();
    return questionRepository.createQuestion({
      questionId,
      ...validation.data,
      company,
    });
  }

  async updateQuestion(questionId, input, company = DEFAULT_COMPANY) {
    const existing = await questionRepository.getById(questionId, company);
    if (!existing) {
      const err = new Error('Question not found.');
      err.status = 404;
      err.code = 'QUESTION_NOT_FOUND';
      throw err;
    }

    return questionRepository.updateQuestion(questionId, input, company);
  }

  async deleteQuestion(questionId, company = DEFAULT_COMPANY) {
    const existing = await questionRepository.getById(questionId, company);
    if (!existing) {
      const err = new Error('Question not found.');
      err.status = 404;
      err.code = 'QUESTION_NOT_FOUND';
      throw err;
    }

    return questionRepository.deleteQuestion(questionId, company);
  }
}

module.exports = new QuestionService();
