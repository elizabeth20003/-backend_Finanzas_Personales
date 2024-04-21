// General constants
const CORS_ORIGIN = process.env.CORS_ORIGIN;
const AWS_REGION = process.env.AWS_REGION;
const DYNAMODB_TABLE = process.env.DYNAMODB_TABLE;
const S3_BUCKET = process.env.S3_BUCKET;

module.exports = {
  CORS_ORIGIN,
  AWS_REGION,
  DYNAMODB_TABLE,
  S3_BUCKET,
};
