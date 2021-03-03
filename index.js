// import express framework
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
const router = require("./src/routes");

// gunakan bodyParser JSON
app.use(cors());
app.use(bodyParser.json());
app.use("/api/v1", router);

// defenisikan port disini
const port = 5000;

//ketika aplikasi dijalankan maka dia akan berjalan pada port yang kita definisikan
app.listen(port, () => {
    console.log(`WOW:${port}, is Ready !`);
  });