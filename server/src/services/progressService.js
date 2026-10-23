const progressRepository = require('../repositories/progressRepository');
const { PROGRESS_STATUS } = require('../models/entities');

class ProgressService {
  async getUserProgress(userId) {
    return progressRepository.getProgressForUser(userId);
  }

  async setQuestionProgress(userId, questionId, status) {
    if (!questionId) {
      const err = new Error('Question ID is required.');
      err.status = 400;
      throw err;
    }

    const normalizedStatus =
      status === PROGRESS_STATUS.SOLVED ? PROGRESS_STATUS.SOLVED : PROGRESS_STATUS.UNSOLVED;

    return progressRepository.setProgress(userId, questionId, normalizedStatus);
  }
}

module.exports = new ProgressService();
