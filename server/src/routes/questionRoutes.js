const express = require('express');
const questionController = require('../controllers/questionController');
const { optionalAuthenticate } = require('../middleware/auth');

const router = express.Router();

router.get('/', optionalAuthenticate, questionController.listQuestions);
router.get('/:id', optionalAuthenticate, questionController.getQuestionById);

module.exports = router;
