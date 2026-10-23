# Visa OA Preparation Platform on AWS

A secure, cost-conscious, production-minded platform designed to help students prepare for **Visa Software Engineering Intern Online Assessments (OA)**. Focused on high-frequency algorithmic patterns (sliding windows, monotonic queues, prefix sums, and transaction clustering), it offers a curated collection of Visa-specific questions with original intuition breakdowns and problem mappings to LeetCode.

---

## 1. Architecture & Tech Stack

```
                              +--------------------------+
                              |   Students & Admins UI   |
                              +------------+-------------+
                                           |
                 +-------------------------+-------------------------+
                 | HTTPS                                             | HTTPS
                 v                                                   v
  +------------------------------+                    +------------------------------+
  |    Amazon CloudFront CDN     |                    |    Amazon API Gateway        |
  |     (SSL/TLS, Edge Caching)  |                    |        (HTTP API v2)         |
  +--------------+---------------+                    +--------------+---------------+
                 | OAC                                               | Proxy
                 v                                                   v
  +------------------------------+                    +------------------------------+
  |      Amazon S3 Bucket        |                    |       AWS Lambda Function    |
  |     (React + Vite Build)     |                    |    (Express + serverless-http|
  +------------------------------+                    +--------------+---------------+
                                                                     |
                                           +-------------------------+-------------------------+
                                           |                         |                         |
                                           v                         v                         v
                                 +-------------------+     +-------------------+     +-------------------+
                                 |  VisaPrep_Users   |     |VisaPrep_Questions |     | VisaPrep_Payments |
                                 |  DynamoDB Table   |     |  DynamoDB Table   |     |  DynamoDB Table   |
                                 +-------------------+     +-------------------+     +-------------------+
```

### Frontend
- **Framework**: React 18 with Vite (pure JavaScript, no TypeScript)
- **Styling**: Tailwind CSS with custom Visa brand theme (`visa-blue`, `visa-gold`)
- **Icons**: Lucide React
- **Routing**: React Router DOM v6 with `ProtectedRoute` and `AdminRoute`

### Backend
- **Runtime**: Node.js 20.x
- **Framework**: Express.js wrapped with `serverless-http` for AWS Lambda
- **Database**: Amazon DynamoDB with AWS SDK for JavaScript v3 (`@aws-sdk/client-dynamodb`, `@aws-sdk/lib-dynamodb`)
- **Security**:
  - `bcryptjs` for salted password hashing
  - `jsonwebtoken` for secure session handling via HTTP-only cookies and `Authorization: Bearer <token>`
  - Account enumeration defense: constant-time password comparison
  - `express-rate-limit` for brute-force protection on authentication and payment submissions

### AWS Infrastructure
- **Amazon DynamoDB**: On-Demand capacity (`PAY_PER_REQUEST`) with ₹0 idle cost. Point-In-Time-Recovery (PITR) enabled on payments and users.
- **AWS Lambda**: Node.js 20.x on AWS Graviton2 (`arm64`) for lower latency and cost.
- **Amazon API Gateway**: HTTP API (v2) for low-cost, low-latency RESTful routing.
- **Amazon S3 & CloudFront**: S3 bucket with public access blocked; CloudFront Origin Access Control (OAC); SPA routing fallback to `/index.html`.
- **AWS CloudWatch**: 30-day log retention for API Lambda execution.
- **Infrastructure as Code**: AWS Serverless Application Model (SAM) in [`infra/template.yaml`](infra/template.yaml).

---

## 2. Product & Pricing Model

- **Product**: Visa SWE Intern OA Curated Question Bank.
- **Pricing**: ₹20 (2000 paise) one-time payment for permanent lifetime access.
- **Payment Method**: Manual UPI verification (GPay / PhonePe / Paytm / BHIM) via dynamic UPI QR code and UPI ID (`visaprep@okaxis`).
- **Access Flow**:
  1. Free starter questions are accessible to everyone.
  2. Students transfer ₹20 via UPI and submit their 12-digit UTR reference on the `/checkout` page.
  3. The submission is placed in **pending verification**.
  4. An administrator verifies the transaction against incoming bank credits on the `/admin` dashboard.
  5. Approval executes an atomic DynamoDB transaction unlocking `hasLifetimeAccess: true` instantly.

---

## 3. DynamoDB Data Model

