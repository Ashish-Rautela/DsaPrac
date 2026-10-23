// Input validation helpers
// ponytail: lightweight validation without hefty external schema libraries

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const UTR_REGEX = /^[A-Za-z0-9]{8,24}$/;

function validateRegistration(body) {
  const errors = [];
  const { name, email, password } = body || {};

  if (!name || typeof name !== 'string' || name.trim().length < 2) {
    errors.push('Name must be at least 2 characters long.');
  }

  if (!email || typeof email !== 'string' || !EMAIL_REGEX.test(email.trim())) {
    errors.push('A valid email address is required.');
  }

  if (!password || typeof password !== 'string' || password.length < 8) {
    errors.push('Password must be at least 8 characters long.');
  }

  return {
    isValid: errors.length === 0,
    errors,
    data: {
      name: name ? name.trim() : '',
      email: email ? email.trim() : '',
      emailNormalized: email ? email.trim().toLowerCase() : '',
      password: password || '',
    },
  };
}

function validateLogin(body) {
  const errors = [];
  const { email, password } = body || {};

  if (!email || typeof email !== 'string' || !EMAIL_REGEX.test(email.trim())) {
    errors.push('A valid email address is required.');
  }

  if (!password || typeof password !== 'string' || !password) {
    errors.push('Password is required.');
  }

  return {
    isValid: errors.length === 0,
    errors,
    data: {
      emailNormalized: email ? email.trim().toLowerCase() : '',
      password: password || '',
    },
  };
}

function validatePaymentSubmission(body) {
  const errors = [];
  const { utr, screenshot } = body || {};

  if (!utr || typeof utr !== 'string' || !UTR_REGEX.test(utr.trim())) {
    errors.push('A valid 8 to 24 character alphanumeric UPI Transaction Reference (UTR) is required.');
  }

  let cleanScreenshot = null;
  if (screenshot) {
    if (typeof screenshot !== 'string' || screenshot.trim().length < 10) {
      errors.push('Invalid screenshot format.');
    } else {
      cleanScreenshot = screenshot.trim();
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
    data: {
      utr: utr ? utr.trim().toUpperCase() : '',
      screenshot: cleanScreenshot,
    },
  };
}

function validateQuestionInput(body) {
  const errors = [];
  const { title, difficulty, topics, description, leetcodeUrl, isPremium } = body || {};

  if (!title || typeof title !== 'string' || title.trim().length < 3) {
    errors.push('Question title must be at least 3 characters.');
  }

  const validDiffs = ['Easy', 'Medium', 'Hard'];
  if (!difficulty || !validDiffs.includes(difficulty)) {
    errors.push('Difficulty must be one of Easy, Medium, or Hard.');
  }

  if (topics && !Array.isArray(topics)) {
    errors.push('Topics must be an array of strings.');
  }

  return {
    isValid: errors.length === 0,
    errors,
    data: {
      title: title ? title.trim() : '',
      difficulty,
      topics: Array.isArray(topics) ? topics.map((t) => String(t).trim()).filter(Boolean) : [],
      description: description ? String(description).trim() : '',
      leetcodeUrl: leetcodeUrl ? String(leetcodeUrl).trim() : '',
      isPremium: Boolean(isPremium),
    },
  };
}

module.exports = {
  validateRegistration,
  validateLogin,
  validatePaymentSubmission,
  validateQuestionInput,
};
