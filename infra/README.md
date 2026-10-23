# AWS Infrastructure & Deployment Guide

This directory contains the AWS Serverless Application Model (SAM) configuration for the Visa OA Preparation Platform.

## Architecture Overview

```
                               +-----------------------------+
                               |     End Users / Students    |
                               +--------------+--------------+
                                              |
                     +------------------------+-----------------------+
                     | HTTPS                                          | HTTPS
                     v                                                v
       +----------------------------+                   +----------------------------+
       |   Amazon CloudFront CDN    |                   |   Amazon API Gateway       |
       |  (Global Edge Caching)     |                   |       (HTTP API)           |
       +-------------+--------------+                   +-------------+--------------+
                     | OAC                                            | Proxy
                     v                                                v
       +----------------------------+                   +----------------------------+
       |       Amazon S3            |                   |      AWS Lambda            |
       |   (React Static Build)     |                   |  (Express.js + serverless) |
       +----------------------------+                   +-------------+--------------+
                                                                      |
                                            +-------------------------+-------------------------+
                                            |                         |                         |
                                            v                         v                         v
                                  +-------------------+     +-------------------+     +-------------------+
                                  | VisaPrep_Users    |     | VisaPrep_Questions|     | VisaPrep_Payments |
                                  | DynamoDB On-Demand|     | DynamoDB On-Demand|     | DynamoDB On-Demand|
                                  +-------------------+     +-------------------+     +-------------------+
```

### Key Components

1. **Amazon DynamoDB (On-Demand Capacity Mode):**
   - Four dedicated tables: `VisaPrep_Users`, `VisaPrep_Questions`, `VisaPrep_Payments`, and `VisaPrep_Progress`.
   - On-demand billing means ₹0 idle cost. Billed strictly per request (pay-per-request).
   - Point-in-Time Recovery (PITR) enabled on financial & critical tables (`Payments` and `Users`) for continuous backup.

2. **AWS Lambda (`serverless-http`):**
   - Runs Express backend on Node.js 20.x on AWS Graviton2 (`arm64`), delivering ~20% lower cost and higher performance per compute unit.
   - Billed per millisecond execution. No persistent EC2 or ECS idle server charges.

3. **Amazon API Gateway (HTTP API v2):**
   - Lower latency and ~70% cheaper than REST API v1.
   - Built-in CORS handling and proxy routing.

4. **Amazon S3 + CloudFront with Origin Access Control (OAC):**
   - Static React SPA assets served through S3 with public access completely blocked.
   - CloudFront provides SSL/TLS termination, HTTP/2 & HTTP/3 support, global low-latency distribution, and custom error handling routing `404/403` to `/index.html` for client-side routing.

5. **Security & IAM:**
   - Least privilege IAM roles: Lambda is strictly scoped to `DynamoDBCrudPolicy` on the 4 application tables.
   - Secrets (`JWT_SECRET`) provided via CloudFormation parameters and hidden via `NoEcho: true`.

---

## Deployment Steps

### Prerequisites

1. Install [AWS CLI](https://aws.amazon.com/cli/) and [AWS SAM CLI](https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/install-sam-cli.html).
2. Configure your AWS credentials:
   ```bash
   aws configure
   ```

### 1. Build and Deploy Backend & Infrastructure

From the root directory or `infra/` directory:

```bash
cd infra
sam build
sam deploy --guided
```

During `--guided`, SAM will prompt for:
- **Stack Name**: `visaprep-stack-prod`
- **AWS Region**: `ap-south-1` (Mumbai) or your preferred region
- **Parameter Environment**: `prod`
- **Parameter JwtSecret**: (Enter a secure 32+ character random string)
- **Parameter UpiId**: e.g., `visaprep@okaxis`
- **Confirm changes before deploy**: `y`
- **Allow SAM CLI IAM role creation**: `y`

After successful deployment, note the outputs:
- `ApiEndpoint`: e.g. `https://abc123xyz.execute-api.ap-south-1.amazonaws.com/prod`
- `FrontendBucketName`: e.g. `visaprep-frontend-123456789012-prod`
- `CloudFrontUrl`: e.g. `https://d12345abcdef.cloudfront.net`

### 2. Seed Database & Bootstrap Admin

Once tables are created in AWS:

```bash
cd ../server
# Provide deployed table names and region
export AWS_REGION=ap-south-1
export USERS_TABLE=VisaPrep_Users_prod
export QUESTIONS_TABLE=VisaPrep_Questions_prod
export PAYMENTS_TABLE=VisaPrep_Payments_prod
export PROGRESS_TABLE=VisaPrep_Progress_prod
export USE_LOCAL_MOCK=false

# Seed curated Visa OA questions
node src/scripts/seedQuestions.js

# Bootstrap the initial platform administrator
node src/scripts/bootstrapAdmin.js --email=admin@yourdomain.com --password="YourSecureAdminPassword123!"
```

### 3. Build & Deploy Frontend

```bash
cd ../client

# Create production .env with deployed API endpoint
echo "VITE_API_URL=https://abc123xyz.execute-api.ap-south-1.amazonaws.com/prod/api" > .env.production

# Build optimized static bundle
npm run build

# Sync build to S3
aws s3 sync dist/ s3://visaprep-frontend-123456789012-prod/ --delete

# Invalidate CloudFront cache to deploy immediately
aws cloudfront create-invalidation --distribution-id <DISTRIBUTION_ID> --paths "/*"
```

---

## Rollback & Tear Down Instructions

### Rollback
If a deployment fails, CloudFormation automatically rolls back resources to the previous working state.
To manually roll back to a prior SAM deployment:
```bash
sam deploy --stack-name visaprep-stack-prod --template-file <prior-template.yaml>
```

### Full Tear Down
To delete all resources and stop any cloud charges:
1. Empty the frontend S3 bucket:
   ```bash
   aws s3 rm s3://visaprep-frontend-123456789012-prod/ --recursive
   ```
2. Delete the CloudFormation stack:
   ```bash
   sam delete --stack-name visaprep-stack-prod
   ```

---

## CloudWatch Monitoring & Logs

1. **Lambda Application Logs**:
   - CloudWatch Log Group: `/aws/lambda/visaprep-stack-prod-ExpressApiFunction-*`
   - Real-time tailing:
     ```bash
     sam logs -n ExpressApiFunction --stack-name visaprep-stack-prod --tail
     ```
2. **Metrics to Monitor**:
   - Lambda Invocations, Errors, and Duration.
   - API Gateway 4xx and 5xx rates.
   - DynamoDB ThrottledRequests and SystemErrors.
