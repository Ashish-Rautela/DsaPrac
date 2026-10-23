const { DynamoDBClient, CreateTableCommand, DescribeTableCommand } = require('@aws-sdk/client-dynamodb');
const config = require('../config/env');

async function createTableIfNotExists(client, params) {
  try {
    await client.send(new DescribeTableCommand({ TableName: params.TableName }));
    console.log(`Table '${params.TableName}' already exists.`);
  } catch (err) {
    if (err.name === 'ResourceNotFoundException') {
      console.log(`Creating table '${params.TableName}'...`);
      await client.send(new CreateTableCommand(params));
      console.log(`Table '${params.TableName}' created.`);
    } else {
      throw err;
    }
  }
}

async function initAllTables() {
  if (config.useLocalMock) {
    console.log('[Init Tables] Running in local mock mode; in-memory store handles tables automatically.');
    return;
  }

  const client = new DynamoDBClient({
    region: config.awsRegion,
    endpoint: config.dynamodbEndpoint,
  });

  console.log(`[Init Tables] Initializing DynamoDB tables in region ${config.awsRegion}...`);

  // 1. Users Table
  await createTableIfNotExists(client, {
    TableName: config.tables.users,
    KeySchema: [
      { AttributeName: 'PK', KeyType: 'HASH' },
      { AttributeName: 'SK', KeyType: 'RANGE' },
    ],
    AttributeDefinitions: [
      { AttributeName: 'PK', AttributeType: 'S' },
      { AttributeName: 'SK', AttributeType: 'S' },
    ],
    BillingMode: 'PAY_PER_REQUEST',
  });

  // 2. Questions Table
  await createTableIfNotExists(client, {
    TableName: config.tables.questions,
    KeySchema: [
      { AttributeName: 'PK', KeyType: 'HASH' },
      { AttributeName: 'SK', KeyType: 'RANGE' },
    ],
    AttributeDefinitions: [
      { AttributeName: 'PK', AttributeType: 'S' },
      { AttributeName: 'SK', AttributeType: 'S' },
    ],
    BillingMode: 'PAY_PER_REQUEST',
  });

  // 3. Payments Table
  await createTableIfNotExists(client, {
    TableName: config.tables.payments,
    KeySchema: [
      { AttributeName: 'PK', KeyType: 'HASH' },
      { AttributeName: 'SK', KeyType: 'RANGE' },
    ],
    AttributeDefinitions: [
      { AttributeName: 'PK', AttributeType: 'S' },
      { AttributeName: 'SK', AttributeType: 'S' },
      { AttributeName: 'userId', AttributeType: 'S' },
      { AttributeName: 'status', AttributeType: 'S' },
      { AttributeName: 'submittedAt', AttributeType: 'S' },
    ],
    GlobalSecondaryIndexes: [
      {
        IndexName: 'UserPaymentsIndex',
        KeySchema: [
          { AttributeName: 'userId', KeyType: 'HASH' },
          { AttributeName: 'submittedAt', KeyType: 'RANGE' },
        ],
        Projection: { ProjectionType: 'ALL' },
      },
      {
        IndexName: 'StatusPaymentsIndex',
        KeySchema: [
          { AttributeName: 'status', KeyType: 'HASH' },
          { AttributeName: 'submittedAt', KeyType: 'RANGE' },
        ],
        Projection: { ProjectionType: 'ALL' },
      },
    ],
    BillingMode: 'PAY_PER_REQUEST',
  });

  // 4. Progress Table
  await createTableIfNotExists(client, {
    TableName: config.tables.progress,
    KeySchema: [
      { AttributeName: 'PK', KeyType: 'HASH' },
      { AttributeName: 'SK', KeyType: 'RANGE' },
    ],
    AttributeDefinitions: [
      { AttributeName: 'PK', AttributeType: 'S' },
      { AttributeName: 'SK', AttributeType: 'S' },
    ],
    BillingMode: 'PAY_PER_REQUEST',
  });

  console.log('[Init Tables] All tables initialized successfully.');
}

if (require.main === module) {
  initAllTables()
    .then(() => process.exit(0))
    .catch((err) => {
      console.error('[Init Tables Error]', err);
      process.exit(1);
    });
}

module.exports = { initAllTables };
