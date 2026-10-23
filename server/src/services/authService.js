const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('../config/env');
const userRepository = require('../repositories/userRepository');
const { ROLES } = require('../models/entities');
const { validateRegistration, validateLogin } = require('../validators/schemas');

// Dummy hash for constant-time comparison on nonexistent user (account enumeration defense)
const DUMMY_HASH = '$2a$10$abcdefghijklmnopqrstuuABCDEFGHIJKLMNOPQRSTUVWXYZ01234';

class AuthService {
  generateToken(user) {
    return jwt.sign(
      {
        userId: user.userId,
        email: user.email,
        role: user.role,
      },
      config.jwtSecret,
      { expiresIn: config.jwtExpiresIn }
    );
  }

  async register({ name, email, password }) {
    const validation = validateRegistration({ name, email, password });
    if (!validation.isValid) {
      const err = new Error(validation.errors.join(' '));
      err.status = 400;
      err.code = 'VALIDATION_FAILED';
      throw err;
    }

    const { emailNormalized } = validation.data;
    const userId = crypto.randomUUID();
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const userProfile = await userRepository.createUser({
      userId,
      name: validation.data.name,
      email: validation.data.email,
      emailNormalized,
      passwordHash,
      role: ROLES.USER,
      hasLifetimeAccess: false,
    });

    const token = this.generateToken(userProfile);
    return { user: userProfile, token };
  }

  async login({ email, password }) {
    const validation = validateLogin({ email, password });
    if (!validation.isValid) {
      const err = new Error(validation.errors.join(' '));
      err.status = 400;
      err.code = 'VALIDATION_FAILED';
      throw err;
    }

    const { emailNormalized } = validation.data;
    const user = await userRepository.findByEmail(emailNormalized);

    const hashToCompare = user ? user.passwordHash : DUMMY_HASH;
    const isPasswordValid = await bcrypt.compare(password, hashToCompare);

    if (!user || !isPasswordValid) {
      const err = new Error('Invalid email or password.');
      err.status = 401;
      err.code = 'INVALID_CREDENTIALS';
      throw err;
    }

    const { passwordHash: _, ...safeUser } = user;
    const token = this.generateToken(safeUser);
    return { user: safeUser, token };
  }

  async getMe(userId) {
    const user = await userRepository.findById(userId);
    if (!user) {
      const err = new Error('User not found.');
      err.status = 404;
      err.code = 'USER_NOT_FOUND';
      throw err;
    }

    const { passwordHash: _, ...safeUser } = user;
    return safeUser;
  }
}

module.exports = new AuthService();
