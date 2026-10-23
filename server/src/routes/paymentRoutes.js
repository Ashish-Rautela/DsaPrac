const express = require('express');
const paymentController = require('../controllers/paymentController');
const { authenticate } = require('../middleware/auth');
const { paymentLimiter } = require('../middleware/rateLimiter');

const router = express.Router();

router.get('/config', paymentController.getConfig);
router.post('/', authenticate, paymentLimiter, paymentController.submitPayment);
router.get('/me', authenticate, paymentController.getMyPayments);

module.exports = router;
