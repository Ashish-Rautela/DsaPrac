const serverless = require('serverless-http');
const app = require('./src/app');

// Wrap Express app with serverless-http for AWS Lambda + API Gateway (v1 REST or v2 HTTP API)
module.exports.handler = serverless(app);
