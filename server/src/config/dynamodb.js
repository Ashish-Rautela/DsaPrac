// AWS SDK v3 DynamoDB client setup with DocumentClient
const fs = require('fs');
const path = require('path');
const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');
const {
  DynamoDBDocumentClient,
  GetCommand,
  PutCommand,
  UpdateCommand,
  DeleteCommand,
  QueryCommand,
  ScanCommand,
  TransactWriteCommand,
} = require('@aws-sdk/lib-dynamodb');
const config = require('./env');

class MockDynamoDBStore {
  constructor() {
    this.tables = new Map();
    this.dbFilePath = path.resolve(__dirname, '../../.local_db.json');
    this.isTestEnv = process.env.NODE_ENV === 'test';

    // Load persisted state if exists and not in test mode
    if (!this.isTestEnv) {
      this.loadFromDisk();
    }
  }

  loadFromDisk() {
    try {
      if (fs.existsSync(this.dbFilePath)) {
        const raw = fs.readFileSync(this.dbFilePath, 'utf-8');
        const parsed = JSON.parse(raw);
        for (const [tableName, items] of Object.entries(parsed)) {
          const tableMap = new Map();
          for (const [key, val] of Object.entries(items)) {
            tableMap.set(key, val);
          }
          this.tables.set(tableName, tableMap);
        }
      }
    } catch (err) {
      console.warn('[Mock DynamoDB] Could not load persisted data:', err.message);
    }

    // Auto-seed questions if Questions table is empty
    this.autoSeedIfEmpty();
  }

  autoSeedIfEmpty() {
    const questionsTable = this.getTable(config.tables.questions);
    if (questionsTable.size === 0) {
      try {
        const seedPath = path.resolve(__dirname, '../scripts/questionsData.json');
        if (fs.existsSync(seedPath)) {
          const qs = JSON.parse(fs.readFileSync(seedPath, 'utf-8'));
          const now = new Date().toISOString();
          for (const q of qs) {
            const key = `COMPANY#VISA##QUESTION#${q.questionId}`;
            questionsTable.set(key, {
              PK: 'COMPANY#VISA',
              SK: `QUESTION#${q.questionId}`,
              company: 'VISA',
              questionId: q.questionId,
              title: q.title,
              difficulty: q.difficulty,
              topics: q.topics || [],
              leetcodeUrl: q.leetcodeUrl || '',
              leetcodeId: q.leetcodeId || null,
              frequency: q.frequency || null,
              frequencyPercent: q.frequencyPercent || null,
              acceptancePercent: q.acceptancePercent || null,
              description: q.description || '',
              isPremium: Boolean(q.isPremium),
              createdAt: now,
              updatedAt: now,
            });
          }
          this.persistToDisk();
          console.log(`[Mock DynamoDB] Auto-seeded ${qs.length} questions into local store.`);
        }
      } catch (err) {
        console.warn('[Mock DynamoDB] Auto-seed failed:', err.message);
      }
    }
  }

  persistToDisk() {
    if (this.isTestEnv) return;
    try {
      const obj = {};
      for (const [tableName, map] of this.tables.entries()) {
        obj[tableName] = {};
        for (const [k, v] of map.entries()) {
          obj[tableName][k] = v;
        }
      }
      fs.writeFileSync(this.dbFilePath, JSON.stringify(obj, null, 2), 'utf-8');
    } catch (err) {
      // Ignore write errors
    }
  }

  getTable(tableName) {
    if (!this.tables.has(tableName)) {
      this.tables.set(tableName, new Map());
    }
    return this.tables.get(tableName);
  }

  reset() {
    this.tables.clear();
  }

  makeKey(keyObj) {
    return `${keyObj.PK}##${keyObj.SK || ''}`;
  }

