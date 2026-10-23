const jwt = require('jsonwebtoken');
const config = require('../config/env');
const userRepository = require('../repositories/userRepository');
const { ROLES } = require('../models/entities');

function extractToken(req) {
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer ')
  ) {
    return req.headers.authorization.split(' ')[1];
  }
  if (req.cookies && req.cookies.token) {
    return req.cookies.token;
  }
  return null;
}

async function authenticate(req, res, next) {
  const token = extractToken(req);

  if (!token) {
    return res.status(401).json({
      error: 'Unauthorized',
      message: 'Authentication token is required.',
    });
  }

  try {
    const decoded = jwt.verify(token, config.jwtSecret);
    // Fetch live user status to ensure account is active and check fresh role
    const user = await userRepository.findById(decoded.userId);

    if (!user) {
      return res.status(401).json({
        error: 'Unauthorized',
        message: 'User account not found.',
      });
    }

    req.user = {
      userId: user.userId,
      email: user.email,
      name: user.name,
      role: user.role,
      hasLifetimeAccess: Boolean(user.hasLifetimeAccess),
    };

    next();
  } catch (err) {
    return res.status(401).json({
      error: 'Unauthorized',
      message: 'Invalid or expired authentication token.',
    });
  }
}

async function optionalAuthenticate(req, res, next) {
  const token = extractToken(req);

  if (!token) {
    req.user = null;
    return next();
  }

  try {
    const decoded = jwt.verify(token, config.jwtSecret);
    const user = await userRepository.findById(decoded.userId);
    if (user) {
      req.user = {
        userId: user.userId,
        email: user.email,
        name: user.name,
        role: user.role,
        hasLifetimeAccess: Boolean(user.hasLifetimeAccess),
      };
    } else {
      req.user = null;
    }
  } catch (err) {
    req.user = null;
  }

  next();
}

function requireAdmin(req, res, next) {
  if (!req.user) {
    return res.status(401).json({
      error: 'Unauthorized',
      message: 'Authentication required.',
    });
  }

  if (req.user.role !== ROLES.ADMIN) {
    return res.status(403).json({
      error: 'Forbidden',
      message: 'Administrative privileges required for this action.',
    });
  }

  next();
}

module.exports = {
  extractToken,
  authenticate,
  optionalAuthenticate,
  requireAdmin,
};
