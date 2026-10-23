const questionService = require('../services/questionService');

class QuestionController {
  async listQuestions(req, res, next) {
    try {
      const { search, difficulty, topic, page, limit, company } = req.query;
      const userId = req.user ? req.user.userId : null;

      const result = await questionService.listQuestions({
        userId,
        company,
        search,
        difficulty,
        topic,
        page,
        limit,
      });

      return res.status(200).json(result);
    } catch (err) {
      next(err);
    }
  }

  async getQuestionById(req, res, next) {
    try {
      const { id } = req.params;
      const userId = req.user ? req.user.userId : null;
      const { company } = req.query;

      const question = await questionService.getQuestionById(id, userId, company);
      return res.status(200).json({ question });
    } catch (err) {
      next(err);
    }
  }

  async createQuestion(req, res, next) {
    try {
      const question = await questionService.createQuestion(req.body);
      return res.status(201).json({
        message: 'Question created successfully.',
        question,
      });
    } catch (err) {
      next(err);
    }
  }

  async updateQuestion(req, res, next) {
    try {
      const { id } = req.params;
      const question = await questionService.updateQuestion(id, req.body);
      return res.status(200).json({
        message: 'Question updated successfully.',
        question,
      });
    } catch (err) {
      next(err);
    }
  }

  async deleteQuestion(req, res, next) {
    try {
      const { id } = req.params;
      await questionService.deleteQuestion(id);
      return res.status(200).json({
        message: 'Question deleted successfully.',
        questionId: id,
      });
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new QuestionController();
