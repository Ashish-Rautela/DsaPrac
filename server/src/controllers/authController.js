const authService = require('../services/authService');
const config = require('../config/env');

const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: config.nodeEnv === 'production',
  sameSite: config.nodeEnv === 'production' ? 'none' : 'lax',
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
};

class AuthController {
  async register(req, res, next) {
    try {
      const { name, email, password } = req.body;
      const { user, token } = await authService.register({ name, email, password });

      res.cookie('token', token, COOKIE_OPTIONS);
      return res.status(201).json({
        message: 'Registration successful.',
        user,
        token,
      });
    } catch (err) {
      next(err);
    }
  }

  async login(req, res, next) {
    try {
      const { email, password } = req.body;
      const { user, token } = await authService.login({ email, password });

      res.cookie('token', token, COOKIE_OPTIONS);
      return res.status(200).json({
        message: 'Login successful.',
        user,
        token,
      });
    } catch (err) {
      next(err);
    }
  }

  async logout(req, res) {
    res.clearCookie('token', COOKIE_OPTIONS);
    return res.status(200).json({
      message: 'Successfully logged out.',
    });
  }

  async me(req, res, next) {
    try {
      // req.user populated by authenticate middleware
      const user = await authService.getMe(req.user.userId);
      return res.status(200).json({
        user,
      });
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new AuthController();
