const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const config = {
  port: parseInt(process.env.PORT || '5000', 10),
  nodeEnv: process.env.NODE_ENV || 'development',
  jwtSecret: process.env.JWT_SECRET || 'dev_jwt_secret_do_not_use_in_prod_1234567890',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',
  awsRegion: process.env.AWS_REGION || 'ap-south-1',
  dynamodbEndpoint: process.env.DYNAMODB_ENDPOINT || undefined,
  useLocalMock: process.env.USE_LOCAL_MOCK === 'true' || process.env.NODE_ENV === 'test',
  tables: {
    users: process.env.USERS_TABLE || 'VisaPrep_Users',
    questions: process.env.QUESTIONS_TABLE || 'VisaPrep_Questions',
    payments: process.env.PAYMENTS_TABLE || 'VisaPrep_Payments',
    progress: process.env.PROGRESS_TABLE || 'VisaPrep_Progress',
  },
  upi: {
    id: process.env.UPI_ID || 'visaprep@okaxis',
    payeeName: process.env.UPI_PAYEE_NAME || 'Visa OA Prep Platform',
    amountInr: parseInt(process.env.UPI_AMOUNT_INR || '20', 10),
    amountPaise: 2000,
  },
  s3Bucket: process.env.S3_BUCKET_NAME || 'visaprep-payment-proofs',
  s3PublicUrl: process.env.S3_PUBLIC_URL || undefined,
  clientOrigin: process.env.CLIENT_ORIGIN || 'http://localhost:5173',
};

module.exports = config;
