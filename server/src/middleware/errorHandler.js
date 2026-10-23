// Centralized error handler
const config = require('../config/env');

function errorHandler(err, req, res, next) {
  const status = err.status || 500;
  const message = err.message || 'Internal Server Error';

  // Log error with context, masking any credentials
  const logPayload = {
    timestamp: new Date().toISOString(),
    method: req.method,
    path: req.originalUrl,
    status,
    message,
    code: err.code,
  };

  if (status >= 500) {
    console.error('Server error:', logPayload, err.stack);
  } else {
    console.warn('Client warning:', logPayload);
  }

  res.status(status).json({
    error: err.code || err.name || 'ServerError',
    message: err.message || message,
  });
}

module.exports = errorHandler;
