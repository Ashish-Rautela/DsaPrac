const config = require('../config/env');
const {
  docClient,
  GetCommand,
  UpdateCommand,
  TransactWriteCommand,
} = require('../config/dynamodb');
const { userKeys, ROLES } = require('../models/entities');

class UserRepository {
  constructor(tableName = config.tables.users) {
    this.tableName = tableName;
  }

  async createUser({
    userId,
    name,
    email,
    emailNormalized,
    passwordHash,
    role = ROLES.USER,
    hasLifetimeAccess = false,
    activeSessionId = null,
  }) {
    const now = new Date().toISOString();
    const profileItem = {
      ...userKeys.profile(userId),
      userId,
      name,
      email,
      emailNormalized,
      passwordHash,
      role,
      hasLifetimeAccess,
      activeSessionId,
      createdAt: now,
      updatedAt: now,
    };

    const emailLookupItem = {
      ...userKeys.emailLookup(emailNormalized),
      userId,
      emailNormalized,
      createdAt: now,
    };

    try {
      await docClient.send(
        new TransactWriteCommand({
          TransactItems: [
            {
              Put: {
                TableName: this.tableName,
                Item: profileItem,
                ConditionExpression: 'attribute_not_exists(PK)',
              },
            },
            {
              Put: {
                TableName: this.tableName,
                Item: emailLookupItem,
                ConditionExpression: 'attribute_not_exists(PK)',
              },
            },
          ],
        })
      );

      const { passwordHash: _, ...safeProfile } = profileItem;
      return safeProfile;
    } catch (err) {
      if (
        err.name === 'TransactionCanceledException' ||
        err.name === 'ConditionalCheckFailedException'
      ) {
        const customErr = new Error('Email address is already registered');
        customErr.code = 'EMAIL_ALREADY_EXISTS';
        customErr.status = 409;
        throw customErr;
      }
      throw err;
    }
  }

  async findById(userId) {
    const result = await docClient.send(
      new GetCommand({
        TableName: this.tableName,
        Key: userKeys.profile(userId),
        ConsistentRead: true,
      })
    );
    return result.Item || null;
  }

  async findByEmail(emailNormalized) {
    // 1. Check email lookup item
    const lookup = await docClient.send(
      new GetCommand({
        TableName: this.tableName,
        Key: userKeys.emailLookup(emailNormalized),
        ConsistentRead: true,
      })
    );

    if (!lookup.Item || !lookup.Item.userId) {
      return null;
    }

    // 2. Fetch user profile
    return this.findById(lookup.Item.userId);
  }

  async updateActiveSession(userId, activeSessionId) {
    const now = new Date().toISOString();
    const result = await docClient.send(
      new UpdateCommand({
        TableName: this.tableName,
        Key: userKeys.profile(userId),
        UpdateExpression: 'SET #activeSessionId = :sid, #updatedAt = :now',
        ExpressionAttributeNames: {
          '#activeSessionId': 'activeSessionId',
          '#updatedAt': 'updatedAt',
        },
        ExpressionAttributeValues: {
          ':sid': activeSessionId,
          ':now': now,
        },
        ReturnValues: 'ALL_NEW',
      })
    );
    return result.Attributes;
  }

  async updateEntitlement(userId, hasLifetimeAccess) {
    const now = new Date().toISOString();
    const result = await docClient.send(
      new UpdateCommand({
        TableName: this.tableName,
        Key: userKeys.profile(userId),
        UpdateExpression: 'SET #hasLifetimeAccess = :val, #updatedAt = :now',
        ExpressionAttributeNames: {
          '#hasLifetimeAccess': 'hasLifetimeAccess',
          '#updatedAt': 'updatedAt',
        },
        ExpressionAttributeValues: {
          ':val': hasLifetimeAccess,
          ':now': now,
        },
        ReturnValues: 'ALL_NEW',
      })
    );
    return result.Attributes;
  }
}

module.exports = new UserRepository();
