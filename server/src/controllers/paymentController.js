const paymentService = require('../services/paymentService');
const config = require('../config/env');

class PaymentController {
  getConfig(req, res) {
    return res.status(200).json({
      upiId: config.upi.id,
      payeeName: config.upi.payeeName,
      amountInr: config.upi.amountInr,
      amountPaise: config.upi.amountPaise,
      currency: 'INR',
    });
  }

  async submitPayment(req, res, next) {
    try {
      const { utr, screenshot } = req.body;
      const { userId, email, name } = req.user;

      const payment = await paymentService.submitPayment({
        userId,
        userEmail: email,
        userName: name,
        utr,
        screenshot,
      });

      return res.status(201).json({
        message: 'Payment reference submitted successfully. Status is pending manual administrator review.',
        payment,
      });
    } catch (err) {
      next(err);
    }
  }

  async getMyPayments(req, res, next) {
    try {
      const payments = await paymentService.getPaymentsForUser(req.user.userId);
      return res.status(200).json({ payments });
    } catch (err) {
      next(err);
    }
  }

  async listAdminPayments(req, res, next) {
    try {
      const { status } = req.query;
      const payments = await paymentService.listPaymentsForAdmin(status || null);
      return res.status(200).json({ payments });
    } catch (err) {
      next(err);
    }
  }

  async approvePayment(req, res, next) {
    try {
      const { id } = req.params;
      const adminIdentifier = req.user.email || req.user.userId;

      const result = await paymentService.approvePayment(id, adminIdentifier);
      return res.status(200).json({
        message: 'Payment verified and approved successfully. User lifetime access granted.',
        result,
      });
    } catch (err) {
      next(err);
    }
  }

  async rejectPayment(req, res, next) {
    try {
      const { id } = req.params;
      const { reason } = req.body;
      const adminIdentifier = req.user.email || req.user.userId;

      const payment = await paymentService.rejectPayment(
        id,
        reason,
        adminIdentifier
      );
      return res.status(200).json({
        message: 'Payment rejected.',
        payment,
      });
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new PaymentController();