  async send(command) {
    const name = command.constructor.name;
    const input = command.input;

    if (name === 'GetCommand') {
      const table = this.getTable(input.TableName);
      const key = this.makeKey(input.Key);
      const item = table.get(key);
      return { Item: item ? JSON.parse(JSON.stringify(item)) : undefined };
    }

    if (name === 'PutCommand') {
      const table = this.getTable(input.TableName);
      const key = this.makeKey({ PK: input.Item.PK, SK: input.Item.SK });

      if (input.ConditionExpression) {
        if (input.ConditionExpression.includes('attribute_not_exists(PK)') && table.has(key)) {
          const err = new Error('The conditional request failed');
          err.name = 'ConditionalCheckFailedException';
          throw err;
        }
      }

      table.set(key, JSON.parse(JSON.stringify(input.Item)));
      this.persistToDisk();
      return { Attributes: input.Item };
    }

    if (name === 'DeleteCommand') {
      const table = this.getTable(input.TableName);
      const key = this.makeKey(input.Key);
      table.delete(key);
      this.persistToDisk();
      return {};
    }

    if (name === 'UpdateCommand') {
      const table = this.getTable(input.TableName);
      const key = this.makeKey(input.Key);
      const existing = table.get(key);

      if (input.ConditionExpression) {
        if (input.ConditionExpression.includes('attribute_exists(PK)') && !existing) {
          const err = new Error('The conditional request failed');
          err.name = 'ConditionalCheckFailedException';
          throw err;
        }
        if (input.ExpressionAttributeNames && input.ExpressionAttributeValues) {
          for (const [alias, realName] of Object.entries(input.ExpressionAttributeNames)) {
            const valAlias = Object.keys(input.ExpressionAttributeValues).find((k) =>
              k.toLowerCase().includes(realName.toLowerCase())
            );
            if (valAlias && input.ConditionExpression.includes(`${alias} = ${valAlias}`)) {
              const expectedVal = input.ExpressionAttributeValues[valAlias];
              if (!existing || existing[realName] !== expectedVal) {
                const err = new Error('The conditional request failed');
                err.name = 'ConditionalCheckFailedException';
                throw err;
              }
            }
          }
        }
      }

      const item = existing ? JSON.parse(JSON.stringify(existing)) : { ...input.Key };

      if (input.UpdateExpression && input.ExpressionAttributeValues) {
        for (const [valKey, val] of Object.entries(input.ExpressionAttributeValues)) {
          let attrName = null;
          if (input.ExpressionAttributeNames) {
            for (const [alias, real] of Object.entries(input.ExpressionAttributeNames)) {
              if (input.UpdateExpression.includes(`${alias} = ${valKey}`)) {
                attrName = real;
                break;
              }
            }
          }
          if (!attrName) {
            const match = input.UpdateExpression.match(new RegExp(`([a-zA-Z0-9_]+)\\s*=\\s*\\${valKey}`));
            if (match) attrName = match[1];
          }
          if (attrName) {
            item[attrName] = val;
          }
        }
      }

      table.set(key, item);
      this.persistToDisk();
      return { Attributes: item };
    }

    if (name === 'QueryCommand') {
      const table = this.getTable(input.TableName);
      const allItems = Array.from(table.values());
      let matched = [];

      if (input.IndexName === 'UserPaymentsIndex') {
        const userId = input.ExpressionAttributeValues[':userId'];
        matched = allItems.filter((item) => item.userId === userId && item.PK && item.PK.startsWith('PAYMENT#'));
      } else if (input.IndexName === 'StatusPaymentsIndex') {
        const status = input.ExpressionAttributeValues[':status'];
        matched = allItems.filter((item) => item.status === status && item.PK && item.PK.startsWith('PAYMENT#'));
      } else if (input.KeyConditionExpression) {
        const pkVal = input.ExpressionAttributeValues[':pk'];
        matched = allItems.filter((item) => item.PK === pkVal);
      } else {
        matched = allItems;
      }

      if (input.ScanIndexForward === false) {
        matched.reverse();
      }

      return { Items: JSON.parse(JSON.stringify(matched)), Count: matched.length };
    }

    if (name === 'ScanCommand') {
      const table = this.getTable(input.TableName);
      const allItems = Array.from(table.values());
      return { Items: JSON.parse(JSON.stringify(allItems)), Count: allItems.length };
    }

    if (name === 'TransactWriteCommand') {
      const itemsToPut = [];
      const itemsToUpdate = [];

      for (const action of input.TransactItems) {
        if (action.Put) {
          const put = action.Put;
          const table = this.getTable(put.TableName);
          const key = this.makeKey({ PK: put.Item.PK, SK: put.Item.SK });
          if (put.ConditionExpression && put.ConditionExpression.includes('attribute_not_exists(PK)') && table.has(key)) {
            const err = new Error('Transaction cancelled, conditional check failed');
            err.name = 'TransactionCanceledException';
            err.CancellationReasons = [{ Code: 'ConditionalCheckFailed' }];
            throw err;
          }
          itemsToPut.push({ table, key, item: put.Item });
        } else if (action.Update) {
          const upd = action.Update;
          const table = this.getTable(upd.TableName);
          const key = this.makeKey(upd.Key);
          const existing = table.get(key);

          if (upd.ConditionExpression) {
            if (upd.ConditionExpression.includes('attribute_exists(PK)') && !existing) {
              const err = new Error('Transaction cancelled, conditional check failed');
              err.name = 'TransactionCanceledException';
              err.CancellationReasons = [{ Code: 'ConditionalCheckFailed' }];
              throw err;
            }
            if (upd.ExpressionAttributeNames && upd.ExpressionAttributeValues) {
              for (const [alias, realName] of Object.entries(upd.ExpressionAttributeNames)) {
                const valAlias = Object.keys(upd.ExpressionAttributeValues).find((k) =>
                  k.toLowerCase().includes(realName.toLowerCase())
                );
                if (valAlias && upd.ConditionExpression.includes(`${alias} = ${valAlias}`)) {
                  const expectedVal = upd.ExpressionAttributeValues[valAlias];
                  if (!existing || existing[realName] !== expectedVal) {
                    const err = new Error('Transaction cancelled, conditional check failed');
                    err.name = 'TransactionCanceledException';
                    err.CancellationReasons = [{ Code: 'ConditionalCheckFailed' }];
                    throw err;
                  }
                }
              }
            }
          }

          const item = existing ? JSON.parse(JSON.stringify(existing)) : { ...upd.Key };
          if (upd.UpdateExpression && upd.ExpressionAttributeValues) {
            for (const [valKey, val] of Object.entries(upd.ExpressionAttributeValues)) {
              let attrName = null;
              if (upd.ExpressionAttributeNames) {
                for (const [alias, real] of Object.entries(upd.ExpressionAttributeNames)) {
                  if (upd.UpdateExpression.includes(`${alias} = ${valKey}`)) {
                    attrName = real;
                    break;
                  }
                }
              }
              if (!attrName) {
                const match = upd.UpdateExpression.match(new RegExp(`([a-zA-Z0-9_]+)\\s*=\\s*\\${valKey}`));
                if (match) attrName = match[1];
              }
              if (attrName) item[attrName] = val;
            }
          }
          itemsToUpdate.push({ table, key, item });
        }
      }

      for (const { table, key, item } of itemsToPut) {
        table.set(key, JSON.parse(JSON.stringify(item)));
      }
      for (const { table, key, item } of itemsToUpdate) {
        table.set(key, item);
      }

      this.persistToDisk();
      return {};
    }

    throw new Error(`Unsupported mock command: ${name}`);
  }
}

const mockStore = new MockDynamoDBStore();

let docClient;

if (config.useLocalMock) {
  docClient = mockStore;
} else {
  const clientConfig = { region: config.awsRegion };
  if (config.dynamodbEndpoint) {
    clientConfig.endpoint = config.dynamodbEndpoint;
  }
  const rawClient = new DynamoDBClient(clientConfig);
  docClient = DynamoDBDocumentClient.from(rawClient, {
    marshallOptions: {
      removeUndefinedValues: true,
      convertEmptyValues: true,
    },
  });
}

module.exports = {
  docClient,
  mockStore,
  GetCommand,
  PutCommand,
  UpdateCommand,
  DeleteCommand,
  QueryCommand,
  ScanCommand,
  TransactWriteCommand,
};