### Table 1: Users (`VisaPrep_Users`)
- **Profile Item**:
  - `PK`: `USER#<userId>`
  - `SK`: `PROFILE`
  - Attributes: `userId`, `name`, `email`, `emailNormalized`, `passwordHash`, `role` (`user` | `admin`), `hasLifetimeAccess` (boolean), `createdAt`, `updatedAt`
- **Email Lookup Item (Atomic Uniqueness)**:
  - `PK`: `EMAIL#<emailNormalized>`
  - `SK`: `EMAIL`
  - Attributes: `userId`, `emailNormalized`, `createdAt`
  - *Pattern*: Registration writes both items in a `TransactWriteItems` with `attribute_not_exists(PK)`. Prevents duplicate email registrations atomically.

### Table 2: Questions (`VisaPrep_Questions`)
- **Question Item**:
  - `PK`: `COMPANY#VISA` *(Extensible prefix to support other companies like `COMPANY#GOOGLE` without schema changes)*
  - `SK`: `QUESTION#<questionId>`
  - Attributes: `questionId`, `company`, `title`, `difficulty` (`Easy` | `Medium` | `Hard`), `topics` (list), `leetcodeUrl`, `description` (original intuition notes), `isPremium` (boolean), `createdAt`, `updatedAt`
- *Access Pattern*: `Query` scoped to `PK = COMPANY#VISA`. User-facing list endpoints return only safe preview fields for locked premium items.

### Table 3: Payments (`VisaPrep_Payments`)
- **Payment Item**:
  - `PK`: `PAYMENT#<paymentId>`
  - `SK`: `DETAILS`
  - Attributes: `paymentId`, `userId`, `userEmail`, `userName`, `amountPaise: 2000`, `currency: 'INR'`, `provider: 'manual_upi'`, `utr`, `status` (`pending` | `approved` | `rejected`), `submittedAt`, `reviewedAt`, `reviewedBy`, `rejectionReason`
- **UTR Lookup Item (Deterministic Uniqueness)**:
  - `PK`: `UTR#<normalizedUtr>`
  - `SK`: `UTR`
  - Attributes: `paymentId`, `userId`, `submittedAt`
- **Global Secondary Indexes**:
  - `UserPaymentsIndex`: Partition Key `userId`, Sort Key `submittedAt`
  - `StatusPaymentsIndex`: Partition Key `status`, Sort Key `submittedAt`

### Table 4: Progress (`VisaPrep_Progress`)
- **Progress Item**:
  - `PK`: `USER#<userId>`
  - `SK`: `QUESTION#<questionId>`
  - Attributes: `userId`, `questionId`, `status` (`solved` | `unsolved`), `updatedAt`
- *Access Pattern*: Scoped to `PK = USER#<userId>`.

---

## 4. Payment Verification & Atomic Approval

### Payment Submission
1. Server validates the UTR format (8–24 alphanumeric characters).
2. Server enforces fixed price: **2000 paise (₹20)**. Amount is never accepted from the client.
3. Server verifies the student does not already have active lifetime access.
4. Server checks if the user has an existing pending submission (prevents duplicate spam).
5. Writes `PAYMENT#<paymentId>` and `UTR#<normalizedUtr>` using DynamoDB `TransactWriteItems`. If the UTR was already claimed, the transaction fails with `ConditionalCheckFailed`.

### Admin Approval Transaction
Executed via DynamoDB `TransactWriteItems`:
```javascript
TransactWriteItems: [
  {
    Update: {
      TableName: PaymentsTable,
      Key: { PK: "PAYMENT#<paymentId>", SK: "DETAILS" },
      ConditionExpression: "attribute_exists(PK) AND #status = :pending",
      UpdateExpression: "SET #status = :approved, #reviewedAt = :now, #reviewedBy = :adminId"
    }
  },
  {
    Update: {
      TableName: UsersTable,
      Key: { PK: "USER#<userId>", SK: "PROFILE" },
      ConditionExpression: "attribute_exists(PK)",
      UpdateExpression: "SET #hasLifetimeAccess = :trueVal, #updatedAt = :now"
    }
  }
]
```
- **Atomicity**: The user receives access if and only if the payment is marked `approved`.
- **Concurrency Protection**: Condition `#status = :pending` prevents double approval if two admins click simultaneously.

### Admin Rejection
- Conditional update on `PAYMENT#<paymentId>` requiring `#status = :pending`. Sets `#status = :rejected` and records `rejectionReason`.
- Rejection **never** grants lifetime access.

---

## 5. Backend REST API

