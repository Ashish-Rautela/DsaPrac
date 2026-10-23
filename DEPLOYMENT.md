# Production Deployment Guide: AWS S3, EC2 Backend, and GitHub Pages Frontend

This guide covers everything required to deploy the Visa OA Preparation Platform across:
1. **AWS S3** — Secure cloud storage for uploaded payment receipts and screenshots
2. **AWS EC2** — Node/Express API running with PM2 and Nginx reverse proxy
3. **GitHub Pages** — High-availability static hosting for the React/Vite frontend
4. **GitHub Actions CI/CD** — Automated testing and deployment pipelines on every push to `main`

---

## Architecture Overview

```
                      +-----------------------------+
                      |   GitHub Pages (Frontend)   |
                      |   React 18 + Vite (SPA)     |
                      +--------------+--------------+
                                     |
                         API Calls   |  (CORS enabled)
                                     v
                      +-----------------------------+
                      |       AWS EC2 (Backend)     |
                      |     Nginx -> PM2 (Node.js)  |
                      +-------+-------------+-------+
                              |             |
           PutObject/GetObject|             | DynamoDB SDK
                              v             v
                    +--------------+   +---------------+
                    |    AWS S3    |   | AWS DynamoDB  |
                    | Payment Proof|   | Users, Qs,    |
                    | Screenshots  |   | Payments, etc |
                    +--------------+   +---------------+
```

---

## 1. AWS S3 Setup for Payment Screenshots

### Step 1.1: Create S3 Bucket
1. Open the **AWS S3 Console** and click **Create bucket**.
2. **Bucket Name:** e.g., `visaprep-payment-proofs` (must be globally unique).
3. **Region:** `ap-south-1` (Mumbai) or your chosen AWS region.
4. Keep **Block all public access** checked or unchecked according to your architecture:
   - *Recommended (Direct Public Read):* Uncheck "Block all public access" and acknowledge the warning if you want payment proofs to be accessible directly via public S3 URLs.
   - *Alternative (Private with CloudFront/Presigned):* Keep blocked and distribute via CloudFront OAC.

### Step 1.2: Configure Bucket Policy (For Public Read of Uploaded Proofs)
Under **Permissions -> Bucket Policy**, paste:
```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "PublicReadForPaymentProofs",
      "Effect": "Allow",
      "Principal": "*",
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::visaprep-payment-proofs/proofs/*"
    }
  ]
}
```
*(Replace `visaprep-payment-proofs` with your actual bucket name).*

### Step 1.3: Configure CORS on S3 Bucket
Under **Permissions -> Cross-origin resource sharing (CORS)**, paste:
```json
[
  {
    "AllowedHeaders": ["*"],
    "AllowedMethods": ["GET", "HEAD"],
    "AllowedOrigins": ["*"],
    "ExposeHeaders": []
  }
]
```

---

## 2. AWS EC2 Setup (Backend API)

### Step 2.1: Launch EC2 Instance
- **AMI:** Ubuntu 24.04 LTS or 22.04 LTS (or Amazon Linux 2023).
- **Instance Type:** `t3.micro` or `t3.small` (free-tier eligible).
- **Key Pair:** Create or select an existing `.pem` SSH key pair.
- **Security Group (Inbound rules):**
  - SSH (port 22) — Your IP or anywhere (`0.0.0.0/0`)
  - HTTP (port 80) — Anywhere (`0.0.0.0/0`)
  - HTTPS (port 443) — Anywhere (`0.0.0.0/0`)

### Step 2.2: Attach IAM Role to EC2 (No Hardcoded AWS Keys)
1. In AWS IAM, create a role for **EC2** with the following policies:
   - `AmazonDynamoDBFullAccess` (or least-privilege scoped to `VisaPrep_*` tables)
   - `AmazonS3FullAccess` (or scoped to `arn:aws:s3:::visaprep-payment-proofs/*`)
2. Go to **EC2 Console -> Select your instance -> Actions -> Security -> Modify IAM role**.
3. Attach the created role. Your Node.js backend automatically detects credentials via the AWS metadata service.

