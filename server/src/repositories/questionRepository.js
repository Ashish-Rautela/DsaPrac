const config = require('../config/env');
const {
  docClient,
  GetCommand,
  PutCommand,
  UpdateCommand,
  DeleteCommand,
  QueryCommand,
} = require('../config/dynamodb');
const { questionKeys, DEFAULT_COMPANY } = require('../models/entities');

class QuestionRepository {
  constructor(tableName = config.tables.questions) {
    this.tableName = tableName;
  }

  async createQuestion({
    questionId,
    title,
    leetcodeUrl,
    difficulty,
    topics = [],
    description = '',
    isPremium = true,
    company = DEFAULT_COMPANY,
  }) {
    const now = new Date().toISOString();
    const item = {
      ...questionKeys.item(questionId, company),
      questionId,
      company: company.toUpperCase(),
      title,
      leetcodeUrl,
      difficulty,
      topics,
      description,
      isPremium: Boolean(isPremium),
      createdAt: now,
      updatedAt: now,
    };

    await docClient.send(
      new PutCommand({
        TableName: this.tableName,
        Item: item,
        ConditionExpression: 'attribute_not_exists(PK) AND attribute_not_exists(SK)',
      })
    );

    return item;
  }

  async getById(questionId, company = DEFAULT_COMPANY) {
    const result = await docClient.send(
      new GetCommand({
        TableName: this.tableName,
        Key: questionKeys.item(questionId, company),
        ConsistentRead: true,
      })
    );
    return result.Item || null;
  }

  async listCompanyQuestions(company = DEFAULT_COMPANY) {
    // Query bounded by Company Partition Key
    const result = await docClient.send(
      new QueryCommand({
        TableName: this.tableName,
        KeyConditionExpression: '#pk = :pk',
        ExpressionAttributeNames: {
          '#pk': 'PK',
        },
        ExpressionAttributeValues: {
          ':pk': questionKeys.companyPK(company),
        },
      })
    );

    return result.Items || [];
  }

  async updateQuestion(questionId, updates, company = DEFAULT_COMPANY) {
    const now = new Date().toISOString();
    const allowed = ['title', 'leetcodeUrl', 'difficulty', 'topics', 'description', 'isPremium'];
    const expressions = ['#updatedAt = :now'];
    const names = { '#updatedAt': 'updatedAt' };
    const values = { ':now': now };

    for (const key of allowed) {
      if (updates[key] !== undefined) {
        expressions.push(`#${key} = :${key}`);
        names[`#${key}`] = key;
        values[`:${key}`] = updates[key];
      }
    }

    const result = await docClient.send(
      new UpdateCommand({
        TableName: this.tableName,
        Key: questionKeys.item(questionId, company),
        UpdateExpression: `SET ${expressions.join(', ')}`,
        ConditionExpression: 'attribute_exists(PK) AND attribute_exists(SK)',
        ExpressionAttributeNames: names,
        ExpressionAttributeValues: values,
        ReturnValues: 'ALL_NEW',
      })
    );

    return result.Attributes;
  }

  async deleteQuestion(questionId, company = DEFAULT_COMPANY) {
    await docClient.send(
      new DeleteCommand({
        TableName: this.tableName,
        Key: questionKeys.item(questionId, company),
        ConditionExpression: 'attribute_exists(PK) AND attribute_exists(SK)',
      })
    );
    return { success: true, questionId };
  }
}

module.exports = new QuestionRepository();