### Authentication
- `POST /api/auth/register` — Register new student (rate-limited)
- `POST /api/auth/login` — Sign in and receive token/cookie (rate-limited)
- `POST /api/auth/logout` — Clear auth cookie
- `GET /api/auth/me` — Get current profile & entitlement

### Questions
- `GET /api/questions` — List questions (filters: `search`, `difficulty`, `topic`, `page`, `limit`). Returns safe previews for locked items.
- `GET /api/questions/:id` — Get question details. Unpaid users requesting premium items receive **HTTP 403 Forbidden**.
- `POST /api/admin/questions` — Create question (Admin only)
- `PATCH /api/admin/questions/:id` — Update question (Admin only)
- `DELETE /api/admin/questions/:id` — Delete question (Admin only)

### Payments
- `GET /api/payments/config` — Get UPI ID and payee details
- `POST /api/payments` — Submit UTR for review (rate-limited)
- `GET /api/payments/me` — Get student's payment history
- `GET /api/admin/payments` — List submissions with optional `?status=` filter (Admin only)
- `PATCH /api/admin/payments/:id/approve` — Atomically approve payment (Admin only)
- `PATCH /api/admin/payments/:id/reject` — Reject payment with reason (Admin only)

### Progress
- `GET /api/progress` — Get user's question progress map
- `PUT /api/progress/:questionId` — Set status (`solved` | `unsolved`)

---

## 6. Local Development & Testing

The repository supports offline development and testing using an in-memory DynamoDB store with exact condition expression and transaction simulation. No AWS credentials or cloud connections are required to run tests.

### 1. Install Dependencies
```bash
npm run install:all
```

### 2. Run Test Suite
```bash
npm test
```
**Test Results**: 23/23 tests passing across 4 suites:
- User registration and atomic duplicate email prevention
- Login, logout, and account enumeration protection
- Free vs premium question access control & 403 enforcement
- Safe preview field stripping (no leakage of LeetCode URLs or descriptions)
- Duplicate UTR prevention and duplicate pending payment checks
- Transactional admin approval and entitlement activation
- Admin rejection with recorded reason
- Question progress tracking scoped to user

### 3. Seed Database & Bootstrap Admin
```bash
# Seed curated Visa OA questions
npm run seed

# Create initial platform administrator
npm --prefix server run bootstrap:admin
```
*(Default bootstrap admin: `admin@visaprep.internal` / `AdminVisaPrep2026!`)*

### 4. Run Locally
```bash
# Start backend API (port 5000)
npm run dev:server

# Start frontend (port 5173 with Vite proxy)
npm run dev:client
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 7. AWS Deployment Guide

See the full infrastructure guide in [`infra/README.md`](infra/README.md).

```bash
# 1. Deploy SAM Stack (DynamoDB, Lambda, API Gateway, S3, CloudFront)
cd infra
sam build
sam deploy --guided

# 2. Seed Remote DynamoDB
cd ../server
export AWS_REGION=ap-south-1
export USERS_TABLE=VisaPrep_Users_prod
export QUESTIONS_TABLE=VisaPrep_Questions_prod
export PAYMENTS_TABLE=VisaPrep_Payments_prod
export PROGRESS_TABLE=VisaPrep_Progress_prod
export USE_LOCAL_MOCK=false
node src/scripts/seedQuestions.js
node src/scripts/bootstrapAdmin.js --email=admin@yourdomain.com --password="YourSecurePassword!"

# 3. Build and Sync Frontend to S3 / CloudFront
cd ../client
echo "VITE_API_URL=https://<api-id>.execute-api.ap-south-1.amazonaws.com/prod/api" > .env.production
npm run build
aws s3 sync dist/ s3://<frontend-bucket-name>/ --delete
aws cloudfront create-invalidation --distribution-id <DISTRIBUTION_ID> --paths "/*"
```

---

## 8. Security Considerations

- **Least Privilege IAM**: Lambda execution role is strictly constrained to CRUD actions on the 4 designated application tables.
- **Server-Side Authorization**: Premium question details (`leetcodeUrl`, full description notes) are never sent over the wire to unpaid users, preventing frontend inspection bypasses.
- **No Client Elevation**: Admin permissions are verified on every admin endpoint; registration endpoints cannot assign the `admin` role.
- **Deterministic UTR Uniqueness**: UTR items ensure no duplicate reference can ever be claimed, preventing reuse.
- **Audit Logging**: Payment approvals and rejections record the reviewing administrator and timestamp in DynamoDB.
