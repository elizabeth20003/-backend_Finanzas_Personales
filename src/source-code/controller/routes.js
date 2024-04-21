const express = require("express");
const multer  = require('multer');
const { StatusCodes } = require("http-status-codes");

const upload = multer({ storage: multer.memoryStorage() });

// Importing the functions from the DynamoDB SDK
const {
  putDynamoDBItem,
  getDynamoDBItem,
  deleteDynamoDBItem,
} = require("../aws/dynamodb");

// Importing the functions from the S3 SDK
const {
  uploadS3File,
  ListS3Files,
  getS3File,
  deleteS3File,
} = require("../aws/s3");

const api = express.Router();

api.post("/path1", async (request, response) => {
  try {
    console.info("BODY", request.body);

    const item = {
      ...request.body,
      visible: true,
    };

    // Put the item in DynamoDB
    await putDynamoDBItem(item);

    // Get the item from DynamoDB
    const dynamoDBItem = await getDynamoDBItem({ id: item.id });
    console.info(`DynamoDB Item With ID ${item.id}`, dynamoDBItem);

    // Delete the item from DynamoDB
    await deleteDynamoDBItem({ id: item.id });

    response
      .status(StatusCodes.OK)
      .json({ msg: "Hello from path1" });
  } catch (error) {
    console.error("Error", error);
    response
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ msg: "Internal Server Error" });
  }
});

api.post("/path2", upload.single("file"), async (request, response) => {
  try {
    console.info("BODY", request.file);

    const fileInfo = request.file;
    console.info("FILE INFO", fileInfo);

    const { originalname, buffer, mimetype } = fileInfo;

    // Upload a file to S3
    await uploadS3File({ key: originalname, buffer, mimetype });

    // List all files from S3
    const s3Files = await ListS3Files();
    console.info("S3 Files", s3Files);

    // Get the file from S3
    const s3File = await getS3File(originalname);
    console.info(`S3 File With Name ${originalname}`, s3File);

    // Delete the file from S3
    await deleteS3File(originalname);

    response.writeHead(StatusCodes.OK, {
      "content-disposition": `attachment; filename=${originalname}`,
      "Content-Type": mimetype,
    });
    response.end(buffer);
  } catch (error) {
    console.error("Error", error);
    response
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ msg: "Internal Server Error" });
  }
});

module.exports = api;
