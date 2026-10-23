const progressService = require('../services/progressService');

class ProgressController {
  async getMyProgress(req, res, next) {
    try {
      const progress = await progressService.getUserProgress(req.user.userId);
      return res.status(200).json({ progress });
    } catch (err) {
      next(err);
    }
  }

  async updateQuestionProgress(req, res, next) {
    try {
      const { questionId } = req.params;
      const { status } = req.body;

      const record = await progressService.setQuestionProgress(
        req.user.userId,
        questionId,
        status
      );

      return res.status(200).json({
        message: 'Question progress updated.',
        progress: record,
      });
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new ProgressController();
