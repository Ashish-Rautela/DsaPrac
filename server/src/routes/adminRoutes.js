const express = require('express');
const questionController = require('../controllers/questionController');
const paymentController = require('../controllers/paymentController');
const { authenticate, requireAdmin } = require('../middleware/auth');

const router = express.Router();

// Enforce admin privileges on all admin endpoints
router.use(authenticate, requireAdmin);

// Admin Question Management
router.post('/questions', questionController.createQuestion);
router.patch('/questions/:id', questionController.updateQuestion);
router.delete('/questions/:id', questionController.deleteQuestion);

// Admin Payment Management
router.get('/payments', paymentController.listAdminPayments);
router.patch('/payments/:id/approve', paymentController.approvePayment);
router.patch('/payments/:id/reject', paymentController.rejectPayment);

module.exports = router;
