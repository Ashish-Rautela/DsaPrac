const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');
const config = require('../config/env');

class S3Service {
  constructor() {
    this.bucket = config.s3Bucket;
    this.region = config.awsRegion;

    // Only instantiate real AWS S3 client if not running in local mock/test
    if (!config.useLocalMock && config.nodeEnv !== 'test') {
      this.client = new S3Client({
        region: this.region,
      });
    } else {
      this.client = null;
    }
  }

  /**
   * Uploads base64 encoded screenshot to AWS S3 bucket
   * @param {Object} params
   * @param {string} params.base64Data Data URL or base64 string
   * @param {string} params.userId
   * @param {string} params.paymentId
   * @returns {Promise<string>} S3 object URL or data URL in local mock
   */
  async uploadScreenshot({ base64Data, userId, paymentId }) {
    if (!base64Data) return null;

    // If it's already an existing HTTP/S3 URL, return as-is
    if (base64Data.startsWith('http://') || base64Data.startsWith('https://')) {
      return base64Data;
    }

    // Parse data URL: e.g. data:image/png;base64,iVBORw0KGgo...
    const matches = base64Data.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
    let mimeType = 'image/jpeg';
    let base64String = base64Data;
    let ext = 'jpg';

    if (matches && matches.length === 3) {
      mimeType = matches[1];
      base64String = matches[2];
      if (mimeType.includes('png')) ext = 'png';
      else if (mimeType.includes('webp')) ext = 'webp';
    }

    const key = `proofs/${userId}/${paymentId}-${Date.now()}.${ext}`;

    // If running in local mock or offline test without AWS S3 credentials
    if (config.useLocalMock || !this.client) {
      // In production/cloud simulation return S3 URL format; fallback to dataUrl for offline view
      if (process.env.SIMULATE_S3_URL === 'true') {
        return `https://${this.bucket}.s3.${this.region}.amazonaws.com/${key}`;
      }
      return base64Data;
    }

    try {
      const buffer = Buffer.from(base64String, 'base64');
      const command = new PutObjectCommand({
        Bucket: this.bucket,
        Key: key,
        Body: buffer,
        ContentType: mimeType,
      });

      await this.client.send(command);

      if (config.s3PublicUrl) {
        return `${config.s3PublicUrl.replace(/\/$/, '')}/${key}`;
      }

      return `https://${this.bucket}.s3.${this.region}.amazonaws.com/${key}`;
    } catch (err) {
      console.error('[S3] Failed to upload screenshot to S3:', err.message);
      console.warn('[S3] Falling back to direct image data to ensure payment submission succeeds.');
      return base64Data;
    }
  }
}

module.exports = new S3Service();
