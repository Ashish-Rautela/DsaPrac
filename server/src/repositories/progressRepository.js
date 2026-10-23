const config = require('../config/env');
const {
  docClient,
  PutCommand,
  QueryCommand,
} = require('../config/dynamodb');
const { progressKeys, PROGRESS_STATUS } = require('../models/entities');

class ProgressRepository {
  constructor(tableName = config.tables.progress) {
    this.tableName = tableName;
  }

  async setProgress(userId, questionId, status) {
    const validStatus =
      status === PROGRESS_STATUS.SOLVED
        ? PROGRESS_STATUS.SOLVED
        : PROGRESS_STATUS.UNSOLVED;
    const now = new Date().toISOString();

    const item = {
      ...progressKeys.item(userId, questionId),
      userId,
      questionId,
      status: validStatus,
      updatedAt: now,
    };

    await docClient.send(
      new PutCommand({
        TableName: this.tableName,
        Item: item,
      })
    );

    return item;
  }

  async getProgressForUser(userId) {
    const result = await docClient.send(
      new QueryCommand({
        TableName: this.tableName,
        KeyConditionExpression: '#pk = :pk',
        ExpressionAttributeNames: {
          '#pk': 'PK',
        },
        ExpressionAttributeValues: {
          ':pk': progressKeys.userPK(userId),
        },
      })
    );

    const items = result.Items || [];
    // Map to a dictionary: { [questionId]: 'solved' | 'unsolved' }
    const progressMap = {};
    for (const item of items) {
      progressMap[item.questionId] = item.status;
    }
    return progressMap;
  }
}

module.exports = new ProgressRepository();
