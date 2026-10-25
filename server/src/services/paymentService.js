const crypto = require('crypto');
const config = require('../config/env');
const paymentRepository = require('../repositories/paymentRepository');
const userRepository = require('../repositories/userRepository');
const { PAYMENT_STATUS } = require('../models/entities');
const { validatePaymentSubmission } = require('../validators/schemas');
const s3Service = require('./s3Service');

class PaymentService {
  async submitPayment({ userId, userEmail, userName, utr, screenshot }) {
    const validation = validatePaymentSubmission({ utr, screenshot });
    if (!validation.isValid) {
      const err = new Error(validation.errors.join(' '));
      err.status = 400;
      err.code = 'VALIDATION_FAILED';
      throw err;
    }

    // 1. Check if user already has lifetime access
    const user = await userRepository.findById(userId);
    if (!user) {
      const err = new Error('User not found.');
      err.status = 404;
      err.code = 'USER_NOT_FOUND';
      throw err;
    }

    if (user.hasLifetimeAccess) {
      const err = new Error('You already have lifetime access to the Visa OA platform.');
      err.status = 400;
      err.code = 'ALREADY_ACTIVE_ENTITLEMENT';
      throw err;
    }

    // 2. Prevent duplicate active pending submissions by this user
    const userPayments = await paymentRepository.listByUser(userId);
    const existingPending = userPayments.find((p) => p.status === PAYMENT_STATUS.PENDING);
    if (existingPending) {
      const err = new Error(
        `You already have a pending payment submission (UTR: ${existingPending.utr}). Please wait for administrator verification.`
      );
      err.status = 409;
      err.code = 'PENDING_SUBMISSION_EXISTS';
      throw err;
    }

    // 3. Generate payment ID and upload screenshot to S3 if provided
    const paymentId = crypto.randomUUID();
    let screenshotUrl = null;
    if (validation.data.screenshot) {
      screenshotUrl = await s3Service.uploadScreenshot({
        base64Data: validation.data.screenshot,
        userId,
        paymentId,
      });
    }

    // 4. Atomically create pending payment & reserve UTR
    return paymentRepository.createPendingPayment({
      paymentId,
      userId,
      userEmail: userEmail || user.email,
      userName: userName || user.name,
      utr: validation.data.utr,
      screenshot: screenshotUrl,
    });
  }

  async getPaymentsForUser(userId) {
    return paymentRepository.listByUser(userId);
  }

  async listPaymentsForAdmin(options = null) {
    let status = null;
    let page = null;
    let limit = null;

    if (options && typeof options === 'object') {
      status = options.status || null;
      page = options.page || null;
      limit = options.limit || null;
    } else if (typeof options === 'string') {
      status = options;
    }

    const allItems = await paymentRepository.listAll(status);
    const total = allItems.length;

    let approvedCount;
    if (status === PAYMENT_STATUS.APPROVED) {
      approvedCount = total;
    } else {
      approvedCount = await paymentRepository.countByStatus(PAYMENT_STATUS.APPROVED);
    }

    if (page && limit) {
      const pageNum = Math.max(1, parseInt(page, 10));
      const limitNum = Math.max(1, parseInt(limit, 10));
      const totalPages = Math.max(1, Math.ceil(total / limitNum));
      const startIndex = (pageNum - 1) * limitNum;
      const paginatedItems = allItems.slice(startIndex, startIndex + limitNum);

      return {
        payments: paginatedItems,
        total,
        page: pageNum,
        limit: limitNum,
        totalPages,
        approvedCount,
      };
    }

    return {
      payments: allItems,
      total,
      approvedCount,
    };
  }

  async approvePayment(paymentId, adminIdentifier) {
    const payment = await paymentRepository.findById(paymentId);
    if (!payment) {
      const err = new Error('Payment record not found.');
      err.status = 404;
      err.code = 'PAYMENT_NOT_FOUND';
      throw err;
    }

    if (payment.status !== PAYMENT_STATUS.PENDING) {
      const err = new Error(`Payment cannot be approved because its current status is '${payment.status}'.`);
      err.status = 409;
      err.code = 'INVALID_PAYMENT_STATE';
      throw err;
    }

    // Atomically approve payment and unlock user lifetime access
    return paymentRepository.approvePaymentAtomically(
      paymentId,
      payment.userId,
      adminIdentifier
    );
  }

  async rejectPayment(paymentId, rejectionReason, adminIdentifier) {
    const payment = await paymentRepository.findById(paymentId);
    if (!payment) {
      const err = new Error('Payment record not found.');
      err.status = 404;
      err.code = 'PAYMENT_NOT_FOUND';
      throw err;
    }

    if (payment.status !== PAYMENT_STATUS.PENDING) {
      const err = new Error(`Payment cannot be rejected because its current status is '${payment.status}'.`);
      err.status = 409;
      err.code = 'INVALID_PAYMENT_STATE';
      throw err;
    }

    return paymentRepository.rejectPayment(
      paymentId,
      rejectionReason,
      adminIdentifier
    );
  }
}

module.exports = new PaymentService();
