const config = require('../config/env');
const {
  docClient,
  GetCommand,
  UpdateCommand,
  QueryCommand,
  ScanCommand,
  TransactWriteCommand,
} = require('../config/dynamodb');
const { paymentKeys, userKeys, PAYMENT_STATUS } = require('../models/entities');

class PaymentRepository {
  constructor(
    paymentsTable = config.tables.payments,
    usersTable = config.tables.users
  ) {
    this.paymentsTable = paymentsTable;
    this.usersTable = usersTable;
  }

  async findById(paymentId) {
    const result = await docClient.send(
      new GetCommand({
        TableName: this.paymentsTable,
        Key: paymentKeys.item(paymentId),
        ConsistentRead: true,
      })
    );
    return result.Item || null;
  }

  async findByUtr(utrNormalized) {
    const result = await docClient.send(
      new GetCommand({
        TableName: this.paymentsTable,
        Key: paymentKeys.utrLookup(utrNormalized),
        ConsistentRead: true,
      })
    );
    return result.Item || null;
  }

  async createPendingPayment({
    paymentId,
    userId,
    userEmail,
    userName,
    utr,
    screenshot,
  }) {
    const now = new Date().toISOString();
    const utrNormalized = utr.trim().toUpperCase();

    const paymentItem = {
      ...paymentKeys.item(paymentId),
      paymentId,
      userId,
      userEmail,
      userName,
      amountPaise: config.upi.amountPaise,
      currency: 'INR',
      provider: 'manual_upi',
      utr: utrNormalized,
      screenshot: screenshot || null,
      status: PAYMENT_STATUS.PENDING,
      submittedAt: now,
      reviewedAt: null,
      reviewedBy: null,
      rejectionReason: null,
      updatedAt: now,
    };

    const utrLookupItem = {
      ...paymentKeys.utrLookup(utrNormalized),
      paymentId,
      userId,
      submittedAt: now,
    };

    try {
      await docClient.send(
        new TransactWriteCommand({
          TransactItems: [
            {
              Put: {
                TableName: this.paymentsTable,
                Item: paymentItem,
                ConditionExpression: 'attribute_not_exists(PK)',
              },
            },
            {
              Put: {
                TableName: this.paymentsTable,
                Item: utrLookupItem,
                ConditionExpression: 'attribute_not_exists(PK)',
              },
            },
          ],
        })
      );

      return paymentItem;
    } catch (err) {
      if (
        err.name === 'TransactionCanceledException' ||
        err.name === 'ConditionalCheckFailedException'
      ) {
        const error = new Error('This UTR has already been submitted and claimed.');
        error.code = 'UTR_ALREADY_EXISTS';
        error.status = 409;
        throw error;
      }
      throw err;
    }
  }

  async listByUser(userId) {
    try {
      // Try GSI first
      const result = await docClient.send(
        new QueryCommand({
          TableName: this.paymentsTable,
          IndexName: 'UserPaymentsIndex',
          KeyConditionExpression: 'userId = :userId',
          ExpressionAttributeValues: {
            ':userId': userId,
          },
          ScanIndexForward: false,
        })
      );
      return result.Items || [];
    } catch (err) {
      // Fallback scan if index not created in local mock
      const result = await docClient.send(
        new ScanCommand({
          TableName: this.paymentsTable,
        })
      );
      const items = (result.Items || []).filter(
        (item) => item.userId === userId && item.PK && item.PK.startsWith('PAYMENT#')
      );
      items.sort((a, b) => new Date(b.submittedAt) - new Date(a.submittedAt));
      return items;
    }
  }

  async listAll(statusFilter = null) {
    if (statusFilter) {
      try {
        let allItems = [];
        let lastEvaluatedKey = undefined;

        do {
          const result = await docClient.send(
            new QueryCommand({
              TableName: this.paymentsTable,
              IndexName: 'StatusPaymentsIndex',
              KeyConditionExpression: '#status = :status',
              ExpressionAttributeNames: {
                '#status': 'status',
              },
              ExpressionAttributeValues: {
                ':status': statusFilter,
              },
              ScanIndexForward: false,
              ExclusiveStartKey: lastEvaluatedKey,
            })
          );

          if (result.Items && result.Items.length > 0) {
            allItems.push(...result.Items);
          }
          lastEvaluatedKey = result.LastEvaluatedKey;
        } while (lastEvaluatedKey);

        allItems.sort((a, b) => new Date(b.submittedAt) - new Date(a.submittedAt));
        return allItems;
      } catch (err) {
        // Fallback scan
      }
    }

    let allItems = [];
    let lastEvaluatedKey = undefined;

    do {
      const result = await docClient.send(
        new ScanCommand({
          TableName: this.paymentsTable,
          ExclusiveStartKey: lastEvaluatedKey,
        })
      );

      if (result.Items && result.Items.length > 0) {
        allItems.push(...result.Items);
      }
      lastEvaluatedKey = result.LastEvaluatedKey;
    } while (lastEvaluatedKey);

    let items = allItems.filter(
      (item) => item.PK && item.PK.startsWith('PAYMENT#')
    );

    if (statusFilter) {
      items = items.filter((item) => item.status === statusFilter);
    }

    items.sort((a, b) => new Date(b.submittedAt) - new Date(a.submittedAt));
    return items;
  }

