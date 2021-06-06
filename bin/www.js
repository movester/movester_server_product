const express = require("express");
const app = express();
const port = 5000;
const bodyParser = require("body-parser");
const router = require("../routes/index");

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

app.use("/", router);

app.listen(port, () => console.log(`Prod Server listening on port ${port}!`));
