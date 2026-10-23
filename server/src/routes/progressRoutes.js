const express = require('express');
const progressController = require('../controllers/progressController');
const { authenticate } = require('../middleware/auth');

const router = express.Router();

router.get('/', authenticate, progressController.getMyProgress);
router.put('/:questionId', authenticate, progressController.updateQuestionProgress);

module.exports = router;
