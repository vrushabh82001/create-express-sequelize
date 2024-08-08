/*---------------------------------------------[ Import required modules ]----------------------------------------------*/
require("dotenv/config");
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const PORT = process.env.PORT || 3000;
const indexRouter = require("./routes/index");
const {
  errorHandlerMiddleware,
} = require("./middleware/errorHandler.middleware");
const {
  swaggerSpec,
  swaggerUi,
} = require("./connections/swagger.connections.");
const {
  authApplyHandler,
} = require("./middleware/authApplyHandler.middleware");

/*---------------------------------------------[ Create an instance of Express ]----------------------------------------------*/
const app = express();

/*---------------------------------------------[ middleware ]----------------------------------------------*/
app.use(
  cors({
    origin: true,
    credentials: true,
  })
);
app.use(morgan("tiny"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/*---------------------------------------------[ Serve Swagger UI at /api-docs endpoint ]----------------------------------------------*/
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

/*---------------------------------------------[ Auth middleware ]----------------------------------------------*/
app.use(authApplyHandler);

/*---------------------------------------------[ Listen the server ]----------------------------------------------*/
app.use("/", indexRouter);

/*---------------------------------------------[ Error handler middleware ]----------------------------------------------*/
app.use(errorHandlerMiddleware);

/*---------------------------------------------[ Main Function ]----------------------------------------------*/

function main() {
  /*---------------------------------------------[ Listen the server ]----------------------------------------------*/
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}  🚀🚀🚀🚀🚀`);
  });
}

module.exports = {
  main,
  app,
};
