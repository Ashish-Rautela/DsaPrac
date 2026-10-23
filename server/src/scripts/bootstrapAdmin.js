const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const { docClient, PutCommand, GetCommand, UpdateCommand } = require('../config/dynamodb');
const config = require('../config/env');
const { userKeys, ROLES } = require('../models/entities');

async function bootstrapAdmin({
  email = process.env.ADMIN_EMAIL || 'admin@visaprep.internal',
  password = process.env.ADMIN_PASSWORD || 'AdminVisaPrep2026!',
  name = process.env.ADMIN_NAME || 'Platform Administrator',
} = {}) {
  const emailNormalized = email.trim().toLowerCase();
  console.log(`[Admin Bootstrap] Processing admin initialization for: ${emailNormalized}`);

  // 1. Check if email already exists
  const lookup = await docClient.send(
    new GetCommand({
      TableName: config.tables.users,
      Key: userKeys.emailLookup(emailNormalized),
    })
  );

  const now = new Date().toISOString();

  if (lookup.Item && lookup.Item.userId) {
    const userId = lookup.Item.userId;
    console.log(`[Admin Bootstrap] Existing user found (userId: ${userId}). Promoting to ADMIN role...`);

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    await docClient.send(
      new UpdateCommand({
        TableName: config.tables.users,
        Key: userKeys.profile(userId),
        UpdateExpression:
          'SET #role = :role, #hasLifetimeAccess = :access, #passwordHash = :pw, #updatedAt = :now',
        ExpressionAttributeNames: {
          '#role': 'role',
          '#hasLifetimeAccess': 'hasLifetimeAccess',
          '#passwordHash': 'passwordHash',
          '#updatedAt': 'updatedAt',
        },
        ExpressionAttributeValues: {
          ':role': ROLES.ADMIN,
          ':access': true,
          ':pw': passwordHash,
          ':now': now,
        },
      })
    );

    console.log(`[Admin Bootstrap] User ${emailNormalized} is now an administrator.`);
    return { userId, email: emailNormalized, role: ROLES.ADMIN };
  }

  // 2. Create fresh admin account
  const userId = crypto.randomUUID();
  const salt = await bcrypt.genSalt(10);
  const passwordHash = await bcrypt.hash(password, salt);

  const profileItem = {
    ...userKeys.profile(userId),
    userId,
    name,
    email: email.trim(),
    emailNormalized,
    passwordHash,
    role: ROLES.ADMIN,
    hasLifetimeAccess: true,
    createdAt: now,
    updatedAt: now,
  };

  const emailLookupItem = {
    ...userKeys.emailLookup(emailNormalized),
    userId,
    emailNormalized,
    createdAt: now,
  };

  await docClient.send(
    new PutCommand({
      TableName: config.tables.users,
      Item: profileItem,
    })
  );

  await docClient.send(
    new PutCommand({
      TableName: config.tables.users,
      Item: emailLookupItem,
    })
  );

  console.log(`[Admin Bootstrap] Admin created successfully. ID: ${userId}, Email: ${emailNormalized}`);
  return { userId, email: emailNormalized, role: ROLES.ADMIN };
}

if (require.main === module) {
  // Parse command line arguments if provided: node bootstrapAdmin.js --email=foo@bar.com --password=secret
  const args = process.argv.slice(2);
  const opts = {};
  for (const arg of args) {
    if (arg.startsWith('--email=')) opts.email = arg.split('=')[1];
    if (arg.startsWith('--password=')) opts.password = arg.split('=')[1];
    if (arg.startsWith('--name=')) opts.name = arg.split('=')[1];
  }

  bootstrapAdmin(opts)
    .then(() => process.exit(0))
    .catch((err) => {
      console.error('[Admin Bootstrap Error]', err);
      process.exit(1);
    });
}

module.exports = { bootstrapAdmin };
