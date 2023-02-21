const bodyParser = require("body-parser");
const express = require("express");
const app = express();
const { PORT } = require("../backend/config.js");
const cors = require("cors");

// db
require("../backend/db/mongoose");

//parsers | Headers for postman
//Content-Type: application/json
app.use(bodyParser.json());

app.use(cors());

//routes
const apiRouter = require("../backend/routes/api.js");
app.use("/api", apiRouter);

app.listen(PORT, function () {
  console.log("Server is listening on port " + PORT);
});