  async countByStatus(status) {
    if (!status) return 0;
    try {
      let count = 0;
      let lastEvaluatedKey = undefined;

      do {
        const result = await docClient.send(
          new QueryCommand({
            TableName: this.paymentsTable,
            IndexName: 'StatusPaymentsIndex',
            KeyConditionExpression: '#status = :status',
            ExpressionAttributeNames: {
              '#status': 'status',
            },
            ExpressionAttributeValues: {
              ':status': status,
            },
            Select: 'COUNT',
            ExclusiveStartKey: lastEvaluatedKey,
          })
        );
        count += (result.Count || 0);
        lastEvaluatedKey = result.LastEvaluatedKey;
      } while (lastEvaluatedKey);

      return count;
    } catch (err) {
      const items = await this.listAll(status);
      return items.length;
    }
  }

  async approvePaymentAtomically(paymentId, userId, adminIdentifier) {
    const now = new Date().toISOString();

    try {
      await docClient.send(
        new TransactWriteCommand({
          TransactItems: [
            {
              Update: {
                TableName: this.paymentsTable,
                Key: paymentKeys.item(paymentId),
                UpdateExpression:
                  'SET #status = :approved, #reviewedAt = :now, #reviewedBy = :adminId, #updatedAt = :now',
                ConditionExpression:
                  'attribute_exists(PK) AND #status = :pending',
                ExpressionAttributeNames: {
                  '#status': 'status',
                  '#reviewedAt': 'reviewedAt',
                  '#reviewedBy': 'reviewedBy',
                  '#updatedAt': 'updatedAt',
                },
                ExpressionAttributeValues: {
                  ':approved': PAYMENT_STATUS.APPROVED,
                  ':pending': PAYMENT_STATUS.PENDING,
                  ':now': now,
                  ':adminId': adminIdentifier,
                },
              },
            },
            {
              Update: {
                TableName: this.usersTable,
                Key: userKeys.profile(userId),
                UpdateExpression:
                  'SET #hasLifetimeAccess = :trueVal, #updatedAt = :now',
                ConditionExpression: 'attribute_exists(PK)',
                ExpressionAttributeNames: {
                  '#hasLifetimeAccess': 'hasLifetimeAccess',
                  '#updatedAt': 'updatedAt',
                },
                ExpressionAttributeValues: {
                  ':trueVal': true,
                  ':now': now,
                },
              },
            },
          ],
        })
      );

      return {
        paymentId,
        userId,
        status: PAYMENT_STATUS.APPROVED,
        reviewedAt: now,
        reviewedBy: adminIdentifier,
      };
    } catch (err) {
      if (
        err.name === 'TransactionCanceledException' ||
        err.name === 'ConditionalCheckFailedException'
      ) {
        const error = new Error(
          'Payment approval failed: Payment is not in pending state or does not exist.'
        );
        error.code = 'INVALID_PAYMENT_STATE';
        error.status = 409;
        throw error;
      }
      throw err;
    }
  }

  async rejectPayment(paymentId, rejectionReason, adminIdentifier) {
    const now = new Date().toISOString();

    try {
      const result = await docClient.send(
        new UpdateCommand({
          TableName: this.paymentsTable,
          Key: paymentKeys.item(paymentId),
          UpdateExpression:
            'SET #status = :rejected, #rejectionReason = :reason, #reviewedAt = :now, #reviewedBy = :adminId, #updatedAt = :now',
          ConditionExpression: 'attribute_exists(PK) AND #status = :pending',
          ExpressionAttributeNames: {
            '#status': 'status',
            '#rejectionReason': 'rejectionReason',
            '#reviewedAt': 'reviewedAt',
            '#reviewedBy': 'reviewedBy',
            '#updatedAt': 'updatedAt',
          },
          ExpressionAttributeValues: {
            ':rejected': PAYMENT_STATUS.REJECTED,
            ':pending': PAYMENT_STATUS.PENDING,
            ':reason': rejectionReason || 'Payment verification could not be confirmed.',
            ':now': now,
            ':adminId': adminIdentifier,
          },
          ReturnValues: 'ALL_NEW',
        })
      );

      return result.Attributes;
    } catch (err) {
      if (err.name === 'ConditionalCheckFailedException') {
        const error = new Error(
          'Payment rejection failed: Payment is not in pending state or does not exist.'
        );
        error.code = 'INVALID_PAYMENT_STATE';
        error.status = 409;
        throw error;
      }
      throw err;
    }
  }
}

module.exports = new PaymentRepository();
