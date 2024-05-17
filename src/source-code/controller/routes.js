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

// Ruta para crear un nuevo gasto
api.post("/generar-gastos", async (req, res) => {
  try {
    const { descripcion, valor, fecha } = req.body;

    // Validaciones...

    
    await putDynamoDBItem(item);

    return res.status(StatusCodes.OK).json({ msg: "Los datos se han guardado correctamente" });
  } catch (error) {
    console.error("Error", error);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ msg: "Internal Server Error" });
  }
});

// Ruta para obtener un elemento de DynamoDB
api.get("/gastos/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const item = await getDynamoDBItem(id);

    if (!item) {
      return res.status(StatusCodes.NOT_FOUND).json({ msg: "El elemento no existe" });
    }

    return res.status(StatusCodes.OK).json(item);
  } catch (error) {
    console.error("Error", error);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ msg: "Internal Server Error" });
  }
});

// Ruta para actualizar un elemento de DynamoDB
api.put("/gastos/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { descripcion, valor, fecha } = req.body;

    // Validaciones...

    const item = {
      id,
      descripcion,
      valor,
      fecha,
      visible: true,
    };

    await updateDynamoDBItem(item);

    return res.status(StatusCodes.OK).json({ msg: "Los datos se han actualizado correctamente" });
  } catch (error) {
    console.error("Error", error);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ msg: "Internal Server Error" });
  }
});

// Ruta para eliminar un elemento de DynamoDB
api.delete("/gastos/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await deleteDynamoDBItem(id);

    return res.status(StatusCodes.OK).json({ msg: "El elemento ha sido eliminado correctamente" });
  } catch (error) {
    console.error("Error", error);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ msg: "Internal Server Error" });
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
