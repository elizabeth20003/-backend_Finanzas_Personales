const { 
  S3Client, 
  GetObjectCommand, 
  PutObjectCommand,
  DeleteObjectCommand,
  ListObjectsV2Command
} = require("@aws-sdk/client-s3");

const { AWS_REGION, S3_BUCKET } = require("../utils/constants");

const s3 = new S3Client({ region: AWS_REGION });

const ListS3Files = async () => {
  const params = {
    Bucket: S3_BUCKET,
  };
  console.info("LIST PARAMS", params);

  let files;
  try {
    const command = new ListObjectsV2Command(params);
    const response = await s3.send(command);
    files = response.Contents.map((file) => file.Key);
  } catch (error) {
    console.error(error);
    throw error;
  }

  return files;
}

const getS3File = async (file) => {
  const params = {
    Bucket: S3_BUCKET,
    Key: file,
  };
  console.info("GET PARAMS", params);

  let bufferFile;
  try {
    const command = new GetObjectCommand(params);
    const response = await s3.send(command);
    bufferFile = await response.Body.transformToString("utf-8");
  } catch (error) {
    console.error(error);
    throw error;
  }

  return bufferFile;
};

const uploadS3File = async ({ key, buffer, mimetype }) => {
  const params = {
    Bucket: S3_BUCKET,
    Key: key,
    Body: buffer,
    ContentType: mimetype,
  };
  console.info("UPDATE PARAMS", params);

  try {
    const command = new PutObjectCommand(params);
    await s3.send(command);
  } catch (error) {
    console.error(error);
    throw error;
  }
}

const deleteS3File = async (key) => {
  const params = {
    Bucket: S3_BUCKET,
    Key: key,
  };
  console.info("DELETE PARAMS", params);

  try {
    const command = new DeleteObjectCommand(params);
    await s3.send(command);
  } catch (error) {
    console.error(error);
    throw error;
  }
};

module.exports = {
  ListS3Files,
  getS3File,
  uploadS3File,
  deleteS3File,
};
