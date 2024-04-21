const serverlessExpress = require("@codegenie/serverless-express");
const express = require("express");
const cors = require("cors");

const app = express();

const api = require("./controller/routes");
const { CORS_ORIGIN } = require("./utils/constants");

// Middlewares
app.use(cors({ origin: CORS_ORIGIN }));
app.use(express.json());

// Lambda main routes
app.use("", api);

module.exports.handler = serverlessExpress({ app });