### Step 2.3: Run the Initialization Script
SSH into your EC2 instance and execute the automated setup script:
```bash
# Clone the repository
git clone https://github.com/<your-username>/<repo-name>.git /var/www/visa-server
cd /var/www/visa-server

# Run the setup script
chmod +x server/deploy/setup-ec2.sh
./server/deploy/setup-ec2.sh
```

This script automatically:
- Installs Node.js 20 LTS and Nginx
- Configures PM2 cluster process management with auto-restart on boot
- Sets up Nginx reverse proxy routing port 80/443 to the Node.js API (port 5000)

### Step 2.4: Configure Backend `.env`
In `/var/www/visa-server/server/.env`:
```env
PORT=5000
NODE_ENV=production
JWT_SECRET=your_strong_random_jwt_secret_at_least_32_characters_long
JWT_EXPIRES_IN=7d

AWS_REGION=ap-south-1
USERS_TABLE=VisaPrep_Users
QUESTIONS_TABLE=VisaPrep_Questions
PAYMENTS_TABLE=VisaPrep_Payments
PROGRESS_TABLE=VisaPrep_Progress

USE_LOCAL_MOCK=false
S3_BUCKET_NAME=visaprep-payment-proofs

UPI_ID=visaprep@okaxis
UPI_PAYEE_NAME=Visa OA Prep Platform
UPI_AMOUNT_INR=20

CLIENT_ORIGIN=https://<your-username>.github.io
```

---

## 3. GitHub Pages Setup (Frontend)

### Step 3.1: Enable GitHub Actions Deployment in Repo Settings
1. On GitHub, navigate to your repository.
2. Go to **Settings -> Pages**.
3. Under **Build and deployment -> Source**, select **GitHub Actions**.

### Step 3.2: Configure Environment Variables & Secrets
Under **Settings -> Secrets and variables -> Actions**:

#### Variables (`Repository variables` tab):
- `VITE_API_URL`: Your EC2 backend API URL (e.g., `http://<ec2-ip>/api` or `https://api.yourdomain.com/api`).
- `VITE_BASE_PATH`: If using `https://<username>.github.io/<repo-name>/`, this defaults to `/<repo-name>/` automatically. If using a custom domain, set it to `/`.

#### Secrets (`Repository secrets` tab):
- `EC2_HOST`: The Public IPv4 address or Public DNS of your EC2 instance.
- `EC2_USER`: `ubuntu` (or `ec2-user`).
- `EC2_SSH_KEY`: The entire contents of your private SSH key file (`.pem`).

---

## 4. CI/CD Pipelines

Two automated GitHub Actions workflows are configured in `.github/workflows/`:

| Pipeline | File | Trigger | Actions |
|---|---|---|---|
| **Backend Deploy** | [.github/workflows/deploy-backend-ec2.yml](file:///.github/workflows/deploy-backend-ec2.yml) | Changes in `server/**` on `main` | Runs 25 unit/integration tests, SSHs into EC2, pulls code, runs `npm ci --omit=dev`, and performs zero-downtime PM2 reload. |
| **Frontend Deploy** | [.github/workflows/deploy-frontend-pages.yml](file:///.github/workflows/deploy-frontend-pages.yml) | Changes in `client/**` on `main` | Installs dependencies, builds Vite client, creates `404.html` SPA routing fallback, and deploys to GitHub Pages. |

---

## 5. Verification Checklist

- [ ] Push code to `main` branch to trigger both CI/CD workflows.
- [ ] Visit GitHub Pages URL to verify the UI loads.
- [ ] Test registration and login.
- [ ] Submit a test payment with a screenshot on the checkout page.
- [ ] Confirm the screenshot appears in the AWS S3 bucket under `proofs/<userId>/...`.
- [ ] Log into the Admin Console (`admin@visaprep.internal`), inspect the screenshot, and approve the payment.
- [ ] Verify that all 160+ Visa OA questions unlock immediately.
